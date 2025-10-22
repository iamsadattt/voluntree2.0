#accounts/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, VolunteerProfile, NGO


class VolunteerRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=15, required=False)
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = 'volunteer'
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            # Create volunteer profile
            VolunteerProfile.objects.create(
                user=user,
                phone=self.cleaned_data.get('phone', ''),
                date_of_birth=self.cleaned_data.get('date_of_birth')
            )
        return user


class NGORegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    organization_name = forms.CharField(max_length=200, required=True)
    registration_number = forms.CharField(max_length=100, required=True)
    description = forms.CharField(widget=forms.Textarea, required=True)
    phone = forms.CharField(max_length=15, required=True)
    address = forms.CharField(widget=forms.Textarea, required=True)
    city = forms.CharField(max_length=100, required=True)
    country = forms.CharField(max_length=100, required=True)
    focus_areas = forms.CharField(widget=forms.Textarea, required=True,
                                  help_text="Enter focus areas separated by commas")
    website = forms.URLField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.user_type = 'ngo'
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            # Create NGO profile
            NGO.objects.create(
                user=user,
                organization_name=self.cleaned_data['organization_name'],
                registration_number=self.cleaned_data['registration_number'],
                description=self.cleaned_data['description'],
                phone=self.cleaned_data['phone'],
                email=self.cleaned_data['email'],
                address=self.cleaned_data['address'],
                city=self.cleaned_data['city'],
                country=self.cleaned_data['country'],
                focus_areas=self.cleaned_data['focus_areas'],
                website=self.cleaned_data.get('website', ''),
            )
        return user


class CustomLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))