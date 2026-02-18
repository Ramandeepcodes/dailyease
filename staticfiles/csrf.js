// CSRF Token Helper
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function getCsrfToken() {
	return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// API call helper with CSRF protection
function apiCall(url, method = 'GET', data = null) {
	const options = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCsrfToken()
		}
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	return fetch(url, options);
}
