document.addEventListener('DOMContentLoaded', () => {
	const titleInput = document.getElementById('note-title');
	const contentInput = document.getElementById('note-content');
	const addButton = document.getElementById('add-note-button');
	const notesList = document.getElementById('notes-list');

	let notes = [];
	let editingId = null;

	// Load notes from database on page load
	fetchNotes();

	addButton.addEventListener('click', () => {
		const title = titleInput.value.trim();
		const content = contentInput.value.trim();

		if (!title && !content) return;

		if (editingId) {
			// Update existing note
			updateNote(editingId, title, content);
			editingId = null;
			addButton.textContent = 'Add Note';
		} else {
			// Create new note
			createNote(title, content);
		}

		titleInput.value = '';
		contentInput.value = '';
	});

	function fetchNotes() {
		apiCall('/api/notes/')
			.then(response => response.json())
			.then(data => {
				notes = data;
				renderNotes();
			})
			.catch(error => console.error('Error fetching notes:', error));
	}

	function createNote(title, content) {
		apiCall('/api/notes/', 'POST', { title, content })
			.then(response => response.json())
			.then(note => {
				notes.unshift(note);
				renderNotes();
			})
			.catch(error => console.error('Error creating note:', error));
	}

	function updateNote(noteId, title, content) {
		apiCall(`/api/notes/${noteId}/`, 'PUT', { title, content })
			.then(response => response.json())
			.then(note => {
				const idx = notes.findIndex(n => n.id === noteId);
				if (idx !== -1) {
					notes[idx] = note;
				}
				renderNotes();
			})
			.catch(error => console.error('Error updating note:', error));
	}

	function deleteNote(noteId) {
		apiCall(`/api/notes/${noteId}/`, 'DELETE')
			.then(() => {
				notes = notes.filter(n => n.id !== noteId);
				renderNotes();
			})
			.catch(error => console.error('Error deleting note:', error));
	}

	function renderNotes() {
		notesList.innerHTML = '';
		if (!notes.length) {
			const li = document.createElement('li');
			li.textContent = 'No notes yet. Add one above.';
			notesList.appendChild(li);
			return;
		}

		notes.forEach(note => {
			const li = document.createElement('li');
			li.className = 'note-item';

			const header = document.createElement('div');
			header.className = 'note-header';

			const h4 = document.createElement('h4');
			h4.textContent = note.title || '(untitled)';
			header.appendChild(h4);

			const meta = document.createElement('small');
			const date = new Date(note.created_at);
			meta.textContent = date.toLocaleString();
			header.appendChild(meta);

			li.appendChild(header);

			const p = document.createElement('p');
			p.textContent = note.content;
			li.appendChild(p);

			const actions = document.createElement('div');
			actions.className = 'note-actions';

			const editBtn = document.createElement('button');
			editBtn.textContent = 'Edit';
			editBtn.addEventListener('click', () => {
				titleInput.value = note.title;
				contentInput.value = note.content;
				editingId = note.id;
				addButton.textContent = 'Save';
			});

			const delBtn = document.createElement('button');
			delBtn.textContent = 'Delete';
			delBtn.addEventListener('click', () => {
				if (!confirm('Delete this note?')) return;
				deleteNote(note.id);
			});

			actions.appendChild(editBtn);
			actions.appendChild(delBtn);
			li.appendChild(actions);

			notesList.appendChild(li);
		});
	}
});

