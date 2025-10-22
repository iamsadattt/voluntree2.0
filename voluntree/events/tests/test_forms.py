# events/tests/test_forms.py

from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from ..forms import EventForm
from ..models import Event
from accounts.models import User, NGO
from certificates.models import Certificate


class EventFormTests(TestCase):

    def setUp(self):
        ngo_user = User.objects.create_user(username='testngo', password='password', user_type='ngo',
                                            email='ngo@test.com')
        self.ngo = NGO.objects.create(user=ngo_user, organization_name='Test NGO')

    def test_certificate_file_required_on_create(self):
        form = EventForm()
        self.assertTrue(form.fields['certificate_file'].required)

    def test_certificate_file_not_required_on_edit(self):
        # CORRECTED: Added the required 'max_volunteers' field
        event = Event.objects.create(
            ngo=self.ngo, title="Test Event", date=timezone.now(), status='published', max_volunteers=10
        )
        Certificate.objects.create(event=event, status='approved',
                                   certificate_file=SimpleUploadedFile("cert.pdf", b"dummy"))

        event.refresh_from_db()

        form = EventForm(instance=event)
        self.assertFalse(form.fields['certificate_file'].required)

    def test_form_with_invalid_file_extension(self):
        invalid_file = SimpleUploadedFile("test.txt", b"this is not a valid file type")
        form_data = {
            'title': 'Test Event', 'date': timezone.now(), 'location': 'Here',
            'max_volunteers': 10, 'status': 'published', 'description': 'desc', 'required_skills': 'none'
        }
        file_data = {'certificate_file': invalid_file}

        form = EventForm(form_data, file_data)
        self.assertFalse(form.is_valid())
        self.assertIn('certificate_file', form.errors)
        self.assertIn('Only PDF, Word documents, and images are allowed.', form.errors['certificate_file'][0])

    def test_form_with_file_too_large(self):
        large_content = b'a' * (11 * 1024 * 1024)
        large_file = SimpleUploadedFile("large_file.pdf", large_content)
        form_data = {
            'title': 'Test Event', 'date': timezone.now(), 'location': 'Here',
            'max_volunteers': 10, 'status': 'published', 'description': 'desc', 'required_skills': 'none'
        }
        file_data = {'certificate_file': large_file}

        form = EventForm(form_data, file_data)
        self.assertFalse(form.is_valid())
        self.assertIn('certificate_file', form.errors)
        self.assertIn('File size must be less than 10MB.', form.errors['certificate_file'][0])