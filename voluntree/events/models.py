# events/models.py

from django.db import models
from django.utils import timezone
from accounts.models import User, NGO

class Event(models.Model):
    STATUS_CHOICES = (
        ('published', 'Published'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    )

    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=300)
    required_skills = models.TextField(blank=True, help_text="Comma-separated skills")
    max_volunteers = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def get_registered_count(self):
        """Count approved volunteers"""
        return self.registrations.filter(status='approved').count()

    def get_pending_count(self):
        """Count pending applications"""
        return self.registrations.filter(status='pending').count()

    def get_available_spots(self):
        """Calculate remaining spots"""
        return self.max_volunteers - self.get_registered_count()

    def is_full(self):
        """Check if event is at capacity"""
        return self.get_available_spots() <= 0

    def is_past(self):
        """Check if event date has passed"""
        return self.date < timezone.now()

    # ADD THESE TWO METHODS HERE (INSIDE THE CLASS)
    def has_certificate(self):
        """Check if event has a certificate uploaded"""
        return hasattr(self, 'certificate')

    def get_certificate_status(self):
        """Get certificate approval status"""
        if self.has_certificate():
            return self.certificate.status
        return None

    class Meta:
        ordering = ['-created_at']


class EventRegistration(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.volunteer.username} - {self.event.title}"

    class Meta:
        unique_together = ('event', 'volunteer')
        ordering = ['-applied_at']