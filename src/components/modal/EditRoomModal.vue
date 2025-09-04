<!-- components/modal/editRoomModal.vue -->
<template>

    <div class="modal fade" id="editRoomModal" tabindex="-1" aria-labelledby="editRoomModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modifier la salle</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body scrollable-body" v-if="room">
                    <form>
                        <div class="mb-3">
                            <label class="form-label">Cinéma</label>
                            <select class="form-select" v-model="room.cinema.name">
                                <option v-for="cinema in cinemas" :key="cinema.cinemaId" :value="cinema.name">
                                    {{ cinema.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nom de la salle</label>
                            <input type="text" class="form-control" v-model="room.name" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Qualité</label>
                            <!-- <input type="text" class="form-control" v-model="room.quality"> -->
                            <select class="form-select" v-model="room.quality">
                                <option value="Classique">Classique</option>
                                <option value="IMAX">IMAX</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre de sièges</label>
                            <input type="text" class="form-control" :value="room.seatsNumber" readonly />
                        </div>
                        <div class="mb-3">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Liste des sièges</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(seat, index) in room.seats" :key="index">
                                        <td>
                                            <input type="text" class="form-control" v-model="seat.name" />
                                        </td>
                                        <td>
                                            <select class="form-select" v-model="seat.type">
                                                <option value="Fauteuil Standard">Fauteuil Standard</option>
                                                <option value="Emplacement PMR">Emplacement PMR</option>
                                            </select>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <!-- Ajoute d'autres champs selon le modèle -->
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
import { ref, onMounted, watch } from 'vue';
import type { Room } from '../../models/types';
import * as bootstrap from 'bootstrap'
import ApiCinephoria from '../../services/apiCinephoria';
import type { Cinema } from '../../models/types';

const api = new ApiCinephoria();
const originalRoom = ref<Room | null>(null);
const cinemas = ref<Cinema[]>([]);
const fetchCinemas = async () => {
    try {
        const result = await api.getCinemas();
        if (Array.isArray(result)) {
            cinemas.value = result;
        } else {
            console.error("Erreur : la réponse de l'API cinémas n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
    }
};

const props = defineProps<{
    modelValue: boolean,
    selectedMovie: Room | null
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'save', payload: { updated: Room; original: Room }): void;
}>();


const room = ref<Room | null>(null);


watch(() => props.selectedMovie, (val) => {
    room.value = val ? JSON.parse(JSON.stringify(val)) : null;
    originalRoom.value = val ? JSON.parse(JSON.stringify(val)) : null;
});

const closeModal = () => {
    // Utilisation de  Bootstrap  pour fermer la modal
    const modalEl = document.getElementById('editRoomModal')
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
        modal.hide()
    }
}

function onSave() {
    if (room.value && originalRoom.value) {
        emit('save', {
            updated: room.value,
            original: originalRoom.value
        });
        closeModal();
    }
}
onMounted(async () => {
    await fetchCinemas();
});
</script>
