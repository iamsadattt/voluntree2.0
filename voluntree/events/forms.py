from django import forms
from .models import Event

class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'description', 'image', 'date', 'location', 'required_skills', 'max_volunteers', 'status']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter event title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 6,
                'placeholder': 'Describe your event...'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'location': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Event location'
            }),
            'required_skills': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Enter skills separated by commas (e.g., Teaching, First Aid, Communication)'
            }),
            'max_volunteers': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1
            }),
            'status': forms.Select(attrs={
                'class': 'form-control'
            })
        }