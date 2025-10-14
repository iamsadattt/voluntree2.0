# certificates/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Volunteer views their certificates
    path('my-certificates/', views.my_certificates, name='my_certificates'),

    # NGO assigns certificates to volunteers
    path('event/<int:event_id>/assign/', views.assign_certificates, name='assign_certificates'),
]