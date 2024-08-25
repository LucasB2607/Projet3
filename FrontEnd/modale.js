document.addEventListener('DOMContentLoaded', () => {
    console.log('modale.js is running');

    const galleryView = document.getElementById('gallery-view');
    const addPhotoView = document.getElementById('add-photo-view');
    const openModalBtn = document.getElementById('open-modal-btn');
    const editModeLink = document.getElementById('edit-mode-link');
    const backArrow = document.getElementsByClassName('back-arrow')[0];
    const modal = document.getElementById('modal');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const form = document.getElementById('add-project-form');
    const errorMessage = document.getElementById('error-message');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const uploadPhotoLabel = document.querySelector('.upload-photo-label');

    console.log('openModalBtn:', openModalBtn);

    let allProjects = JSON.parse(localStorage.getItem('projects')) || []; // Charger les projets depuis le localStorage

    // Fonction pour initialiser les projets après récupération via l'API
    function initializeProjects(projects) {
        console.log('initializeProjects called with:', projects);
        allProjects = projects;
        localStorage.setItem('projects', JSON.stringify(allProjects)); // Sauvegarder les projets dans le localStorage
        console.log('allProjects après initializeProjects:', allProjects);
    }

    // Fonction pour afficher les projets dans la galerie de la modale
    function afficherProjetsDansModale() {
        console.log('afficherProjetsDansModale est appelée');
        console.log('Displaying projects in modal:', allProjects);
        const projectsGallery = document.getElementById('projects-gallery');
        console.log('projectsGallery après ouverture de la modale:', projectsGallery);
        projectsGallery.innerHTML = '';

        allProjects.forEach(projet => {
            console.log('Creating element for:', projet);
            const projetElement = document.createElement('div');
            projetElement.className = 'project-item';
            projetElement.innerHTML = `
                <img src="${projet.imageUrl}" alt="${projet.title}" class="modal-image">
                <span class="delete-icon"><i class="fas fa-trash-alt"></i></span>
            `;
            projectsGallery.appendChild(projetElement);

            // Attacher l'événement de suppression après avoir ajouté l'élément au DOM
            const deleteIcon = projetElement.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', () => {
                const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
                if (confirmation) {
                    allProjects = allProjects.filter(p => p.id !== projet.id);
                    localStorage.setItem('projects', JSON.stringify(allProjects)); // Mise à jour dans le localStorage
                    afficherProjetsDansModale(); // Rafraîchir la liste après suppression
                    const eventUpdateGallery = new CustomEvent('updateGallery');
                    document.dispatchEvent(eventUpdateGallery); // Mise à jour de la galerie principale
                }
            });
        });
    }

    // Fonction pour ajouter des événements de fermeture aux boutons
    function attachCloseEvents() {
        const closeModalBtns = document.querySelectorAll('.close'); // Sélectionne toutes les croix de fermeture
        console.log(closeModalBtns); // Vérifiez combien d'éléments sont sélectionnés

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                resetForm();
                modal.style.display = 'none';
            });
        });
    }

    openModalBtn.addEventListener('click', () => {
        console.log('Open modal button clicked');
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';

        // Vérifiez l'existence de l'élément projectsGallery après ouverture de la modale
        const projectsGallery = document.getElementById('projects-gallery');
        console.log('projectsGallery après ouverture de la modale:', projectsGallery);
       
        afficherProjetsDansModale(); // Affiche les projets à partir du tableau local
        attachCloseEvents(); // Attachez les événements après l'affichage de la modale
    });

    // Synchroniser le comportement avec le bouton "Mode édition"
    editModeLink.addEventListener('click', () => {
        console.log('Mode édition activé');
        
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        
        const projectsGallery = document.getElementById('projects-gallery');
        console.log('projectsGallery après clic sur "Mode édition":', projectsGallery);

        afficherProjetsDansModale(); // Affiche les projets en mode édition
        attachCloseEvents(); // Pour gérer la fermeture de la modale
    });

    backArrow.addEventListener('click', () => {
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
    });

    addPhotoBtn.addEventListener('click', () => {
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
        attachCloseEvents(); // Attachez les événements après l'affichage de la vue d'ajout de photo
    });

    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadPhotoLabel.style.display = 'none';
            };

            reader.readAsDataURL(file);
        } else {
            resetForm();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const newProject = {
            id: allProjects.length ? allProjects[allProjects.length - 1].id + 1 : 1, // Génère un ID localement
            title: formData.get('title'),
            imageUrl: imagePreview.src,
            categoryId: parseInt(formData.get('category'))
        };

        if (!newProject.title || !newProject.imageUrl || !newProject.categoryId) {
            errorMessage.textContent = 'Veuillez remplir tous les champs.';
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';
        allProjects.push(newProject); // Ajoute le nouveau projet localement
        localStorage.setItem('projects', JSON.stringify(allProjects)); // Sauvegarder dans le localStorage
        afficherProjetsDansModale();
        const eventUpdateGallery = new CustomEvent('updateGallery');
        document.dispatchEvent(eventUpdateGallery);
        form.reset();
        resetForm();
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            resetForm();
            modal.style.display = 'none';
        }
    });

    function resetForm() {
        form.reset();
        imagePreview.style.display = 'none';
        uploadPhotoLabel.style.display = 'flex';
    }
});
