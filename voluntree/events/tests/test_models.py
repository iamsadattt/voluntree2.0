# events/tests/test_models.py

from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, NGO
from ..models import Event, EventRegistration


class EventModelTests(TestCase):

    def setUp(self):
        # CORRECTED: Added unique emails to all user creations
        ngo_user = User.objects.create_user(username='testngo', password='password', user_type='ngo',
                                            email='ngo@test.com')
        self.ngo = NGO.objects.create(user=ngo_user, organization_name='Test NGO')
        self.volunteer1 = User.objects.create_user(username='vol1', password='password', user_type='volunteer',
                                                   email='vol1@test.com')
        self.volunteer2 = User.objects.create_user(username='vol2', password='password', user_type='volunteer',
                                                   email='vol2@test.com')

        self.future_event = Event.objects.create(
            ngo=self.ngo, title='Future Event', date=timezone.now() + timedelta(days=10), max_volunteers=2,
            status='published'
        )
        self.past_event = Event.objects.create(
            ngo=self.ngo, title='Past Event', date=timezone.now() - timedelta(days=10), max_volunteers=2,
            status='completed'
        )

    def test_is_past_method(self):
        self.assertFalse(self.future_event.is_past())
        self.assertTrue(self.past_event.is_past())

    def test_registration_counts(self):
        self.assertEqual(self.future_event.get_registered_count(), 0)
        self.assertEqual(self.future_event.get_pending_count(), 0)

        EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer1, status='approved')
        EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer2, status='pending')

        self.assertEqual(self.future_event.get_registered_count(), 1)
        self.assertEqual(self.future_event.get_pending_count(), 1)

    def test_is_full_method(self):
        self.assertFalse(self.future_event.is_full())

        EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer1, status='approved')
        self.assertFalse(self.future_event.is_full())

        EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer2, status='approved')
        self.assertTrue(self.future_event.is_full())