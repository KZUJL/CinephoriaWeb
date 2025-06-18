<template>
    <div class="modal fade" id="createMovieTimesModal" tabindex="-1" aria-labelledby="createMovieTimesModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Créer une séance</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body scrollable-body">
                    <form>
                        <div class="mb-3">
                            <label class="form-label">Film</label>
                            <select v-model="newSeance.movieId" class="form-select">
                                <option value="" disabled>Choisir un film</option>
                                <option v-for="film in props.films" :key="film.movieId" :value="film.movieId">
                                    {{ film.title }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cinéma</label>
                            <select v-model="newSeance.cinemaId" class="form-select">
                                <option value="" disabled>Choisir un cinéma</option>
                                <option v-for="cinema in props.cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                                    {{ cinema.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Salle</label>
                            <select v-model="newSeance.roomId" class="form-select" :disabled="!availableRooms.length">
                                <option value="" disabled>Choisir une salle</option>
                                <option v-for="room in availableRooms" :key="room.roomId" :value="room.roomId">
                                    {{ room.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Jour</label>
                            <input type="date" class="form-control" v-model="formattedDate" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Heure de début</label>
                            <input type="time" class="form-control" v-model="newSeance.startTime" step="1"
                                min="00:00:00" max="23:59:59" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Heure de fin</label>
                            <input type="time" class="form-control" v-model="newSeance.endTime" step="1" min="00:00:00"
                                max="23:59:59" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Prix</label>
                            <input type="number" class="form-control" v-model.number="newSeance.price" required
                                min="0" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button class="btn btn-primary" @click="onCreate">Créer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits, onMounted } from 'vue';
import type { Film, Cinema, Room, Seance } from '../../models/types';
import * as bootstrap from 'bootstrap';
import Modal from 'bootstrap/js/dist/modal';
import ApiCinephoria from '../../services/apiCinephoria';

const props = defineProps<{
    modelValue: boolean,
    films: Film[],
    cinemas: Cinema[]
}>();
const emit = defineEmits(['update:modelValue', 'create']);

const api = new ApiCinephoria();

const newSeance = ref<Partial<Seance>>({
    movieId: null,
    cinemaId: null,
    roomId: null,
    day: null,
    startTime: '',
    endTime: '',
    price: 0
});

const availableRooms = ref<Room[]>([]);

watch(() => newSeance.value.cinemaId, async (cinemaId) => {
    if (!cinemaId) {
        availableRooms.value = [];
        newSeance.value.roomId = null;
        return;
    }
    try {
        availableRooms.value = await api.getRooms({ cinemaId });
        // Réinitialiser la salle si non disponible
        if (!availableRooms.value.some(r => r.roomId === newSeance.value.roomId)) {
            newSeance.value.roomId = null;
        }
    } catch (error) {
        console.error("Erreur lors du chargement des salles :", error);
        availableRooms.value = [];
    }
});

// Formatage de la date pour input type=date
const formattedDate = computed({
    get() {
        if (newSeance.value.day) {
            if (newSeance.value.day instanceof Date) {
                return newSeance.value.day.toISOString().substring(0, 10);
            }
            if (typeof newSeance.value.day === 'string') {
                return (newSeance.value.day as string).substring(0, 10);
            }
        }
        return '';
    },
    set(value: string) {
        newSeance.value.day = new Date(value);
    }
});

// const closeModal = () => {
//     const modalEl = document.getElementById('createMovieTimesModal');
//     if (modalEl) {
//         const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
//         modal.hide();
//     }
// };

function onCreate() {
    if (newSeance.value.movieId && newSeance.value.cinemaId && newSeance.value.roomId && newSeance.value.day && newSeance.value.startTime && newSeance.value.endTime && newSeance.value.price !== undefined) {
        const seanceDto = {
            movieId: Number(newSeance.value.movieId),
            cinemaId: Number(newSeance.value.cinemaId),
            roomId: Number(newSeance.value.roomId),
            day: typeof newSeance.value.day === 'string' ? newSeance.value.day : newSeance.value.day.toISOString().substring(0, 10),
            startTime: String(newSeance.value.startTime),
            endTime: String(newSeance.value.endTime),
            price: Number(newSeance.value.price)
        };
        console.log('Création séance :', seanceDto);
        emit('create', seanceDto);
        emit('update:modelValue', false);
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

let modal: Modal | null = null;

onMounted(() => {
    const modalEl = document.getElementById('createMovieTimesModal');
    if (modalEl) {
        modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl, { backdrop: 'static' });
    }
});

watch(() => props.modelValue, (newVal) => {
    if (modal) {
        if (newVal) {
            modal.show();
        } else {
            modal.hide();
        }
    }
});

</script>
