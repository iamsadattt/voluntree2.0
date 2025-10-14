# events/forms.py

from django import forms
from .models import Event
from certificates.models import Certificate


class EventForm(forms.ModelForm):
    # Add certificate field
    certificate_file = forms.FileField(
        required=True,
        label='Certificate Template',
        help_text='Upload certificate template (PDF recommended). This will be reviewed by admin before you can assign it to volunteers.',
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png'
        })
    )

    class Meta:
        model = Event
        fields = ['title', 'description', 'image', 'date', 'location', 'required_skills', 'max_volunteers', 'status']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter event title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 6,
                'placeholder': 'Describe your event...'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'location': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Event location'
            }),
            'required_skills': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Enter skills separated by commas (e.g., Teaching, First Aid, Communication)'
            }),
            'max_volunteers': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1
            }),
            'status': forms.Select(attrs={
                'class': 'form-control'
            })
        }

    def __init__(self, *args, **kwargs):
        # Get the instance if editing
        instance = kwargs.get('instance')
        super().__init__(*args, **kwargs)

        # If editing an existing event with certificate, make certificate optional
        if instance and hasattr(instance, 'certificate'):
            self.fields['certificate_file'].required = False
            self.fields['certificate_file'].help_text = (
                f'Current certificate status: <strong>{instance.certificate.get_status_display()}</strong>. '
                'Upload a new file only if you want to replace it (requires admin re-approval).'
            )

    def clean_certificate_file(self):
        """Validate certificate file"""
        file = self.cleaned_data.get('certificate_file')

        if file:
            # Check file size (max 10MB)
            if file.size > 10 * 1024 * 1024:
                raise forms.ValidationError('File size must be less than 10MB.')

            # Check file extension
            allowed_extensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
            file_ext = file.name.lower().split('.')[-1]
            if f'.{file_ext}' not in allowed_extensions:
                raise forms.ValidationError(
                    'Only PDF, Word documents, and images are allowed.'
                )

        return file