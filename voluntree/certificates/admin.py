from django.contrib import admin
from .models import Certificate, CertificateAssignment


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['event', 'status', 'uploaded_at', 'approved_at']
    list_filter = ['status', 'uploaded_at']
    search_fields = ['event__title', 'event__ngo__organization_name']


@admin.register(CertificateAssignment)
class CertificateAssignmentAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'certificate', 'assigned_at']
    list_filter = ['assigned_at']
    search_fields = ['volunteer__username', 'certificate__event__title']