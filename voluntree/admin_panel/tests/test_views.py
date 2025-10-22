# admin_panel/tests/test_views.py

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
from events.models import Event
from certificates.models import Certificate
from ..models import PlatformSettings


@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class AdminPanelTests(LiveServerTestCase):
    """
    Test suite for all admin panel views and workflows.
    """

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)

        # Create Test Users
        self.admin_user = User.objects.create_superuser(
            username='shourov', password='123456789', email='22201028@uap-bd.edu', user_type='admin'
        )
        self.volunteer_user = User.objects.create_user(
            username='testvolunteer', password='password123', email='volunteer@test.com', user_type='volunteer'
        )

        # Create Test Data
        self.pending_ngo_user = User.objects.create_user(
            username='pendingngo', password='password123', email='pending@ngo.com', user_type='ngo'
        )
        self.pending_ngo = NGO.objects.create(
            user=self.pending_ngo_user, organization_name='Helping Paws',
            registration_number='NGO-PENDING-123', status='pending'
        )

        self.approved_ngo_user = User.objects.create_user(
            username='approvedngo', password='password123', email='approved@ngo.com', user_type='ngo'
        )
        self.approved_ngo = NGO.objects.create(
            user=self.approved_ngo_user, organization_name='Future Coders',
            registration_number='NGO-APPROVED-456', status='approved'
        )

        self.event = Event.objects.create(
            title="Charity Coding Marathon", ngo=self.approved_ngo,
            date=timezone.now() + timezone.timedelta(days=30),
            location="Test Location", max_volunteers=25, description="A test event."
        )

        self.certificate = Certificate.objects.create(
            event=self.event, status='pending',
            certificate_file=SimpleUploadedFile("test_cert.pdf", b"dummy content", content_type="application/pdf")
        )

    def tearDown(self):
        self.driver.quit()

    def _login_as_admin(self):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('shourov')
        self.driver.find_element(By.NAME, 'password').send_keys('123456789')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(
            EC.url_contains('/admin-panel/dashboard/')
        )

    def test_non_admin_cannot_access_dashboard(self):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('testvolunteer')
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

        self.driver.get(f'{self.live_server_url}/admin-panel/dashboard/')

        # CORRECTED: The user is redirected to /events/, not /admin/login/
        self.assertIn('/events/', self.driver.current_url)

    def test_admin_dashboard_loads_correctly(self):
        self._login_as_admin()
        self.assertIn('/admin-panel/dashboard/', self.driver.current_url)
        # CORRECTED: The H1 tag on the page just says "Dashboard"
        dashboard_title = self.driver.find_element(By.TAG_NAME, 'h1').text
        self.assertEqual("Dashboard", dashboard_title)

        # This checks the "Pending NGO Approvals" alert box for the correct count
        pending_card = self.driver.find_element(By.XPATH, "//*[normalize-space()='Pending NGO Approvals']/..")
        self.assertIn("1 NGO(s)", pending_card.text)

    def test_ngo_approval_workflow(self):
        self._login_as_admin()
        self.driver.get(f'{self.live_server_url}/admin-panel/ngo-approvals/')
        self.assertIn("Helping Paws", self.driver.page_source)

        approve_button = self.driver.find_element(By.CSS_SELECTOR,
                                                  f'form[action*="/admin-panel/ngo/{self.pending_ngo.id}/approve/"] button')
        approve_button.click()

        # CORRECTED: Added code to handle the JavaScript alert
        WebDriverWait(self.driver, 10).until(EC.alert_is_present()).accept()

        # Use the correct success message class and wait for it
        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'admin-alert-success'))
        ).text
        self.assertIn("Helping Paws has been approved successfully!", success_message)
        self.pending_ngo.refresh_from_db()
        self.assertEqual(self.pending_ngo.status, 'approved')

    def test_certificate_approval_workflow(self):
        self._login_as_admin()
        self.driver.get(f'{self.live_server_url}/admin-panel/certificates/')
        self.assertIn("Charity Coding Marathon", self.driver.page_source)

        approve_button = self.driver.find_element(By.CSS_SELECTOR,
                                                  f'form[action*="/admin-panel/certificate/{self.certificate.id}/approve/"] button')
        approve_button.click()

        # CORRECTED: Added code to handle the JavaScript alert
        WebDriverWait(self.driver, 10).until(EC.alert_is_present()).accept()

        success_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'admin-alert-success'))
        ).text
        self.assertIn("has been approved!", success_message)
        self.certificate.refresh_from_db()
        self.assertEqual(self.certificate.status, 'approved')

