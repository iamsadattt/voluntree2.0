# certificates/models.py

from django.db import models
from django.utils import timezone
from accounts.models import User
from events.models import Event


class Certificate(models.Model):
    """Certificate template uploaded by NGO for an event"""
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    event = models.OneToOneField(
        Event,
        on_delete=models.CASCADE,
        related_name='certificate'
    )
    certificate_file = models.FileField(
        upload_to='certificates/templates/',
        help_text='Upload certificate template (PDF recommended)'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Certificate for {self.event.title}"

    class Meta:
        ordering = ['-uploaded_at']


class CertificateAssignment(models.Model):
    """Tracks which volunteers have been assigned certificates"""
    certificate = models.ForeignKey(
        Certificate,
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    volunteer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='certificate_assignments'
    )
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.volunteer.username} - {self.certificate.event.title}"

    class Meta:
        unique_together = ('certificate', 'volunteer')
        ordering = ['-assigned_at']