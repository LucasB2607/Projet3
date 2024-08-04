document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded'); // Vérifier que le document est chargé

    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Empêche le formulaire de se soumettre normalement

            console.log('Form submitted'); // Débogage

            const email = document.getElementById('username').value; // Utiliser le champ email
            const password = document.getElementById('password').value;

            // Réinitialise le message d'erreur
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }

            try {
                const response = await fetch('http://localhost:5678/api/users/login', { // URL corrigée
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password }) // Utiliser email et password
                });

                console.log('Response status:', response.status); // Débogage
                const data = await response.json();
                console.log('Response data:', data); // Débogage

                if (response.ok) {
                    // Stocker le token d'authentification
                    localStorage.setItem('token', data.token);
                    // Rediriger vers la page d'accueil
                    window.location.href = 'index.html';
                } else if (response.status === 401 || response.status === 404) {
                    // Afficher un message d'erreur
                    if (errorMessage) {
                        errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                // Afficher un message d'erreur général
                if (errorMessage) {
                    errorMessage.textContent = 'Erreur dans l’identifiant ou le mot de passe';
                    errorMessage.style.display = 'block';
                }
            }
        });
    } else {
        console.error('Form not found'); // Débogage si le formulaire n'est pas trouvé
    }
});
