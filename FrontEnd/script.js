console.log('script.js is running');

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

    let allProjects = JSON.parse(localStorage.getItem('projects')) || [];
    let allCategories = [];

    // Fonction pour récupérer les projets depuis l'API (si nécessaire)
    async function fetchProjetsFromAPI() {
        if (allProjects.length === 0) {
            try {
                const response = await fetch(apiWorksUrl);
                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`);
                }
                allProjects = await response.json();
                localStorage.setItem('projects', JSON.stringify(allProjects));
                afficherGaleriePrincipale();
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error);
            }
        } else {
            console.log('Chargement des projets depuis le localStorage');
            afficherGaleriePrincipale();
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
            displayFilters();
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

        applyImageStyles();
    }

    // Fonction pour afficher les filtres
    function displayFilters() {
        filtersContainer.innerHTML = '';

        const allFilter = document.createElement('button');
        allFilter.textContent = 'Tous';
        allFilter.classList.add('filter-btn');
        allFilter.addEventListener('click', () => {
            afficherGaleriePrincipale();
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

    // Fonction pour afficher les projets filtrés dans la galerie principale
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

        applyImageStyles();
    }

    // Fonction pour appliquer les styles aux images dans la galerie principale
    function applyImageStyles() {
        const images = galleryContainer.querySelectorAll('img');
        images.forEach(image => {
            image.style.width = '100%';
            image.style.height = 'auto';
            image.style.maxHeight = '407px';
            image.style.objectFit = 'cover';
            image.style.objectPosition = 'center';
        });
    }

    // Fonction pour gérer l'affichage des éléments pour l'utilisateur connecté
    function toggleElementsForLoggedInUser() {
        const token = localStorage.getItem('token');
        if (token) {
            editModeBanner.style.display = 'block';
            editLink.style.display = 'inline';
            filtersContainer.style.display = 'none';
            addPhotoBtn.style.display = 'block';
        } else {
            editModeBanner.style.display = 'none';
            editLink.style.display = 'none';
            filtersContainer.style.display = 'flex';
            addPhotoBtn.style.display = 'none';
        }
    }

    // Fonction pour ouvrir la modale
    function openModal() {
        console.log('Ouverture de la modale ou activation du mode édition');
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Ajout des événements pour les boutons
    if (openModalBtn) {
        openModalBtn.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    }

    if (editModeLink) {
        editModeLink.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });
    }

    // Mise à jour de la galerie principale lorsqu'un projet est ajouté ou supprimé
    document.addEventListener('updateGallery', () => {
        console.log('updateGallery event detected');
        allProjects = JSON.parse(localStorage.getItem('projects')) || [];
        afficherGaleriePrincipale();
    });

    fetchProjetsFromAPI();
    fetchCategoriesFromAPI();
    toggleElementsForLoggedInUser();
});
