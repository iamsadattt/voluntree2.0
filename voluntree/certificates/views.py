# certificates/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from .models import Certificate, CertificateAssignment
from events.models import Event, EventRegistration
from accounts.models import NGO


@login_required
def assign_certificates(request, event_id):
    """NGO assigns certificates to volunteers for an event"""
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('event_list')

    event = get_object_or_404(Event, pk=event_id)
    ngo = NGO.objects.get(user=request.user)

    # Check if event belongs to this NGO
    if event.ngo != ngo:
        messages.error(request, 'You can only assign certificates for your own events.')
        return redirect('ngo_events')

    # Check if event has an approved certificate
    if not hasattr(event, 'certificate'):
        messages.error(request, 'This event does not have a certificate uploaded.')
        return redirect('ngo_events')

    if event.certificate.status != 'approved':
        messages.error(request,
                       f'Certificate is {event.certificate.status}. Only approved certificates can be assigned.')
        return redirect('ngo_events')

    # Get all approved volunteers for this event
    approved_registrations = EventRegistration.objects.filter(
        event=event,
        status='approved'
    ).select_related('volunteer', 'volunteer__volunteer_profile')

    # Get already assigned volunteers
    assigned_volunteer_ids = CertificateAssignment.objects.filter(
        certificate=event.certificate
    ).values_list('volunteer_id', flat=True)

    # Handle certificate assignment
    if request.method == 'POST':
        selected_volunteers = request.POST.getlist('volunteers')

        if not selected_volunteers:
            messages.warning(request, 'Please select at least one volunteer.')
        else:
            assigned_count = 0
            already_assigned_count = 0

            for volunteer_id in selected_volunteers:
                volunteer_id = int(volunteer_id)

                # Check if already assigned
                if volunteer_id in assigned_volunteer_ids:
                    already_assigned_count += 1
                    continue

                # Check if volunteer is approved for this event
                registration = approved_registrations.filter(volunteer_id=volunteer_id).first()
                if registration:
                    CertificateAssignment.objects.create(
                        certificate=event.certificate,
                        volunteer_id=volunteer_id
                    )
                    assigned_count += 1

            if assigned_count > 0:
                messages.success(request, f'Certificate assigned to {assigned_count} volunteer(s).')
            if already_assigned_count > 0:
                messages.info(request, f'{already_assigned_count} volunteer(s) already had this certificate.')

            return redirect('assign_certificates', event_id=event_id)

    context = {
        'event': event,
        'registrations': approved_registrations,
        'assigned_volunteer_ids': list(assigned_volunteer_ids),
        'certificate': event.certificate,
    }
    return render(request, 'certificates/assign_certificates.html', context)


@login_required
def my_certificates(request):
    """Volunteer views their certificates"""
    if request.user.user_type != 'volunteer':
        messages.error(request, 'Access denied.')
        return redirect('landing')

    # Get all certificate assignments for this volunteer
    assignments = CertificateAssignment.objects.filter(
        volunteer=request.user
    ).select_related('certificate', 'certificate__event', 'certificate__event__ngo').order_by('-assigned_at')

    context = {
        'assignments': assignments,
    }
    return render(request, 'certificates/my_certificates.html', context)