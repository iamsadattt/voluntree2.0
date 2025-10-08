from django.db import models


class PlatformSettings(models.Model):
    """Single instance model for platform configuration"""

    # Site Information
    site_name = models.CharField(max_length=100, default='Voluntree')
    site_tagline = models.CharField(max_length=200, blank=True)
    site_description = models.TextField(blank=True)

    # Email Configuration
    admin_email = models.EmailField()
    support_email = models.EmailField(blank=True)
    noreply_email = models.EmailField(blank=True)
    send_welcome_email = models.BooleanField(default=True)
    send_approval_emails = models.BooleanField(default=True)
    send_event_reminders = models.BooleanField(default=True)

    # Event Settings
    require_event_approval = models.BooleanField(default=False)
    max_event_duration = models.IntegerField(default=30, help_text="Maximum event duration in days")
    min_volunteers_per_event = models.IntegerField(default=1)
    max_volunteers_per_event = models.IntegerField(default=100)
    event_cancellation_hours = models.IntegerField(default=24, help_text="Minimum hours notice for cancellation")
    auto_complete_events = models.BooleanField(default=True)

    # Registration Settings
    allow_volunteer_registration = models.BooleanField(default=True)
    allow_ngo_registration = models.BooleanField(default=True)
    require_email_verification = models.BooleanField(default=False)
    min_volunteer_age = models.IntegerField(default=13)

    # NGO Settings
    require_ngo_verification = models.BooleanField(default=True)
    auto_approve_verified_ngos = models.BooleanField(default=False)
    ngo_approval_time = models.IntegerField(default=3, help_text="Review time in days")

    # Notification Settings
    enable_push_notifications = models.BooleanField(default=False)
    enable_sms_notifications = models.BooleanField(default=False)
    notify_on_new_event = models.BooleanField(default=True)
    notify_on_event_update = models.BooleanField(default=True)

    # Maintenance
    maintenance_mode = models.BooleanField(default=False)
    maintenance_message = models.TextField(default='We are currently performing maintenance. Please check back soon.')

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Platform Settings"
        verbose_name_plural = "Platform Settings"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Prevent deletion
        pass

    @classmethod
    def load(cls):
        """Get or create the settings instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Platform Settings - {self.site_name}"