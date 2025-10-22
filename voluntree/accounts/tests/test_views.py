# accounts/tests/test_views.py

# ### NEW IMPORTS ADDED HERE ###
import tempfile
from django.test import LiveServerTestCase, override_settings

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from ..models import User, VolunteerProfile, NGO

# ### NEW DECORATOR ADDED HERE ###
# This tells Django to use a temporary directory for media files during this test
@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class AccountAuthenticationTests(LiveServerTestCase):
    """
    Test suite for all authentication and user account flows.
    """
    # The rest of the file is exactly the same as before...
    def setUp(self):
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        self.driver.implicitly_wait(10)

        self.volunteer_user = User.objects.create_user(
            username='testvolunteer',
            password='password123',
            email='volunteer@test.com',
            user_type='volunteer',
            first_name='Test',
            last_name='Volunteer'
        )
        self.volunteer_profile = VolunteerProfile.objects.create(
            user=self.volunteer_user,
            bio='I am a test volunteer.',
            skills='Testing, Debugging'
        )
        self.ngo_user = User.objects.create_user(
            username='testngo',
            password='password123',
            email='ngo@test.com',
            user_type='ngo'
        )
        self.ngo_profile = NGO.objects.create(
            user=self.ngo_user,
            organization_name='Test NGO',
            registration_number='NGO12345',
            description='A test NGO for a good cause.',
            status='approved'
        )

    def tearDown(self):
        self.driver.quit()

    def _login_user(self, username, password):
        self.driver.get(f'{self.live_server_url}/accounts/login/')
        self.driver.find_element(By.NAME, 'username').send_keys(username)
        self.driver.find_element(By.NAME, 'password').send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()

    def test_volunteer_registration_successful(self):
        self.driver.get(f'{self.live_server_url}/accounts/register/volunteer/')
        self.driver.find_element(By.NAME, 'username').send_keys('newvolunteer')
        self.driver.find_element(By.NAME, 'email').send_keys('new@volunteer.com')
        self.driver.find_element(By.NAME, 'password1').send_keys('strongpassword123')
        self.driver.find_element(By.NAME, 'password2').send_keys('strongpassword123')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        welcome_message = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'alert-success'))
        ).text
        self.assertIn('Registration successful!', welcome_message)
        self.assertIn('/events/', self.driver.current_url)

    def test_volunteer_login_and_logout(self):
        self._login_user('testvolunteer', 'password123')
        welcome_message = self.driver.find_element(By.CLASS_NAME, 'alert-success').text
        self.assertIn('Welcome back, testvolunteer!', welcome_message)
        self.assertTrue(self.driver.current_url.endswith('/events/'))
        self.driver.find_element(By.LINK_TEXT, 'Logout').click()
        logout_message = self.driver.find_element(By.CLASS_NAME, 'alert-success').text
        self.assertIn('You have been logged out successfully.', logout_message)
        self.assertTrue(self.driver.current_url.endswith('/accounts/login/'))

    def test_volunteer_can_view_own_profile(self):
        self._login_user('testvolunteer', 'password123')
        self.driver.get(f'{self.live_server_url}/accounts/profile/')
        bio_text = self.driver.find_element(By.CLASS_NAME, 'bio-text').text
        self.assertIn('I am a test volunteer.', bio_text)
        self.assertIn('Testing', self.driver.page_source)
        self.assertIn('Debugging', self.driver.page_source)

    def test_ngo_can_view_own_profile(self):
        self._login_user('testngo', 'password123')
        self.driver.get(f'{self.live_server_url}/accounts/profile/')
        org_name = self.driver.find_element(By.TAG_NAME, 'h1').text
        self.assertIn('Test NGO', org_name)
        self.assertIn('A test NGO for a good cause.', self.driver.page_source)

    def test_unauthenticated_user_redirected_from_profile(self):
        self.driver.get(f'{self.live_server_url}/accounts/profile/')
        self.assertTrue(self.driver.current_url.startswith(f'{self.live_server_url}/accounts/login/'))

    def test_volunteer_can_edit_profile(self):
        self._login_user('testvolunteer', 'password123')
        self.driver.get(f'{self.live_server_url}/accounts/profile/edit/volunteer/')
        bio_field = self.driver.find_element(By.NAME, 'bio')
        skills_field = self.driver.find_element(By.NAME, 'skills')
        bio_field.clear()
        bio_field.send_keys('This is my updated bio.')
        skills_field.clear()
        skills_field.send_keys('Selenium, Python, Django')
        self.driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
        success_message = self.driver.find_element(By.CLASS_NAME, 'alert-success').text
        self.assertIn('Profile updated successfully!', success_message)
        self.assertTrue(self.driver.current_url.endswith('/accounts/profile/'))
        self.assertIn('This is my updated bio.', self.driver.page_source)
        self.assertIn('Selenium', self.driver.page_source)