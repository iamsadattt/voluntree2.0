# core/views.py

from django.shortcuts import render, redirect


def landing(request):
    # If user is authenticated, redirect them to their dashboard/events page
    if request.user.is_authenticated:
        if request.user.user_type == 'admin':
            return redirect('admin_dashboard')
        else:
            return redirect('event_list')  # Redirect to events page

    return render(request, 'core/home.html')