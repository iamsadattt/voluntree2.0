# accounts/tests/test_forms.py

from django.test import TestCase
from ..forms import VolunteerRegistrationForm

class FormTests(TestCase):

    def test_volunteer_registration_form_valid(self):
        """Tests that the volunteer registration form is valid with correct data."""
        form_data = {
            'username': 'newvolunteer',
            'first_name': 'New',
            'last_name': 'Volunteer',
            'email': 'new@volunteer.com',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123'
        }
        form = VolunteerRegistrationForm(data=form_data)
        if not form.is_valid():
            print(form.errors)
        self.assertTrue(form.is_valid())

    def test_volunteer_registration_form_password_mismatch(self):
        """Tests that the form is invalid if passwords do not match."""
        form_data = {
            'username': 'another_volunteer',
            'first_name': 'Another',
            'last_name': 'Volunteer',
            'email': 'another@volunteer.com',
            'password1': 'password123',
            'password2': 'password456'
        }
        form = VolunteerRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('password2', form.errors)
        # FIXED: Changed the apostrophe from ' to ’ to match the Django error message
        self.assertIn("The two password fields didn’t match.", form.errors['password2'][0])

    def test_volunteer_registration_form_missing_username(self):
        """Tests that the form is invalid if a required field like username is missing."""
        form_data = {
            'username': '',
            'first_name': 'No',
            'last_name': 'Name',
            'email': 'noname@volunteer.com',
            'password1': 'password123',
            'password2': 'password123'
        }
        form = VolunteerRegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())
        self.assertIn('username', form.errors)