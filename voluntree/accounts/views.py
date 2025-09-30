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
        return render(request, 'accounts/volunteer_profile.html', {'profile': profile})
    elif user.user_type == 'ngo':
        profile = NGO.objects.get(user=user)
        return render(request, 'accounts/ngo_profile.html', {'profile': profile})
    else:
        return redirect('landing')