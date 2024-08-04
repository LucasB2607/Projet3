document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const filtersContainer = document.querySelector('.filters'); // Filtres -> Sélectionne le conteneur pour les boutons de filtre


    // URL de l'API pour récupérer les projets et les catégories
    const apiWorksUrl = 'http://localhost:5678/api/works';
    const apiCategoriesUrl = 'http://localhost:5678/api/categories'; // Filtres

    let allProjects = []; // Ajout de la variable globale pour stocker les projets


    // Fonction pour récupérer les projets depuis l'API
    async function fetchProjets() {
        try {
            const response = await fetch(apiWorksUrl);
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }
            const projets = await response.json();
            allProjects = projets;
            console.log(projets); // Affiche les projets dans la console
            afficherProjets(projets);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error);
        }
    }

    // Fonction pour afficher les projets dans la galerie
    function afficherProjets(projets) {
        gallery.innerHTML = ''; // Vide la galerie avant d'ajouter les nouveaux projets
        projets.forEach(projet => {
            const projetElement = document.createElement('figure');
            projetElement.innerHTML = `
                <img src="${projet.imageUrl}" alt="${projet.title}">
                <figcaption>${projet.title}</figcaption>
            `;
            gallery.appendChild(projetElement);
        });
    }



    // PARTIE FILTRES --- Section: Gestion des Filtres ---
    // Fonction pour récupérer les catégories depuis l'API
    async function fetchCategories() {
        try {
            const response = await fetch(apiCategoriesUrl);
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }
            const categories = await response.json();
            console.log(categories); // Affiche les catégories dans la console
            afficherCategories(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }

    // Fonction pour afficher les catégories sous forme de boutons de filtre
    function afficherCategories(categories) {
        // Crée un bouton pour afficher tous les projets
        const allCategoriesButton = document.createElement('button');
        allCategoriesButton.innerText = 'Toutes';
        allCategoriesButton.addEventListener('click', () => afficherProjets(allProjects));
        filtersContainer.appendChild(allCategoriesButton);

        // Crée un bouton pour chaque catégorie
        categories.forEach(category => {
            const categoryButton = document.createElement('button');
            categoryButton.innerText = category.name;
            categoryButton.addEventListener('click', () => filterProjetsParCategorie(category.id));
            filtersContainer.appendChild(categoryButton);
        });
    }

    // Fonction pour récupérer et afficher les projets par catégorie
    function filterProjetsParCategorie(categoryId) { 
        const projetsFiltres = allProjects.filter(projet => projet.categoryId === categoryId); // <--- Filtre les projets stockés localement
        afficherProjets(projetsFiltres); // Affiche les projets filtrés
    }

    // --- Section: Appels Initiaux ---
    fetchProjets();
    fetchCategories();
});