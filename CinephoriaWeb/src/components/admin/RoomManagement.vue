<template>
    <div class="card movie-info mb-3 p-3">
        <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">
            <h2 class="mb-0">Gestion des Salles</h2>
            <div>
                <button class="btn btn-success">Ajouter</button>
            </div>
        </div>
        <table v-if="rooms.length" class="table ">
            <thead>
                <tr>
                    <th>Cinema</th>
                    <th>Name</th>
                    <th>Nbre</th>
                    <th>Action(s)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="room in rooms" :key="room.roomId" @click="selectMovie(room.roomId)"
                    :class="{ 'table-active': selectedMovieId === room.roomId }" style="cursor: pointer;">
                    <td>{{ room.cinema.name }}</td>
                    <td>{{ room.name }}</td>
                    <td>{{ room.seatsNumber }}</td>
                    <td v-if="selectedMovieId === room.roomId">
                        <button class="btn btn-primary btn-sm me-2" @click="onEditRoomClick">
                            Modifier
                        </button>
                        <button class="btn btn-danger btn-sm">
                            Supprimer
                        </button>
                    </td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
    </div>
    <EditRoomModal :model-value="isEditRoomModalOpen" :selected-movie="selectedRoom" @save="handleEditRoomSave" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import type { Room } from '../../models/types';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import EditRoomModal from '../modal/EditRoomModal.vue';

// import ReservationChart from './ReservationChart.vue';
const api = new ApiCinephoria();
const rooms = ref<Room[]>([]);
const selectedMovieId = ref<number | null>(null);
const isEditModalOpen = ref(false);
const isEditRoomModalOpen = ref(false);
const selectedRoom = ref<Room | null>(null);

async function onEditRoomClick() {
    if (selectedMovieId.value === null) return;

    const room = rooms.value.find(m => m.roomId === selectedMovieId.value);
    if (!room) return;

    try {
        const fetchedRoom = await api.getRooms({ roomId: room.roomId });
        // getRooms may return an array or a single room, adjust as needed
        selectedRoom.value = Array.isArray(fetchedRoom) ? fetchedRoom[0] : fetchedRoom;
        isEditRoomModalOpen.value = true;

        // Affiche la modale Bootstrap
        const modalElement = document.getElementById('editRoomModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la salle :", error);
    }
}
async function handleEditRoomSave({ updated, original }: { updated: Room; original: Room }) {
    if (!updated) return;

    const hasRoomChanged = (): boolean => {
        return (
            updated.name !== original.name ||
            updated.quality !== original.quality ||
            updated.cinema.name !== original.cinema.name
        );
    };

    const haveSeatsChanged = (): boolean => {
        if (updated.seats.length !== original.seats.length) return true;

        return updated.seats.some((seat, i) =>
            seat.name !== original.seats[i]?.name || seat.type !== original.seats[i]?.type
        );
    };

    const doRoomUpdate = hasRoomChanged();
    const doSeatsUpdate = haveSeatsChanged();

    if (!doRoomUpdate && !doSeatsUpdate) {
        Swal.fire({
            icon: 'info',
            title: 'Aucune modification',
            text: 'Aucune donnée n’a été modifiée.',
            timer: 2000,
            showConfirmButton: false,
        });
        isEditModalOpen.value = false;
        isEditRoomModalOpen.value = false;
        return;
    }

    try {
        if (doRoomUpdate) {
            await api.putRoom(updated.roomId, updated);
        }

        if (doSeatsUpdate) {
            for (const seat of updated.seats) {
                await api.putSeat(seat.locationId, seat); // 💡 à adapter si `seat.id` ou `roomId` est requis
            }
        }

        // Mise à jour de la liste locale
        const index = rooms.value.findIndex(r => r.roomId === updated.roomId);
        if (index !== -1) {
            rooms.value[index] = updated;
        }

        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La salle a bien été modifiée.',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La modification a échoué.',
        });
    }

    isEditModalOpen.value = false;
    isEditRoomModalOpen.value = false;
}



function selectMovie(movieId: number) {
    selectedMovieId.value = movieId;
}
const fetchRooms = async () => {
    try {
        const roomData = await api.getRooms();
        if (Array.isArray(roomData)) {
            rooms.value = roomData;
            console.log("Liste des salle :", roomData)
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des salles:', error);
    }
};
onMounted(async () => {
    await fetchRooms();
})
</script>
