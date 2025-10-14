# certificates/forms.py

from django import forms
from .models import Certificate


class CertificateUploadForm(forms.ModelForm):
    """Form for NGO to upload certificate template"""

    class Meta:
        model = Certificate
        fields = ['certificate_file']
        widgets = {
            'certificate_file': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png'
            })
        }
        labels = {
            'certificate_file': 'Certificate Template'
        }
        help_texts = {
            'certificate_file': 'Please upload a PDF file for best results. Other formats (Word, Image) are accepted but may not be approved by admin.'
        }

    def clean_certificate_file(self):
        """Validate file upload"""
        file = self.cleaned_data.get('certificate_file')

        if file:
            # Check file size (max 10MB)
            if file.size > 10 * 1024 * 1024:
                raise forms.ValidationError('File size must be less than 10MB.')

            # Optional: Check file extension
            allowed_extensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
            file_ext = file.name.lower().split('.')[-1]
            if f'.{file_ext}' not in allowed_extensions:
                raise forms.ValidationError(
                    'Only PDF, Word documents, and images are allowed.'
                )

        return file