# core/tests/test_views.py

from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from accounts.models import User, NGO


class CoreViewTests(LiveServerTestCase):
    """
    Test suite for the core application views.
    """

    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)

        # Create Test Users for redirect tests
        self.admin_user = User.objects.create_superuser(
            username='coreadmin', password='password123', email='coreadmin@test.com', user_type='admin'
        )
        self.ngo_user = User.objects.create_user(
            username='corengo', password='password123', email='corengo@test.com', user_type='ngo'
        )
        NGO.objects.create(user=self.ngo_user, organization_name='Core Test NGO', registration_number='NGO-CORE')

        self.volunteer_user = User.objects.create_user(
            username='corevolunteer', password='password123', email='corevol@test.com', user_type='volunteer'
        )

    def tearDown(self):
        self.driver.quit()

    def test_landing_page_for_unauthenticated_user(self):
        """Tests that a logged-out user sees the home page correctly."""
        self.driver.get(self.live_server_url)

        # CORRECTED: Check for the actual H1 text from your home.html template
        self.assertIn("Streamlined Volunteer Management", self.driver.page_source)
        self.assertEqual(self.driver.current_url, f'{self.live_server_url}/')

    def test_landing_page_redirects_admin(self):
        """Tests that a logged-in admin is redirected to the admin dashboard."""
        # Log in as admin
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('coreadmin')
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/admin-panel/dashboard/'))

        # Now, try to visit the landing page
        self.driver.get(self.live_server_url)

        # Check for redirect
        WebDriverWait(self.driver, 10).until(EC.url_contains('/admin-panel/dashboard/'))
        self.assertIn('/admin-panel/dashboard/', self.driver.current_url)

    def test_landing_page_redirects_ngo(self):
        """Tests that a logged-in NGO is redirected to the event list."""
        # Log in as NGO
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('corengo')
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

        # Now, try to visit the landing page
        self.driver.get(self.live_server_url)

        # Check for redirect
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))
        self.assertIn('/events/', self.driver.current_url)

    def test_landing_page_redirects_volunteer(self):
        """Tests that a logged-in volunteer is redirected to the event list."""
        # Log in as Volunteer
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys('corevolunteer')
        self.driver.find_element(By.NAME, 'password').send_keys('password123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))

        # Now, try to visit the landing page
        self.driver.get(self.live_server_url)

        # Check for redirect
        WebDriverWait(self.driver, 10).until(EC.url_contains('/events/'))
        self.assertIn('/events/', self.driver.current_url)