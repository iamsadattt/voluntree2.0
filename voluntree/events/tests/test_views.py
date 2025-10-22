# events/tests/test_views.py

import tempfile
from django.test import LiveServerTestCase, override_settings
from django.utils import timezone
from datetime import timedelta
from django.core.files.uploadedfile import SimpleUploadedFile
from selenium.webdriver.support.ui import Select

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from accounts.models import User, NGO
from ..models import Event, EventRegistration


@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class EventFlowsTests(LiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)

        # Users
        self.ngo_user = User.objects.create_user(username='eventngo', password='password123', user_type='ngo',
                                                 email='eventngo@test.com')
        self.approved_ngo = NGO.objects.create(user=self.ngo_user, organization_name='Approved NGO', status='approved')

        self.volunteer1 = User.objects.create_user(username='eventvol1', password='password123', user_type='volunteer',
                                                   email='eventvol1@test.com')
        self.volunteer2 = User.objects.create_user(username='eventvol2', password='password123', user_type='volunteer',
                                                   email='eventvol2@test.com')

        # Events
        self.future_event = Event.objects.create(
            ngo=self.approved_ngo, title='Upcoming Charity Run', date=timezone.now() + timedelta(days=5),
            status='published', max_volunteers=10
        )

    def tearDown(self):
        self.driver.quit()

    def _login(self, username, password):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys(username)
        self.driver.find_element(By.NAME, 'password').send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

    def test_ngo_creates_event(self):
        """Tests the full workflow of an NGO creating a new event."""
        self._login('eventngo', 'password123')
        self.driver.get(f'{self.live_server_url}/events/create/')

        # Fill out the form
        self.driver.find_element(By.NAME, 'title').send_keys('New Community Garden')
        self.driver.find_element(By.NAME, 'description').send_keys('Helping plant a new garden.')

        date_element = self.driver.find_element(By.NAME, 'date')
        future_date_str = (timezone.now() + timedelta(days=30)).strftime('%Y-%m-%dT%H:%M')
        self.driver.execute_script("arguments[0].value = arguments[1];", date_element, future_date_str)

        self.driver.find_element(By.NAME, 'location').send_keys('Downtown Park')
        self.driver.find_element(By.NAME, 'max_volunteers').send_keys('15')
        self.driver.find_element(By.NAME, 'required_skills').send_keys('Gardening, Teamwork')

        status_dropdown = Select(self.driver.find_element(By.NAME, 'status'))
        status_dropdown.select_by_value('published')

        # CORRECTED: Added the missing 'image' file upload to ensure the form is valid.
        image_path = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
        self.driver.find_element(By.NAME, 'image').send_keys(image_path)

        cert_path = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False).name
        self.driver.find_element(By.NAME, 'certificate_file').send_keys(cert_path)

        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/ngo-events/'))
        self.assertIn('Event created successfully!', self.driver.page_source)
        self.assertIn('New Community Garden', self.driver.page_source)

    def test_volunteer_registration_and_withdrawal(self):
        """Tests a volunteer registering for an event and then withdrawing."""
        self._login('eventvol1', 'password123')

        self.driver.get(f'{self.live_server_url}/events/{self.future_event.pk}/')

        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Register for Event')]").click()

        # CORRECTED: Wait for the success message to appear before checking its contents.
        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-success'))
        ).text
        self.assertIn('Application submitted!', success_message)
        self.assertTrue(self.driver.find_element(By.XPATH, "//div[contains(@class, 'status-pending')]").is_displayed())

        registration = EventRegistration.objects.get(volunteer=self.volunteer1, event=self.future_event)
        registration.status = 'approved'
        registration.save()

        self.driver.get(f'{self.live_server_url}/events/my-events/')
        self.assertIn('Upcoming Charity Run', self.driver.page_source)

        self.driver.find_element(By.CSS_SELECTOR, 'button.btn-withdraw').click()
        WebDriverWait(self.driver, 10).until(EC.alert_is_present()).accept()

        self.assertIn('You have withdrawn from the event', self.driver.page_source)
        self.assertNotIn('Upcoming Charity Run', self.driver.page_source)

    def test_ngo_manages_registrations(self):
        """Tests an NGO approving and rejecting volunteer applications."""
        reg_to_approve = EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer1,
                                                          status='pending')
        reg_to_reject = EventRegistration.objects.create(event=self.future_event, volunteer=self.volunteer2,
                                                         status='pending')

        self._login('eventngo', 'password123')
        self.driver.get(f'{self.live_server_url}/events/{self.future_event.pk}/manage/')

        self.assertIn(self.volunteer1.username, self.driver.page_source)
        self.assertIn(self.volunteer2.username, self.driver.page_source)

        # --- Approve Registration ---
        self.driver.find_element(By.CSS_SELECTOR,
                                 f'form[action*="/events/registration/{reg_to_approve.pk}/approve/"] button').click()

        # CORRECTED: Wait for the success message to appear before asserting its content.
        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-success'))
        ).text
        self.assertIn(f'{self.volunteer1.username} has been approved!', success_message)

        approved_badge = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".registration-card.status-approved .status-badge"))
        )
        self.assertEqual('Approved', approved_badge.text)

        # --- Reject Registration ---
        self.driver.find_element(By.CSS_SELECTOR,
                                 f'form[action*="/events/registration/{reg_to_reject.pk}/reject/"] button').click()
        WebDriverWait(self.driver, 10).until(EC.alert_is_present()).accept()

        # Wait for a new success message to appear.
        WebDriverWait(self.driver, 10).until(
            EC.text_to_be_present_in_element((By.CLASS_NAME, 'alert-success'),
                                             f'{self.volunteer2.username} has been rejected.')
        )
        self.assertIn(f'{self.volunteer2.username} has been rejected.', self.driver.page_source)

        rejected_badge = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".registration-card.status-rejected .status-badge"))
        )
        self.assertEqual('Rejected', rejected_badge.text)