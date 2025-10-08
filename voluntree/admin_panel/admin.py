from django.contrib import admin
from .models import PlatformSettings


@admin.register(PlatformSettings)
class PlatformSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'admin_email', 'maintenance_mode', 'updated_at']

    def has_add_permission(self, request):
        # Only allow one instance
        return not PlatformSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Prevent deletion
        return False