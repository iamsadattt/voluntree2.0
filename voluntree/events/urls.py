# events/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.event_list, name='event_list'),
    path('<int:pk>/', views.event_detail, name='event_detail'),
    path('create/', views.event_create, name='event_create'),
    path('<int:pk>/edit/', views.event_edit, name='event_edit'),
    path('<int:pk>/delete/', views.event_delete, name='event_delete'),
    path('<int:pk>/register/', views.event_register, name='event_register'),
    path('registration/<int:pk>/withdraw/', views.event_withdraw, name='event_withdraw'),
    path('my-events/', views.my_events, name='my_events'),
    path('ngo-events/', views.ngo_events, name='ngo_events'),
    path('<int:pk>/manage/', views.manage_registrations, name='manage_registrations'),
    path('registration/<int:pk>/approve/', views.approve_registration, name='approve_registration'),
    path('registration/<int:pk>/reject/', views.reject_registration, name='reject_registration'),
]