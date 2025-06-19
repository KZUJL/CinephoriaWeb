<template>
    <div class="card movie-info mb-3 p-3">
        <div v-show="currentSection === 'films'">
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">
                <h2 class="mb-0">Gestion des films</h2>
                <div>
                    <button class="btn btn-success" @click="onAddClick">Ajouter</button>
                </div>
            </div>
            <div v-if="message" class="toast-message">{{ message }}</div>
            <table v-if="movies.length" class="table ">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Genre</th>
                        <th>Durée</th>
                        <th>Date de sortie</th>
                        <th>Action(s)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="movie in movies" :key="movie.movieId" @click="selectMovie(movie.movieId)"
                        :class="{ 'table-active': selectedMovieId === movie.movieId }" style="cursor: pointer;">
                        <td>{{ movie.title }}</td>
                        <td>{{ movie.genre }}</td>
                        <td>{{ movie.duration }}</td>
                        <td>{{ formatDate(movie.availableDate) }}</td>
                        <td v-if="selectedMovieId === movie.movieId">
                            <button class="btn btn-primary btn-sm me-2" @click="onEditClick">
                                Modifier
                            </button>
                            <button class="btn btn-danger btn-sm" @click="onDeleteClick">
                                Supprimer
                            </button>
                        </td>
                        <td v-else></td>
                    </tr>
                </tbody>
            </table>
            <div v-else>Aucun film trouvé.</div>
        </div>
    </div>
    <EditMovieModal :model-value="isEditModalOpen" :selected-movie="selectedMovie" @save="handleEditSave" />
    <CreateMovieModal :model-value="isCreateModalOpen" :selected-movie="selectedMovie" @save="handleEditCreate"
        @update:model-value="isCreateModalOpen = $event" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import type { Film, } from '../../models/types';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import EditMovieModal from '../modal/EditMovieModal.vue';
import CreateMovieModal from '../modal/CreateMovieModal.vue';

// import ReservationChart from './ReservationChart.vue';
const api = new ApiCinephoria();
const movies = ref<Film[]>([]);
const selectedMovieId = ref<number | null>(null);
const message = ref('');
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const selectedMovie = ref<Film | null>(null);

async function onEditClick() {
    if (selectedMovieId.value === null) return;

    const movie = movies.value.find(m => m.movieId === selectedMovieId.value);
    if (!movie) return;

    try {
        const fetchedMovie = await api.getMoviesId(movie.movieId);
        selectedMovie.value = fetchedMovie;
        isEditModalOpen.value = true;

        // Affiche la modale Bootstrap
        const modalElement = document.getElementById('editMovieModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }

    } catch (error) {
        console.error("Erreur lors de la récupération du film :", error);
    }
}
async function handleEditCreate(createdMovie: Film) {
    await api.createMovie(createdMovie).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le film a bien été ajouté.',
            timer: 2000,
            showConfirmButton: false,
        });
        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMovies();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'L\'ajout a échoué.',
        });
    });
}
function onAddClick() {
    isCreateModalOpen.value = true;

    const modalElement = document.getElementById('createMovieModal');
    if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
    }
}
async function handleEditSave(updatedMovie: Film) {

    // Logique pour sauvegarder les données modifiées, ex:
    console.log('Film modifié :', updatedMovie);
    await api.updateMovieById(updatedMovie.movieId, updatedMovie).then(() => {
        // Une fois réussi, affiche la SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le film a bien été modifié.',
            timer: 2000,
            showConfirmButton: false,
        });
        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMovies();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La modification a échoué.',
        });
    });
}
function selectMovie(movieId: number) {
    selectedMovieId.value = movieId;
}

const formatDate = (input: string | Date): string => {
    const date = typeof input === 'string' ? new Date(input) : input;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const fetchMovies = async () => {
    try {
        const moviesData = await api.getMovies();
        if (Array.isArray(moviesData)) {
            movies.value = moviesData;
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
};

const currentSection = ref('films');

async function deleteMovieById(id: number) {
    try {
        await api.deleteMovieById(id);
        // recharge la liste après suppression
        await fetchMovies();
        selectedMovieId.value = null; // déselectionner
        message.value = 'Film supprimé avec succès !';
        setTimeout(() => { message.value = ''; }, 5000);
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        message.value = "Erreur lors de la suppression du film.";
        setTimeout(() => { message.value = ''; }, 3000);
    }
}

function onDeleteClick() {
    if (selectedMovieId.value === null) return;

    const movie = movies.value.find(m => m.movieId === selectedMovieId.value);
    if (!movie) return;

    Swal.fire({
        title: 'Confirmer la suppression',
        text: `Êtes-vous sûr de vouloir supprimer le film "${movie.title}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMovieById(selectedMovieId.value);
            Swal.fire('Supprimé!', 'Le film a été supprimé.', 'success');
        }
    });
}

onMounted(async () => {
    await fetchMovies();
})

</script>
