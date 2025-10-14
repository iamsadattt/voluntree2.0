#accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_choice, name='register'),
    path('register/volunteer/', views.register_volunteer, name='register_volunteer'),
    path('register/ngo/', views.register_ngo, name='register_ngo'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/volunteer/', views.edit_profile_volunteer, name='edit_profile_volunteer'),  # NEW
    path('profile/edit/ngo/', views.edit_profile_ngo, name='edit_profile_ngo'),  # NEW
    path('volunteer/<int:user_id>/', views.view_volunteer_profile, name='view_volunteer_profile'),
]