from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_choice, name='register'),
    path('register/volunteer/', views.register_volunteer, name='register_volunteer'),
    path('register/ngo/', views.register_ngo, name='register_ngo'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.profile_view, name='profile'),
]