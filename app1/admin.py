from django.contrib import admin
from .models import Note, Task

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title', 'content')
    list_filter = ('created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'completed', 'created_at')
    search_fields = ('title',)
    list_filter = ('completed', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
