document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');

    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Empêche le formulaire de se soumettre normalement

            console.log('Form submitted');

            const email = document.getElementById('username').value; // Récupérer l'email
            const password = document.getElementById('password').value;

            // Réinitialiser le message d'erreur
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
                errorMessage.textContent = ''; // Réinitialiser le contenu du message
            }

            try {
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }) // Envoyer l'email et le mot de passe
                });

                const data = await response.json();
                console.log('Response status:', response.status);
                console.log('Response data:', data);

                if (response.ok) {
                    // Stocker le token d'authentification
                    localStorage.setItem('token', data.token);
                    // Rediriger vers la page d'accueil
                    window.location.href = 'index.html';
                } else if (response.status === 401 || response.status === 404) {
                    if (errorMessage) {
                        errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
                        errorMessage.style.display = 'block';
                    }
                } else {
                    // Gestion d'autres codes d'erreur
                    if (errorMessage) {
                        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'Erreur de connexion. Veuillez vérifier votre connexion Internet et réessayer.';
                    errorMessage.style.display = 'block';
                }
            }
        });
    } else {
        console.error('Login form not found');
    }
});