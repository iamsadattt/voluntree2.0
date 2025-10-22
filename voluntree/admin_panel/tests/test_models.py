# admin_panel/tests/test_models.py

from django.test import TestCase
from ..models import PlatformSettings


class PlatformSettingsModelTest(TestCase):

    def test_load_creates_instance(self):
        """
        Tests that the load() classmethod creates a settings object
        if one does not exist.
        """
        # Delete any existing settings object to start clean
        PlatformSettings.objects.all().delete()
        self.assertEqual(PlatformSettings.objects.count(), 0)

        # Call the load method
        settings = PlatformSettings.load()

        self.assertIsNotNone(settings)
        self.assertEqual(PlatformSettings.objects.count(), 1)
        self.assertEqual(settings.pk, 1)

    def test_load_retrieves_existing_instance(self):
        """
        Tests that calling load() multiple times always returns the same instance.
        """
        settings1 = PlatformSettings.load()
        settings2 = PlatformSettings.load()

        self.assertEqual(settings1.pk, settings2.pk)
        self.assertEqual(PlatformSettings.objects.count(), 1)

    def test_singleton_save_behavior(self):
        """
        Tests that saving a new instance overwrites the singleton instance (pk=1).
        """
        settings = PlatformSettings.load()
        settings.site_name = "Original Name"
        settings.save()

        # Create a new, separate instance and save it
        new_settings = PlatformSettings(site_name="New Name")
        new_settings.save()  # This should force the pk to be 1

        self.assertEqual(PlatformSettings.objects.count(), 1)

        # Verify that the original object, when reloaded, has the new name
        reloaded_settings = PlatformSettings.load()
        self.assertEqual(reloaded_settings.site_name, "New Name")