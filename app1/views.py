from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
import json
from .models import Note, Task

def home(request):
    return render(request, "home.html")

def notes(request):
    # Ensure CSRF token is generated in template
    get_token(request)
    notes = Note.objects.all()
    return render(request, "notes.html", {'notes': notes})

def task(request):
    # Ensure CSRF token is generated in template
    get_token(request)
    tasks = Task.objects.all()
    return render(request, "task.html", {'tasks': tasks})

def about(request):
    return render(request, "about.html")


# Note API Endpoints
@require_http_methods(["GET", "POST"])
def notes_api(request):
    if request.method == 'GET':
        notes = Note.objects.all().values('id', 'title', 'content', 'created_at', 'updated_at')
        return JsonResponse(list(notes), safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            note = Note.objects.create(
                title=data.get('title', ''),
                content=data.get('content', '')
            )
            return JsonResponse({
                'id': note.id,
                'title': note.title,
                'content': note.content,
                'created_at': note.created_at.isoformat(),
                'updated_at': note.updated_at.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@require_http_methods(["GET", "PUT", "DELETE"])
def note_detail(request, note_id):
    try:
        note = Note.objects.get(id=note_id)
    except Note.DoesNotExist:
        return JsonResponse({'error': 'Note not found'}, status=404)
    
    if request.method == 'GET':
        return JsonResponse({
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'created_at': note.created_at.isoformat(),
            'updated_at': note.updated_at.isoformat()
        })
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            note.title = data.get('title', note.title)
            note.content = data.get('content', note.content)
            note.save()
            return JsonResponse({
                'id': note.id,
                'title': note.title,
                'content': note.content,
                'created_at': note.created_at.isoformat(),
                'updated_at': note.updated_at.isoformat()
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        note.delete()
        return JsonResponse({'message': 'Note deleted'}, status=204)


# Task API Endpoints
@require_http_methods(["GET", "POST"])
def tasks_api(request):
    if request.method == 'GET':
        tasks = Task.objects.all().values('id', 'title', 'completed', 'created_at', 'updated_at')
        return JsonResponse(list(tasks), safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            task = Task.objects.create(
                title=data.get('title', ''),
                completed=data.get('completed', False)
            )
            return JsonResponse({
                'id': task.id,
                'title': task.title,
                'completed': task.completed,
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@require_http_methods(["GET", "PUT", "DELETE"])
def task_detail(request, task_id):
    try:
        task_obj = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    
    if request.method == 'GET':
        return JsonResponse({
            'id': task_obj.id,
            'title': task_obj.title,
            'completed': task_obj.completed,
            'created_at': task_obj.created_at.isoformat(),
            'updated_at': task_obj.updated_at.isoformat()
        })
    
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            task_obj.title = data.get('title', task_obj.title)
            task_obj.completed = data.get('completed', task_obj.completed)
            task_obj.save()
            return JsonResponse({
                'id': task_obj.id,
                'title': task_obj.title,
                'completed': task_obj.completed,
                'created_at': task_obj.created_at.isoformat(),
                'updated_at': task_obj.updated_at.isoformat()
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        task_obj.delete()
        return JsonResponse({'message': 'Task deleted'}, status=204)

