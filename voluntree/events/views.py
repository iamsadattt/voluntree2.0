#events/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from django.utils import timezone
from .models import Event, EventRegistration
from .forms import EventForm
from accounts.models import NGO
from certificates.models import Certificate


def event_list(request):
    """Public event listing - anyone can view, hides past events"""
    # Filter out past events by default
    events = Event.objects.filter(date__gte=timezone.now())

    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        events = events.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(location__icontains=search_query)
        )

    # Filter by status
    status_filter = request.GET.get('status', '')
    if status_filter:
        events = events.filter(status=status_filter)

    context = {
        'events': events,
        'search_query': search_query,
        'status_filter': status_filter,
    }
    return render(request, 'events/event_list.html', context)


def event_detail(request, pk):
    """Public event detail - anyone can view"""
    event = get_object_or_404(Event, pk=pk)

    # Check if current user has registered (if logged in)
    user_registration = None
    if request.user.is_authenticated and request.user.user_type == 'volunteer':
        user_registration = EventRegistration.objects.filter(
            event=event,
            volunteer=request.user
        ).first()

    # Get skill list
    skills_list = [s.strip() for s in event.required_skills.split(',') if s.strip()]

    # Get approved volunteers
    approved_volunteers = event.registrations.filter(status='approved').select_related('volunteer')

    context = {
        'event': event,
        'user_registration': user_registration,
        'skills_list': skills_list,
        'approved_volunteers': approved_volunteers,
    }
    return render(request, 'events/event_detail.html', context)


@login_required
def event_create(request):
    """NGO creates new event"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Only NGOs can create events.')
        return redirect('event_list')

    ngo = NGO.objects.get(user=request.user)

    if ngo.status != 'approved':
        messages.error(request, 'Your NGO must be approved before creating events.')
        return redirect('profile')

    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES)
        if form.is_valid():
            event = form.save(commit=False)
            event.ngo = ngo
            event.save()

            # Handle certificate upload
            certificate_file = form.cleaned_data.get('certificate_file')
            if certificate_file:
                Certificate.objects.create(
                    event=event,
                    certificate_file=certificate_file,
                    status='pending'
                )

            messages.success(request, 'Event created successfully! Certificate is pending admin approval.')
            return redirect('ngo_events')
    else:
        form = EventForm()

    return render(request, 'events/event_form.html', {'form': form, 'action': 'Create'})


@login_required
def event_edit(request, pk):
    """NGO edits their event"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    event = get_object_or_404(Event, pk=pk)
    ngo = NGO.objects.get(user=request.user)

    if event.ngo != ngo:
        messages.error(request, 'You can only edit your own events.')
        return redirect('event_list')

    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES, instance=event)
        if form.is_valid():
            event = form.save()

            # Handle certificate upload/replacement
            certificate_file = form.cleaned_data.get('certificate_file')
            if certificate_file:
                # Delete old certificate if exists
                if hasattr(event, 'certificate'):
                    event.certificate.delete()

                # Create new certificate (pending approval)
                Certificate.objects.create(
                    event=event,
                    certificate_file=certificate_file,
                    status='pending'
                )
                messages.info(request, 'New certificate uploaded. Waiting for admin approval.')

            messages.success(request, 'Event updated successfully!')
            return redirect('ngo_events')
    else:
        form = EventForm(instance=event)

    return render(request, 'events/event_form.html', {'form': form, 'action': 'Edit', 'event': event})


@login_required
def event_delete(request, pk):
    """NGO deletes their event"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    event = get_object_or_404(Event, pk=pk)
    ngo = NGO.objects.get(user=request.user)

    if event.ngo != ngo:
        messages.error(request, 'You can only delete your own events.')
        return redirect('event_list')

    if request.method == 'POST':
        event.delete()
        messages.success(request, 'Event deleted successfully!')
        return redirect('ngo_events')

    return render(request, 'events/event_confirm_delete.html', {'event': event})


@login_required
def event_register(request, pk):
    """Volunteer registers for an event"""
    if request.user.user_type != 'volunteer':
        messages.error(request, 'Only volunteers can register for events.')
        return redirect('event_detail', pk=pk)

    event = get_object_or_404(Event, pk=pk)

    # Check if event is in the past
    if event.is_past():
        messages.error(request, 'Cannot register for past events.')
        return redirect('event_detail', pk=pk)

    # Check if already registered
    existing = EventRegistration.objects.filter(event=event, volunteer=request.user).first()
    if existing:
        messages.warning(request, 'You have already applied for this event.')
        return redirect('event_detail', pk=pk)

    # Check if event is full
    if event.is_full():
        messages.error(request, 'This event is at full capacity.')
        return redirect('event_detail', pk=pk)

    # Create registration
    EventRegistration.objects.create(
        event=event,
        volunteer=request.user,
        status='pending'
    )

    messages.success(request, 'Application submitted! Waiting for NGO approval.')
    return redirect('event_detail', pk=pk)


@login_required
def event_withdraw(request, pk):
    """Volunteer withdraws from an event"""
    if request.user.user_type != 'volunteer':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    registration = get_object_or_404(EventRegistration, pk=pk, volunteer=request.user)

    if registration.status == 'withdrawn':
        messages.warning(request, 'You have already withdrawn from this event.')
    else:
        registration.status = 'withdrawn'
        registration.save()
        messages.success(request, 'You have withdrawn from the event.')

    return redirect('my_events')


@login_required
def my_events(request):
    """Volunteer's registered events"""
    if request.user.user_type != 'volunteer':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    registrations = EventRegistration.objects.filter(
        volunteer=request.user
    ).exclude(
        status='withdrawn'
    ).select_related('event', 'event__ngo')

    context = {
        'registrations': registrations,
    }
    return render(request, 'events/my_events.html', context)


@login_required
def ngo_events(request):
    """NGO's created events"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    ngo = NGO.objects.get(user=request.user)
    events = Event.objects.filter(ngo=ngo)

    context = {
        'events': events,
        'ngo': ngo,
    }
    return render(request, 'events/ngo_events.html', context)


@login_required
def manage_registrations(request, pk):
    """NGO manages volunteer registrations for their event"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    event = get_object_or_404(Event, pk=pk)
    ngo = NGO.objects.get(user=request.user)

    if event.ngo != ngo:
        messages.error(request, 'You can only manage your own events.')
        return redirect('ngo_events')

    registrations = event.registrations.exclude(
        status='withdrawn'
    ).select_related('volunteer', 'volunteer__volunteer_profile')

    context = {
        'event': event,
        'registrations': registrations,
    }
    return render(request, 'events/manage_registrations.html', context)


@login_required
def approve_registration(request, pk):
    """NGO approves a volunteer registration"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    registration = get_object_or_404(EventRegistration, pk=pk)
    ngo = NGO.objects.get(user=request.user)

    if registration.event.ngo != ngo:
        messages.error(request, 'Access denied.')
        return redirect('ngo_events')

    # Check if event is full
    if registration.event.is_full() and registration.status != 'approved':
        messages.error(request, 'Event is at full capacity.')
        return redirect('manage_registrations', pk=registration.event.pk)

    registration.status = 'approved'
    registration.save()
    messages.success(request, f'{registration.volunteer.username} has been approved!')

    return redirect('manage_registrations', pk=registration.event.pk)


@login_required
def reject_registration(request, pk):
    """NGO rejects a volunteer registration"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    registration = get_object_or_404(EventRegistration, pk=pk)
    ngo = NGO.objects.get(user=request.user)

    if registration.event.ngo != ngo:
        messages.error(request, 'Access denied.')
        return redirect('ngo_events')

    registration.status = 'rejected'
    registration.save()
    messages.success(request, f'{registration.volunteer.username} has been rejected.')

    return redirect('manage_registrations', pk=registration.event.pk)