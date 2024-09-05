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

    // Fonction pour afficher les projets dans la galerie de la modale
    function afficherProjetsDansModale() {
        const projectsGallery = document.getElementById('projects-gallery');
        projectsGallery.innerHTML = '';

        allProjects.forEach(projet => {
            const projetElement = document.createElement('div');
            projetElement.className = 'project-item';
            projetElement.innerHTML = `
                <img src="${projet.imageUrl}" alt="${projet.title}" class="modal-image">
                <span class="delete-icon"><i class="fas fa-trash-alt"></i></span>
            `;
            projectsGallery.appendChild(projetElement);

            const deleteIcon = projetElement.querySelector('.delete-icon');
            deleteIcon.addEventListener('click', async () => {
                const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
                if (confirmation) {
                    try {
                        const response = await fetch(`http://localhost:5678/api/works/${projet.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        });

                        if (response.ok) {
                            allProjects = allProjects.filter(p => p.id !== projet.id);
                            afficherProjetsDansModale();
                            const eventUpdateGallery = new CustomEvent('updateGallery');
                            document.dispatchEvent(eventUpdateGallery);
                        } else {
                            console.error('Erreur lors de la suppression du projet');
                        }
                    } catch (error) {
                        console.error('Erreur lors de la suppression du projet:', error);
                    }
                }
            });
        });
    }

    // Ajout des événements pour fermer la modale
    function attachCloseEvents() {
        const closeModalBtns = document.querySelectorAll('.close'); // Sélectionne toutes les croix de fermeture
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                resetForm();
                modal.style.display = 'none'; // Ferme la modale
            });
        });
    }

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        afficherProjetsDansModale();
        attachCloseEvents(); // Attache les événements de fermeture à chaque ouverture
    });

    editModeLink.addEventListener('click', () => {
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
        afficherProjetsDansModale();
        attachCloseEvents();
    });

    backArrow.addEventListener('click', () => {
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
    });

    addPhotoBtn.addEventListener('click', () => {
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
        attachCloseEvents();
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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', imageInput.files[0]); // Ajoutez l'image depuis l'input file
        formData.append('title', form.elements['title'].value);
        formData.append('category', form.elements['category'].value);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData // Envoyer les données en format FormData
            });

            if (response.ok) {
                const addedProject = await response.json();
                allProjects.push(addedProject);
                afficherProjetsDansModale();
                const eventUpdateGallery = new CustomEvent('updateGallery');
                document.dispatchEvent(eventUpdateGallery);
                form.reset();
                resetForm();
                modal.style.display = 'none'; // Ferme la modale après ajout
            } else {
                errorMessage.textContent = 'Erreur lors de l’ajout du projet.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erreur lors de l’ajout du projet:', error);
            errorMessage.textContent = 'Erreur lors de l’ajout. Veuillez réessayer plus tard.';
            errorMessage.style.display = 'block';
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            resetForm();
            modal.style.display = 'none'; // Ferme la modale quand on clique en dehors
        }
    });

    function resetForm() {
        form.reset();
        imagePreview.style.display = 'none';
        uploadPhotoLabel.style.display = 'flex';
    }
});
