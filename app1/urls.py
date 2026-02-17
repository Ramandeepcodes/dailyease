from django.contrib import admin
from django.urls import path
from app1 import views

urlpatterns = [
    path("", views.home, name="home"),
    path("notes/", views.notes, name="notes"),
    path("task/", views.task, name="task"),
    path("about/", views.about, name="about"),
    
    # API Endpoints
    path("api/notes/", views.notes_api, name="notes_api"),
    path("api/notes/<int:note_id>/", views.note_detail, name="note_detail"),
    path("api/tasks/", views.tasks_api, name="tasks_api"),
    path("api/tasks/<int:task_id>/", views.task_detail, name="task_detail"),
]
