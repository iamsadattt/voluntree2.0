#admin_panel/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, VolunteerProfile, NGO
from events.models import Event, EventRegistration
from .models import PlatformSettings
from certificates.models import Certificate
from django.utils import timezone
from certificates.models import Certificate, CertificateAssignment



def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and user.user_type == 'admin'


@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Admin dashboard with statistics"""

    # Calculate statistics
    total_volunteers = User.objects.filter(user_type='volunteer').count()
    total_ngos = NGO.objects.count()
    approved_ngos = NGO.objects.filter(status='approved').count()
    pending_ngos = NGO.objects.filter(status='pending').count()
    total_events = Event.objects.count()
    upcoming_events = Event.objects.filter(date__gte=timezone.now(), status='published').count()

    # Calculate total volunteer hours
    total_hours = VolunteerProfile.objects.aggregate(Sum('hours_completed'))['hours_completed__sum'] or 0

    # Recent volunteers (last 5)
    recent_volunteers = User.objects.filter(user_type='volunteer').order_by('-date_joined')[:5]

    # Recent NGOs (last 5)
    recent_ngos = NGO.objects.order_by('-created_at')[:5]

    # Upcoming events (next 5)
    upcoming_events_list = Event.objects.filter(
        date__gte=timezone.now(),
        status='published'
    ).order_by('date')[:5]

    context = {
        'total_volunteers': total_volunteers,
        'total_ngos': total_ngos,
        'approved_ngos': approved_ngos,
        'pending_ngos': pending_ngos,
        'total_events': total_events,
        'upcoming_events': upcoming_events,
        'total_hours': total_hours,
        'recent_volunteers': recent_volunteers,
        'recent_ngos': recent_ngos,
        'upcoming_events_list': upcoming_events_list,
    }

    return render(request, 'admin_panel/dashboard.html', context)


@login_required
@user_passes_test(is_admin)
def ngo_approvals(request):
    """NGO approval management"""

    status_filter = request.GET.get('status', 'pending')

    if status_filter == 'all':
        ngos = NGO.objects.all()
    else:
        ngos = NGO.objects.filter(status=status_filter)

    ngos = ngos.order_by('-created_at')

    # Get counts
    pending_count = NGO.objects.filter(status='pending').count()
    approved_count = NGO.objects.filter(status='approved').count()
    rejected_count = NGO.objects.filter(status='rejected').count()
    total_count = NGO.objects.count()

    context = {
        'ngos': ngos,
        'status_filter': status_filter,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'rejected_count': rejected_count,
        'total_count': total_count,
    }

    return render(request, 'admin_panel/ngo_approvals.html', context)


@login_required
@user_passes_test(is_admin)
def approve_ngo(request, ngo_id):
    """Approve an NGO"""
    if request.method == 'POST':
        ngo = get_object_or_404(NGO, id=ngo_id)
        ngo.status = 'approved'
        ngo.approved_at = timezone.now()
        ngo.save()
        messages.success(request, f'{ngo.organization_name} has been approved successfully!')
    return redirect('admin_ngo_approvals')


@login_required
@user_passes_test(is_admin)
def reject_ngo(request, ngo_id):
    """Reject an NGO"""
    if request.method == 'POST':
        ngo = get_object_or_404(NGO, id=ngo_id)
        ngo.status = 'rejected'
        ngo.approved_at = None
        ngo.save()
        messages.warning(request, f'{ngo.organization_name} has been rejected.')
    return redirect('admin_ngo_approvals')


@login_required
@user_passes_test(is_admin)
def ngo_detail(request, ngo_id):
    """View NGO details"""
    ngo = get_object_or_404(NGO, id=ngo_id)
    events = ngo.events.all()

    context = {
        'ngo': ngo,
        'events': events,
    }
    return render(request, 'admin_panel/ngo_detail.html', context)


@login_required
@user_passes_test(is_admin)
def users_list(request):
    """List all volunteers"""

    search_query = request.GET.get('search', '')

    volunteers = User.objects.filter(user_type='volunteer')

    if search_query:
        volunteers = volunteers.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )

    volunteers = volunteers.order_by('-date_joined')

    context = {
        'volunteers': volunteers,
        'search_query': search_query,
        'total_volunteers': volunteers.count(),
    }

    return render(request, 'admin_panel/users.html', context)


@login_required
@user_passes_test(is_admin)
def user_detail(request, user_id):
    """View user details"""
    user = get_object_or_404(User, id=user_id, user_type='volunteer')
    profile = user.volunteer_profile
    registrations = EventRegistration.objects.filter(volunteer=user)

    context = {
        'volunteer': user,
        'profile': profile,
        'registrations': registrations,
    }
    return render(request, 'admin_panel/user_detail.html', context)


@login_required
@user_passes_test(is_admin)
def user_delete(request, user_id):
    """Delete a volunteer"""
    if request.method == 'POST':
        user = get_object_or_404(User, id=user_id, user_type='volunteer')
        username = user.username
        user.delete()
        messages.success(request, f'User {username} has been deleted.')
    return redirect('admin_users')


@login_required
@user_passes_test(is_admin)
def ngos_list(request):
    """List all NGOs"""

    search_query = request.GET.get('search', '')

    ngos = NGO.objects.all()

    if search_query:
        ngos = ngos.filter(
            Q(organization_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(registration_number__icontains=search_query)
        )

    ngos = ngos.order_by('-created_at')

    approved_ngos = NGO.objects.filter(status='approved').count()

    context = {
        'ngos': ngos,
        'search_query': search_query,
        'total_ngos': ngos.count(),
        'approved_ngos': approved_ngos,
    }

    return render(request, 'admin_panel/ngos.html', context)


@login_required
@user_passes_test(is_admin)
def ngo_delete(request, ngo_id):
    """Delete an NGO"""
    if request.method == 'POST':
        ngo = get_object_or_404(NGO, id=ngo_id)
        org_name = ngo.organization_name
        ngo.user.delete()  # This will cascade delete the NGO
        messages.success(request, f'{org_name} has been deleted.')
    return redirect('admin_ngos')


@login_required
@user_passes_test(is_admin)
def events_list(request):
    """List all events"""

    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')

    events = Event.objects.all()

    if search_query:
        events = events.filter(
            Q(title__icontains=search_query) |
            Q(ngo__organization_name__icontains=search_query)
        )

    if status_filter:
        events = events.filter(status=status_filter)

    events = events.order_by('-created_at')

    context = {
        'events': events,
        'search_query': search_query,
        'status_filter': status_filter,
        'total_events': events.count(),
    }

    return render(request, 'admin_panel/events.html', context)


@login_required
@user_passes_test(is_admin)
def event_detail(request, event_id):
    """View event details"""
    event = get_object_or_404(Event, id=event_id)
    registrations = event.registrations.all()

    # Split comma-separated skills
    skills_list = []
    if event.required_skills:
        skills_list = [skill.strip() for skill in event.required_skills.split(',') if skill.strip()]

    context = {
        'event': event,
        'registrations': registrations,
        'skills_list': skills_list,  # Add this
    }
    return render(request, 'admin_panel/admin_event_detail.html', context)

@login_required
@user_passes_test(is_admin)
def event_delete(request, event_id):
    """Delete an event"""
    if request.method == 'POST':
        event = get_object_or_404(Event, id=event_id)
        title = event.title
        event.delete()
        messages.success(request, f'Event "{title}" has been deleted.')
    return redirect('admin_events')


@login_required
@user_passes_test(is_admin)
def platform_settings(request):
    """Platform settings configuration"""

    settings = PlatformSettings.load()

    if request.method == 'POST':
        # Site Information
        settings.site_name = request.POST.get('site_name', 'Voluntree')
        settings.site_tagline = request.POST.get('site_tagline', '')
        settings.site_description = request.POST.get('site_description', '')

        # Email Configuration
        settings.admin_email = request.POST.get('admin_email', '')
        settings.support_email = request.POST.get('support_email', '')
        settings.noreply_email = request.POST.get('noreply_email', '')
        settings.send_welcome_email = 'send_welcome_email' in request.POST
        settings.send_approval_emails = 'send_approval_emails' in request.POST
        settings.send_event_reminders = 'send_event_reminders' in request.POST

        # Event Settings
        settings.require_event_approval = 'require_event_approval' in request.POST
        settings.max_event_duration = int(request.POST.get('max_event_duration', 30))
        settings.min_volunteers_per_event = int(request.POST.get('min_volunteers_per_event', 1))
        settings.max_volunteers_per_event = int(request.POST.get('max_volunteers_per_event', 100))
        settings.event_cancellation_hours = int(request.POST.get('event_cancellation_hours', 24))
        settings.auto_complete_events = 'auto_complete_events' in request.POST

        # Registration Settings
        settings.allow_volunteer_registration = 'allow_volunteer_registration' in request.POST
        settings.allow_ngo_registration = 'allow_ngo_registration' in request.POST
        settings.require_email_verification = 'require_email_verification' in request.POST
        settings.min_volunteer_age = int(request.POST.get('min_volunteer_age', 13))

        # NGO Settings
        settings.require_ngo_verification = 'require_ngo_verification' in request.POST
        settings.auto_approve_verified_ngos = 'auto_approve_verified_ngos' in request.POST
        settings.ngo_approval_time = int(request.POST.get('ngo_approval_time', 3))

        # Notification Settings
        settings.enable_push_notifications = 'enable_push_notifications' in request.POST
        settings.enable_sms_notifications = 'enable_sms_notifications' in request.POST
        settings.notify_on_new_event = 'notify_on_new_event' in request.POST
        settings.notify_on_event_update = 'notify_on_event_update' in request.POST

        # Maintenance
        settings.maintenance_mode = 'maintenance_mode' in request.POST
        settings.maintenance_message = request.POST.get('maintenance_message', '')

        settings.save()
        messages.success(request, 'Platform settings updated successfully!')
        return redirect('admin_settings')

    context = {
        'settings': settings,
    }

    return render(request, 'admin_panel/settings.html', context)


# Placeholder views for edit functionality
@login_required
@user_passes_test(is_admin)
def user_edit(request, user_id):
    """Edit user - placeholder for future implementation"""
    messages.info(request, 'Edit functionality coming soon!')
    return redirect('admin_users')


@login_required
@user_passes_test(is_admin)
def ngo_edit(request, ngo_id):
    """Edit NGO - placeholder for future implementation"""
    messages.info(request, 'Edit functionality coming soon!')
    return redirect('admin_ngos')


@login_required
@user_passes_test(is_admin)
def event_edit(request, event_id):
    """Edit event - placeholder for future implementation"""
    messages.info(request, 'Edit functionality coming soon!')
    return redirect('admin_events')


@login_required
@user_passes_test(is_admin)
def approve_certificate(request, event_id):
    """Admin approves a certificate"""
    if request.method == 'POST':
        event = get_object_or_404(Event, id=event_id)

        if hasattr(event, 'certificate'):
            certificate = event.certificate
            certificate.status = 'approved'
            certificate.approved_at = timezone.now()
            certificate.rejected_at = None
            certificate.save()
            messages.success(request, f'Certificate for "{event.title}" has been approved.')
        else:
            messages.error(request, 'This event does not have a certificate.')

    return redirect('admin_event_detail', event_id=event_id)


@login_required
@user_passes_test(is_admin)
def reject_certificate(request, event_id):
    """Admin rejects and deletes a certificate"""
    if request.method == 'POST':
        event = get_object_or_404(Event, id=event_id)

        if hasattr(event, 'certificate'):
            certificate = event.certificate
            certificate.delete()  # Delete the certificate completely
            messages.warning(request,
                             f'Certificate for "{event.title}" has been rejected and removed. NGO must upload a new one.')
        else:
            messages.error(request, 'This event does not have a certificate.')

    return redirect('admin_event_detail', event_id=event_id)




# Add these views to admin_panel/views.py

@login_required
@user_passes_test(is_admin)
def certificate_approvals(request):
    """Certificate approval management"""

    status_filter = request.GET.get('status', 'pending')
    search_query = request.GET.get('search', '')
    sort_by = request.GET.get('sort', 'newest')

    # Base queryset
    certificates = Certificate.objects.select_related(
        'event',
        'event__ngo',
        'event__ngo__user'
    )

    # Apply status filter
    if status_filter == 'all':
        pass  # Show all
    else:
        certificates = certificates.filter(status=status_filter)

    # Apply search filter
    if search_query:
        certificates = certificates.filter(
            Q(event__title__icontains=search_query) |
            Q(event__ngo__organization_name__icontains=search_query)
        )

    # Apply sorting
    if sort_by == 'oldest':
        certificates = certificates.order_by('uploaded_at')
    else:  # newest
        certificates = certificates.order_by('-uploaded_at')

    # Get counts for filter tabs
    pending_count = Certificate.objects.filter(status='pending').count()
    approved_count = Certificate.objects.filter(status='approved').count()
    rejected_count = Certificate.objects.filter(status='rejected').count()
    total_count = Certificate.objects.count()

    context = {
        'certificates': certificates,
        'status_filter': status_filter,
        'search_query': search_query,
        'sort_by': sort_by,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'rejected_count': rejected_count,
        'total_count': total_count,
    }

    return render(request, 'admin_panel/certificate_approvals.html', context)


@login_required
@user_passes_test(is_admin)
def approve_certificate_action(request, certificate_id):
    """Approve a certificate"""
    if request.method == 'POST':
        certificate = get_object_or_404(Certificate, id=certificate_id)
        certificate.status = 'approved'
        certificate.approved_at = timezone.now()
        certificate.rejected_at = None
        certificate.save()
        messages.success(request, f'Certificate for "{certificate.event.title}" has been approved!')
    return redirect('admin_certificate_approvals')


@login_required
@user_passes_test(is_admin)
def reject_certificate_action(request, certificate_id):
    """Reject and delete a certificate"""
    if request.method == 'POST':
        certificate = get_object_or_404(Certificate, id=certificate_id)
        event_title = certificate.event.title
        certificate.delete()  # Delete the certificate
        messages.warning(request,
                         f'Certificate for "{event_title}" has been rejected and deleted. NGO must upload a new one.')
    return redirect('admin_certificate_approvals')


@login_required
@user_passes_test(is_admin)
def certificate_detail(request, certificate_id):
    """View certificate details"""
    certificate = get_object_or_404(
        Certificate.objects.select_related('event', 'event__ngo'),
        id=certificate_id
    )

    # Get assignments for this certificate
    assignments = CertificateAssignment.objects.filter(
        certificate=certificate
    ).select_related('volunteer', 'volunteer__volunteer_profile')

    context = {
        'certificate': certificate,
        'assignments': assignments,
        'assignments_count': assignments.count(),
    }

    return render(request, 'admin_panel/certificate_detail.html', context)