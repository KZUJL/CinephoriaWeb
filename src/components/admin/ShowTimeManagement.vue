<template>
    <div class="card movie-info mb-3 p-3">
        <div v-show="currentSection === 'films'">
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">

                <div class="me-3 d-flex align-items-center">
                    <h2 class="mb-0 me-3">Gestion des séances</h2>
                    <select class="form-select me-2" style="width: auto;" v-model="selectedCinemaId">
                        <option value="">Tous les cinémas</option>
                        <option v-for="cinema in cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                            {{ cinema.name }}
                        </option>
                    </select>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-success" @click="onAddClick">Ajouter</button>
                </div>
            </div>
            <div v-if="message" class="toast-message">{{ message }}</div>
            <table v-if="seances.length" class="table ">
                <thead>
                    <tr>
                        <th>Cinéma</th>
                        <th>Film</th>
                        <th>Jour</th>
                        <th>Heure</th>
                        <th>Salle</th>
                        <th>Action(s)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="seance in filteredSeances" :key="seance.movieTimesId"
                        @click="selectMovie(seance.movieTimesId)"
                        :class="{ 'table-active': selectedMovieTimesId === seance.movieTimesId }"
                        style="cursor: pointer;">
                        <td data-label="Cinéma">{{ getCinemasTitle(seance.cinemaId) }}</td>
                        <td data-label="Film">{{ getMovieTitle(seance.movieId) }}</td>
                        <td data-label="Jour">{{ seance.day ? formatDate(seance.day) : '' }}</td>
                        <td data-label="Heure">{{ seance.startTime }}</td>
                        <td data-label="Salle">{{ seance.room.name }}</td>
                        <td data-label="Action(s)" v-if="selectedMovieTimesId === seance.movieTimesId">
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
    <EditShowTimesModal :model-value="isEditModalOpen" :selected-seance="selectedMovie" :cinemas="cinemas"
        @save="handleEditSave" />
    <CreateMovieTimesModal id="CreateMovieTimesModal" :model-value="createShowTimesModal" :films="film"
        :cinemas="cinemas" @create="handleEditCreate" @update:model-value="createShowTimesModal = $event" />
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import type { Seance, Film, Cinema } from '../../models/types';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import EditShowTimesModal from '../modal/EditShowTimesModal.vue';
import CreateMovieTimesModal from '../modal/CreateMovieTimesModal.vue';

const api = new ApiCinephoria();
const seances = ref<Seance[]>([]);
const film = ref<Film[]>([]);
const cinemas = ref<Cinema[]>([]);
const selectedMovieTimesId = ref<number | null>(null);
const message = ref('');
const isEditModalOpen = ref(false);
const createShowTimesModal = ref(false);
const selectedMovie = ref<Seance | null>(null);
const selectedCinemaId = ref<number | ''>('');

const filteredSeances = computed(() => {
    if (!selectedCinemaId.value) {
        return seances.value;
    }
    return seances.value.filter(seance => seance.cinemaId === Number(selectedCinemaId.value));
});


async function onEditClick() {
    if (selectedMovieTimesId.value === null) return;

    const seance = seances.value.find(m => m.movieTimesId === selectedMovieTimesId.value);
    if (!seance) return;

    try {
        // Récupère la séance complète
        const detailedSeance = await api.getSeancesByMovieTimesId(seance.movieTimesId);

        // Récupère les infos du film
        const movieDetails = await api.getMoviesId(seance.movieId);

        const cinema = cinemas.value.find(c => c.cinemaId === seance.cinemaId);

        // Fusionne les deux objets
        selectedMovie.value = {
            ...detailedSeance,
            film: movieDetails,
            cinemaName: cinema ? cinema.name : ''
        };

        isEditModalOpen.value = true;

        const modalElement = document.getElementById('editShowTimesModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }

    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

async function handleEditCreate(createdMovieTimes: Seance) {

    await api.postMovieTimes(createdMovieTimes).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La séance a bien été ajoutée.',
            timer: 2000,
            showConfirmButton: false,
        });

        // Mettre à jour la liste des séances
        fetchMoviesTimes();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'L\'ajout a échoué.',
        });
    });
}
function onAddClick() {
    createShowTimesModal.value = true;

    const modalElement = document.getElementById('CreateMovieTimesModal');
    if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
    }
}
async function handleEditSave(updatedShowTimes: Seance) {

    // Logique pour sauvegarder les données modifiées, ex:
    console.log('Film modifié :', updatedShowTimes);
    await api.updateMovieTimesById(updatedShowTimes.movieTimesId, updatedShowTimes).then(() => {
        // Une fois réussi, affiche la SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La séance a bien été modifié.',
            timer: 2000,
            showConfirmButton: false,
        });
        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMoviesTimes();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La modification a échoué.',
        });
    });
}
function selectMovie(movieId: number) {
    selectedMovieTimesId.value = movieId;
}

const formatDate = (input: string | Date): string => {
    if (!input) return '';
    const date = typeof input === 'string' ? new Date(input) : input;
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const fetchMovies = async () => {
    try {
        const moviesData = await api.getMovies();
        if (Array.isArray(moviesData)) {
            film.value = moviesData;
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
};

function getMovieTitle(movieId: number): string {
    const movie = film.value.find(m => m.movieId === movieId);
    return movie ? movie.title : 'Film inconnu';
}

const fetchCinemas = async () => {
    try {
        const response = await api.getCinemas();
        if (Array.isArray(response)) {
            cinemas.value = response;
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des cinémas:', error);
    }
};
function getCinemasTitle(cinemaId: number): string {
    const cine = cinemas.value.find(c => c.cinemaId === cinemaId);
    return cine ? cine.name : 'Cinéma inconnu';
}



const fetchMoviesTimes = async () => {
    try {
        const moviesTimesData = await api.getMoviesCinemaId({});
        if (Array.isArray(moviesTimesData)) {
            const now = new Date();
            seances.value = moviesTimesData.filter(seance => {
                if (!seance.day) return false;
                const day = new Date(seance.day);
                const [hours, minutes, seconds] = seance.startTime.split(':');
                day.setHours(Number(hours), Number(minutes), Number(seconds || 0));
                return day > now;
            });
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
        await api.deleteMovieTimesById(id);
        // recharge la liste après suppression
        await fetchMoviesTimes();
        selectedMovieTimesId.value = null; // déselectionner
        message.value = 'Séance supprimée avec succès !';
        setTimeout(() => { message.value = ''; }, 5000);
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        message.value = "Erreur lors de la suppression de la séance.";
        setTimeout(() => { message.value = ''; }, 3000);
    }
}

function onDeleteClick() {
    if (selectedMovieTimesId.value === null) return;

    const seance = seances.value.find(m => m.movieId === selectedMovieTimesId.value);
    if (!seance) return;

    Swal.fire({
        title: 'Confirmer la suppression',
        text: `Êtes-vous sûr de vouloir supprimer le film "${seance.movieId}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMovieById(selectedMovieTimesId.value);
            Swal.fire('Supprimé!', 'Le film a été supprimé.', 'success');
        }
    });
}
watch(selectedCinemaId, () => {
    selectedMovieTimesId.value = null;
});
onMounted(async () => {
    await fetchMoviesTimes();
    await fetchMovies()
    await fetchCinemas()
})

</script>