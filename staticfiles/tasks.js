document.addEventListener('DOMContentLoaded', () => {
	const titleInput = document.getElementById('task-title');
	const addButton = document.getElementById('add-button');
	const taskList = document.getElementById('task-list');

	let tasks = [];

	// Load tasks from database on page load
	fetchTasks();

	// Add Task Button Click Handler
	addButton.addEventListener('click', () => {
		const title = titleInput.value.trim();
		if (!title) return;

		createTask(title);
		titleInput.value = '';
	});

	function fetchTasks() {
		apiCall('/api/tasks/')
			.then(response => response.json())
			.then(data => {
				tasks = data;
				renderTasks();
			})
			.catch(error => console.error('Error fetching tasks:', error));
	}

	function createTask(title) {
		apiCall('/api/tasks/', 'POST', { title, completed: false })
			.then(response => response.json())
			.then(task => {
				tasks.unshift(task);
				renderTasks();
			})
			.catch(error => console.error('Error creating task:', error));
	}

	function updateTask(taskId, completed, title) {
		apiCall(`/api/tasks/${taskId}/`, 'PUT', { completed, title })
			.then(response => response.json())
			.then(task => {
				const idx = tasks.findIndex(t => t.id === taskId);
				if (idx !== -1) {
					tasks[idx] = task;
				}
				renderTasks();
			})
			.catch(error => console.error('Error updating task:', error));
	}

	function deleteTask(taskId) {
		apiCall(`/api/tasks/${taskId}/`, 'DELETE')
			.then(() => {
				tasks = tasks.filter(t => t.id !== taskId);
				renderTasks();
			})
			.catch(error => console.error('Error deleting task:', error));
	}

	function renderTasks() {
		taskList.innerHTML = '';
		if (!tasks.length) {
			const li = document.createElement('li');
			li.textContent = 'No tasks yet. Add one above.';
			taskList.appendChild(li);
			return;
		}

		tasks.forEach(task => {
			const li = document.createElement('li');
			li.className = 'task-item';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = task.completed;
			checkbox.addEventListener('change', () => {
				updateTask(task.id, checkbox.checked, task.title);
			});

			const span = document.createElement('span');
			span.textContent = task.title;
			if (task.completed) span.classList.add('completed');

			const editBtn = document.createElement('button');
			editBtn.textContent = 'Edit';
			editBtn.addEventListener('click', () => {
				const newTitle = prompt('Edit task title', task.title);
				if (newTitle === null) return;
				updateTask(task.id, task.completed, newTitle.trim() || task.title);
			});

			const delBtn = document.createElement('button');
			delBtn.textContent = 'Delete';
			delBtn.addEventListener('click', () => {
				if (!confirm('Delete this task?')) return;
				deleteTask(task.id);
			});

			li.appendChild(checkbox);
			li.appendChild(span);
			li.appendChild(editBtn);
			li.appendChild(delBtn);

			taskList.appendChild(li);
		});
	}
});

