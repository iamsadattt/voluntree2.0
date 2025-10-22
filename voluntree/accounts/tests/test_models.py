# accounts/tests/test_models.py

from django.test import TestCase
from ..models import User, VolunteerProfile, NGO


class ModelTests(TestCase):

    def test_create_volunteer_user(self):
        """Tests the creation of a user with the 'volunteer' type."""
        user = User.objects.create_user(
            username='testvolunteer',
            password='password123',
            email='volunteer@test.com',
            user_type='volunteer'
        )
        self.assertEqual(user.username, 'testvolunteer')
        self.assertEqual(user.user_type, 'volunteer')
        self.assertTrue(user.check_password('password123'))

    def test_volunteer_profile_str_method(self):
        """Tests the __str__ method of the VolunteerProfile model."""
        user = User.objects.create_user(username='testvol', user_type='volunteer')
        profile = VolunteerProfile.objects.create(user=user, bio='A test bio.')

        # The __str__ method should return "testvol's Profile"
        self.assertEqual(str(profile), "testvol's Profile")

    def test_ngo_model_str_method(self):
        """Tests the __str__ method of the NGO model."""
        user = User.objects.create_user(username='testngo', user_type='ngo')
        ngo = NGO.objects.create(
            user=user,
            organization_name='Helping Hands',
            registration_number='NGO123'
        )

        # The __str__ method should return the organization's name
        self.assertEqual(str(ngo), 'Helping Hands')