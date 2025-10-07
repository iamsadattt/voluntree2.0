from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'ngo', 'date', 'location', 'status', 'max_volunteers', 'get_registered_count',
                    'created_at']
    list_filter = ['status', 'date', 'created_at']
    search_fields = ['title', 'description', 'location', 'ngo__organization_name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Event Information', {
            'fields': ('ngo', 'title', 'description', 'image')
        }),
        ('Event Details', {
            'fields': ('date', 'location', 'required_skills', 'max_volunteers')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_registered_count(self, obj):
        return obj.get_registered_count()

    get_registered_count.short_description = 'Registered'


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['volunteer', 'event', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['volunteer__username', 'event__title']
    readonly_fields = ['applied_at', 'updated_at']

    fieldsets = (
        ('Registration Details', {
            'fields': ('event', 'volunteer', 'status')
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )