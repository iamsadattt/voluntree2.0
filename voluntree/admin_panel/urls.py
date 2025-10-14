# admin_panel/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),

    # NGO Approvals
    path('ngo-approvals/', views.ngo_approvals, name='admin_ngo_approvals'),
    path('ngo/<int:ngo_id>/approve/', views.approve_ngo, name='admin_approve_ngo'),
    path('ngo/<int:ngo_id>/reject/', views.reject_ngo, name='admin_reject_ngo'),
    path('ngo/<int:ngo_id>/detail/', views.ngo_detail, name='admin_ngo_detail'),

    # Users Management
    path('users/', views.users_list, name='admin_users'),
    path('user/<int:user_id>/detail/', views.user_detail, name='admin_user_detail'),
    path('user/<int:user_id>/edit/', views.user_edit, name='admin_user_edit'),
    path('user/<int:user_id>/delete/', views.user_delete, name='admin_user_delete'),

    # NGOs Management
    path('ngos/', views.ngos_list, name='admin_ngos'),
    path('ngo/<int:ngo_id>/edit/', views.ngo_edit, name='admin_ngo_edit'),
    path('ngo/<int:ngo_id>/delete/', views.ngo_delete, name='admin_ngo_delete'),

    # Events Management
    path('events/', views.events_list, name='admin_events'),
    path('event/<int:event_id>/detail/', views.event_detail, name='admin_event_detail'),
    path('event/<int:event_id>/edit/', views.event_edit, name='admin_event_edit'),
    path('event/<int:event_id>/delete/', views.event_delete, name='admin_event_delete'),

    # Certificate Approval (NEW)
    path('event/<int:event_id>/certificate/approve/', views.approve_certificate, name='admin_approve_certificate'),
    path('event/<int:event_id>/certificate/reject/', views.reject_certificate, name='admin_reject_certificate'),

    # Settings
    path('settings/', views.platform_settings, name='admin_settings'),
]