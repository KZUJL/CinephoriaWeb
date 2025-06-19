<template>
    <div class="modal fade" id="editShowTimesModal" tabindex="-1" aria-labelledby="editShowTimesModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifier le film</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body scrollable-body" v-if="seance">
                    <form>
                        <div class="mb-3">
                            <label class="form-label">Titre du film</label>
                            <input type="text" class="form-control" :value="seance.film?.title" disabled />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cinéma</label>
                            <select v-model="seance.cinemaId" class="form-select">
                                <option v-for="cinema in props.cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                                    {{ cinema.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Salle</label>
                            <select v-model="seance.roomId" class="form-select">
                                <option v-for="room in availableRooms" :key="room.roomId" :value="room.roomId">
                                    {{ room.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Jour</label>
                            <input class="form-control" type="date" v-model="formattedDate">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Heure de début</label>
                            <input type="time" class="form-control" :value="seance.startTime" step="1" min="00:00:00"
                                max="23:59:59" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Heure de début</label>
                            <input type="time" class="form-control" :value="seance.endTime" step="1" min="00:00:00"
                                max="23:59:59" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Prix</label>
                            <input type="number" class="form-control" v-model.number="seance.price" required />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button class="btn btn-primary" @click="onSave">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Seance, Film, Cinema, Room } from '../../models/types';
import * as bootstrap from 'bootstrap'
import ApiCinephoria from '../../services/apiCinephoria';

type SeanceWithFilm = Seance & {
    film?: Film;
    cinemaName?: Cinema;
};

const props = defineProps<{
    modelValue: boolean,
    selectedSeance: SeanceWithFilm | null,
    cinemas: Cinema[]
}>();
const emit = defineEmits(['update:modelValue', 'save']);

const api = new ApiCinephoria();
const seance = ref<SeanceWithFilm | null>(null);

const availableRooms = ref<Room[]>([]);

watch(() => seance.value?.cinemaId, async (cinemaId) => {
    if (!cinemaId) return;
    try {
        availableRooms.value = await api.getRooms({ cinemaId });
        // Optionnel : réinitialiser la salle si elle ne fait pas partie du nouveau cinéma
        if (!availableRooms.value.some(r => r.roomId === seance.value?.roomId)) {
            seance.value!.roomId = null;
        }
    } catch (error) {
        console.error("Erreur lors du chargement des salles :", error);
        availableRooms.value = [];
    }
});
watch(() => props.selectedSeance, async (val) => {
    seance.value = val ? { ...val } : null;
    if (val?.cinemaId) {
        availableRooms.value = await api.getRooms({ cinemaId: val.cinemaId });
    }
});

const formattedDate = computed<string>({
    get() {
        if (seance.value && seance.value.day) {
            const date = seance.value.day;
            if (date instanceof Date) {
                return date.toISOString().substring(0, 10);
            }
            if (typeof date === 'string') {
                return (date as string).substring(0, 10);
            }
        }
        return '';
    },
    set(value: string) {
        if (seance.value) {
            seance.value.day = new Date(value);
        }
    }
});

// Mise à jour locale du film quand il change
watch(() => props.selectedSeance, (val) => {
    seance.value = val ? { ...val } : null;
});

const closeModal = () => {
    // Utilisation de  Bootstrap  pour fermer la modal
    const modalEl = document.getElementById('editShowTimesModal')
    if (modalEl) {

        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
        modal.hide()
    }
}

function onSave() {
    if (seance.value) {
        const seanceDto = {
            movieTimesId: Number(seance.value.movieTimesId),
            movieId: Number(seance.value.movieId),
            cinemaId: Number(seance.value.cinemaId),
            roomId: Number(seance.value.roomId),
            day: typeof seance.value.day === 'string'
                ? seance.value.day
                : new Date(seance.value.day).toISOString().substring(0, 10),
            startTime: String(seance.value.startTime),
            endTime: String(seance.value.endTime),
            price: Number(seance.value.price)
        };
        console.log('Données envoyées :', seanceDto);
        emit('save', seanceDto);
        emit('update:modelValue', false);
        closeModal();
    }
}


</script>
