# certificates/tests/test_views.py

import tempfile
from django.test import LiveServerTestCase, override_settings
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from accounts.models import User, NGO
from events.models import Event, EventRegistration
from ..models import Certificate, CertificateAssignment


@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class CertificateFlowsTests(LiveServerTestCase):
    """
    Test suite for certificate assignment and viewing workflows.
    """

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)

        # Create Users
        self.ngo_user = User.objects.create_user(username='goodngo', password='password123', email='good@ngo.com',
                                                 user_type='ngo')
        self.other_ngo_user = User.objects.create_user(username='otherngo', password='password123',
                                                       email='other@ngo.com', user_type='ngo')
        self.volunteer1 = User.objects.create_user(username='volunteer1', password='password123',
                                                   email='volunteer1@test.com', user_type='volunteer')
        self.volunteer2 = User.objects.create_user(username='volunteer2', password='password123',
                                                   email='volunteer2@test.com', user_type='volunteer')

        # Create NGO Profiles
        self.ngo = NGO.objects.create(user=self.ngo_user, organization_name='Good Deeds Inc.',
                                      registration_number='NGO-1')
        self.other_ngo = NGO.objects.create(user=self.other_ngo_user, organization_name='Other Org',
                                            registration_number='NGO-2')

        # Create Events & Certificates
        self.event_approved_cert = Event.objects.create(
            ngo=self.ngo, title='Beach Cleanup', date=timezone.now(), location='Beach', max_volunteers=10
        )
        self.approved_cert = Certificate.objects.create(
            event=self.event_approved_cert, status='approved',
            certificate_file=SimpleUploadedFile("approved.pdf", b"dummy")
        )

        self.event_pending_cert = Event.objects.create(
            ngo=self.ngo, title='Tree Planting', date=timezone.now(), location='Park', max_volunteers=10
        )
        Certificate.objects.create(
            event=self.event_pending_cert, status='pending',
            certificate_file=SimpleUploadedFile("pending.pdf", b"dummy")
        )

        self.other_ngo_event = Event.objects.create(
            ngo=self.other_ngo, title='Rival Event', date=timezone.now(), location='City', max_volunteers=10
        )

        # Register volunteers
        EventRegistration.objects.create(event=self.event_approved_cert, volunteer=self.volunteer1, status='approved')
        EventRegistration.objects.create(event=self.event_approved_cert, volunteer=self.volunteer2, status='approved')

    def tearDown(self):
        self.driver.quit()

    def _login_as_ngo(self):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('goodngo')
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

    def _login_as_volunteer(self, username='volunteer1'):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys(username)
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

    def test_ngo_can_assign_certificate(self):
        self._login_as_ngo()
        assign_url = f'{self.live_server_url}/certificates/event/{self.event_approved_cert.id}/assign/'
        self.driver.get(assign_url)

        self.assertIn("volunteer1", self.driver.page_source)
        self.assertIn("volunteer2", self.driver.page_source)

        self.driver.find_element(By.CSS_SELECTOR, f'input[value="{self.volunteer1.id}"]').click()
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-success'))
        ).text
        self.assertIn("Certificate assigned to 1 volunteer(s)", success_message)

        self.assertTrue(CertificateAssignment.objects.filter(
            certificate=self.approved_cert, volunteer=self.volunteer1
        ).exists())

    def test_volunteer_can_view_assigned_certificate(self):
        CertificateAssignment.objects.create(certificate=self.approved_cert, volunteer=self.volunteer1)

        self._login_as_volunteer('volunteer1')
        self.driver.get(f'{self.live_server_url}/certificates/my-certificates/')

        self.assertIn("Beach Cleanup", self.driver.page_source)
        self.assertIn("Good Deeds Inc.", self.driver.page_source)

    def test_access_denied_for_wrong_ngo(self):
        self._login_as_ngo()
        self.driver.get(f'{self.live_server_url}/certificates/event/{self.other_ngo_event.id}/assign/')

        # CORRECTED: Wait for the error message to appear after the redirect
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-error'))
        ).text
        self.assertIn("You can only assign certificates for your own events.", error_message)
        self.assertIn('/events/ngo-events/', self.driver.current_url)

    def test_access_denied_for_pending_certificate(self):
        self._login_as_ngo()
        self.driver.get(f'{self.live_server_url}/certificates/event/{self.event_pending_cert.id}/assign/')

        # CORRECTED: Wait for the error message to appear after the redirect
        error_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-error'))
        ).text
        self.assertIn("Only approved certificates can be assigned.", error_message)
        self.assertIn('/events/ngo-events/', self.driver.current_url)