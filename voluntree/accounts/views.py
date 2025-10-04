from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import VolunteerRegistrationForm, NGORegistrationForm, CustomLoginForm
from .models import User, VolunteerProfile, NGO


def register_choice(request):
    """Landing page to choose registration type"""
    return render(request, 'accounts/register.html')


def register_volunteer(request):
    if request.method == 'POST':
        form = VolunteerRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful! Welcome to Voluntree.')
            return redirect('landing')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = VolunteerRegistrationForm()

    return render(request, 'accounts/register_volunteer.html', {'form': form})


def register_ngo(request):
    if request.method == 'POST':
        form = NGORegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful! Your NGO account is pending approval.')
            return redirect('landing')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = NGORegistrationForm()

    return render(request, 'accounts/register_ngo.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('landing')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = CustomLoginForm()

    return render(request, 'accounts/login.html', {'form': form})


def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('landing')


@login_required
def profile_view(request):
    user = request.user
    if user.user_type == 'volunteer':
        profile = VolunteerProfile.objects.get(user=user)
        # Split comma-separated fields
        context = {
            'profile': profile,
            'skills_list': [s.strip() for s in profile.skills.split(',') if s.strip()] if profile.skills else [],
            'interests_list': [i.strip() for i in profile.interests.split(',') if i.strip()] if profile.interests else [],
        }
        return render(request, 'accounts/volunteer_profile.html', context)
    elif user.user_type == 'ngo':
        profile = NGO.objects.get(user=user)
        # Split comma-separated fields
        context = {
            'profile': profile,
            'focus_areas_list': [a.strip() for a in profile.focus_areas.split(',') if a.strip()] if profile.focus_areas else [],
        }
        return render(request, 'accounts/ngo_profile.html', context)
    else:
        return redirect('landing')


@login_required
def edit_profile_volunteer(request):
    if request.user.user_type != 'volunteer':
        messages.error(request, 'Access denied.')
        return redirect('profile')

    profile = VolunteerProfile.objects.get(user=request.user)

    if request.method == 'POST':
        # Update User fields
        request.user.first_name = request.POST.get('first_name', '')
        request.user.last_name = request.POST.get('last_name', '')
        request.user.email = request.POST.get('email', '')
        request.user.save()

        # Update VolunteerProfile fields
        profile.phone = request.POST.get('phone', '')
        profile.date_of_birth = request.POST.get('date_of_birth') or None
        profile.bio = request.POST.get('bio', '')
        profile.skills = request.POST.get('skills', '')
        profile.interests = request.POST.get('interests', '')
        profile.availability = request.POST.get('availability', '')
        profile.address = request.POST.get('address', '')
        profile.city = request.POST.get('city', '')
        profile.country = request.POST.get('country', '')

        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']

        profile.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')

    context = {
        'profile': profile,
        'user': request.user,
    }
    return render(request, 'accounts/edit_profile_volunteer.html', context)


@login_required
def edit_profile_ngo(request):
    if request.user.user_type != 'ngo':
        messages.error(request, 'Access denied.')
        return redirect('profile')

    profile = NGO.objects.get(user=request.user)

    if request.method == 'POST':
        # Update NGO profile fields
        profile.organization_name = request.POST.get('organization_name', '')
        # registration_number is readonly, don't update it
        profile.website = request.POST.get('website', '')
        profile.description = request.POST.get('description', '')
        profile.focus_areas = request.POST.get('focus_areas', '')
        profile.email = request.POST.get('email', '')
        profile.phone = request.POST.get('phone', '')
        profile.address = request.POST.get('address', '')
        profile.city = request.POST.get('city', '')
        profile.country = request.POST.get('country', '')

        # Handle logo upload
        if 'logo' in request.FILES:
            profile.logo = request.FILES['logo']

        # Handle verification document upload
        if 'verification_document' in request.FILES:
            profile.verification_document = request.FILES['verification_document']
            # If new documents are uploaded, set status back to pending
            if profile.status == 'approved':
                profile.status = 'pending'
                messages.info(request, 'Your profile will need re-verification due to document changes.')

        profile.save()
        messages.success(request, 'Organization profile updated successfully!')
        return redirect('profile')

    context = {
        'profile': profile,
    }
    return render(request, 'accounts/edit_profile_ngo.html', context)