document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery');
    const filtersContainer = document.querySelector('.filters');
    const editModeBanner = document.getElementById('edit-mode-banner');
    const editLink = document.querySelector('.edit-link');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const openModalBtn = document.getElementById('open-modal-btn');
    const editModeLink = document.getElementById('edit-mode-link');

    const apiWorksUrl = 'http://localhost:5678/api/works';
    const apiCategoriesUrl = 'http://localhost:5678/api/categories';

    allProjects = [];
    allCategories = [];

    // Fonction pour récupérer les projets depuis l'API
    async function fetchProjetsFromAPI() {
        try {
            const response = await fetch(apiWorksUrl);
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }
            allProjects = await response.json();
            afficherGaleriePrincipale();  // Affiche les projets dans la galerie principale
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        }
    }

    // Fonction pour récupérer les catégories depuis l'API
    async function fetchCategoriesFromAPI() {
        try {
            const response = await fetch(apiCategoriesUrl);
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }
            allCategories = await response.json();
            displayFilters();  // Affiche les filtres après récupération des catégories
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }

    // Fonction pour afficher les projets dans la galerie principale
    function afficherGaleriePrincipale() {
        galleryContainer.innerHTML = '';
        allProjects.forEach(projet => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('project-item');

            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;

            const title = document.createElement('p');
            title.textContent = projet.title;
            title.classList.add('project-title');

            projectElement.appendChild(img);
            projectElement.appendChild(title);

            galleryContainer.appendChild(projectElement);
        });
    }

    // Fonction pour afficher les filtres
    function displayFilters() {
        filtersContainer.innerHTML = '';

        const allFilter = document.createElement('button');
        allFilter.textContent = 'Tous';
        allFilter.classList.add('filter-btn');
        allFilter.addEventListener('click', () => {
            afficherGaleriePrincipale();  // Afficher tous les projets
        });
        filtersContainer.appendChild(allFilter);

        allCategories.forEach(category => {
            const filterButton = document.createElement('button');
            filterButton.textContent = category.name;
            filterButton.classList.add('filter-btn');
            filterButton.addEventListener('click', () => {
                const filteredProjects = allProjects.filter(projet => projet.categoryId === category.id);
                afficherProjetsFiltres(filteredProjects);
            });
            filtersContainer.appendChild(filterButton);
        });
    }

    // Fonction pour afficher les projets filtrés
    function afficherProjetsFiltres(projetsFiltres) {
        galleryContainer.innerHTML = '';
        projetsFiltres.forEach(projet => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('project-item');

            const img = document.createElement('img');
            img.src = projet.imageUrl;
            img.alt = projet.title;

            const title = document.createElement('p');
            title.textContent = projet.title;
            title.classList.add('project-title');

            projectElement.appendChild(img);
            projectElement.appendChild(title);

            galleryContainer.appendChild(projectElement);
        });
    }

    // Fonction pour gérer l'affichage des éléments pour l'utilisateur connecté
    function toggleElementsForLoggedInUser() {
        const token = localStorage.getItem('token');
        if (token) {
            editModeBanner.style.display = 'block';
            editLink.style.display = 'inline';
            filtersContainer.style.display = 'none';  // Masquer les filtres après connexion
            addPhotoBtn.style.display = 'block';

        } else {
            editModeBanner.style.display = 'none';
            editLink.style.display = 'none';
            filtersContainer.style.display = 'flex';  // Afficher les filtres avant la connexion
            addPhotoBtn.style.display = 'none';
        }

        fetchProjetsFromAPI();  // Récupérer les projets depuis l'API après la connexion
        fetchCategoriesFromAPI();  // Récupérer les catégories après la connexion

    }

    // Fonction pour gérer le lien login/logout
    function updateLoginLogoutLink() {
        const loginLogoutLink = document.getElementById('login-logout-link');
        const token = localStorage.getItem('token');

        if (token) {
            loginLogoutLink.textContent = 'logout';
            loginLogoutLink.removeAttribute('href');
            loginLogoutLink.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        } else {
            loginLogoutLink.textContent = 'login';
            loginLogoutLink.setAttribute('href', 'login.html');
        }
    }

    // Met à jour la galerie principale quand l'événement 'updateGallery' est détecté
    document.addEventListener('updateGallery', () => {
        console.log('Mise à jour de la galerie principale détectée');
        afficherGaleriePrincipale();
    });

    // Initialisation de la page
    toggleElementsForLoggedInUser();  // Afficher selon l'état de connexion
    updateLoginLogoutLink();  // Mettre à jour le lien de connexion/déconnexion
    afficherGaleriePrincipale();
});
