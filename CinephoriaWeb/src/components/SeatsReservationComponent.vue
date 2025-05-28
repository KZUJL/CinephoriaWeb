<template>
    <div class="d-flex">
        <!-- Sidebar infos -->
        <div class="custom_sd_primary p-4 me-1">
            <div class="text-center">
                <img :src="moviePoster" alt="Poster" class="img-fluid mb-3" style="max-width: 200px;" />
                <h3>{{ movieTitle }}</h3>
            </div>

            <hr class="cinema-divider mb-3" />

            <div class="mb-3">
                <span>Cinéma</span><br />
                <span><strong>{{ cinemaName }}</strong></span>
            </div>

            <hr class="cinema-divider mb-3" />
            <div class="mb-3">
                <span>Date</span><br />
                <span><strong>{{ movieDay }}</strong></span>
            </div>

            <hr class="cinema-divider mb-3" />
            <div class="mb-3">
                <span>Séance :</span><br />
                <span><strong>{{ startTime }}</strong></span><br />
                <span>Fin prévue à {{ endTime }}</span>
            </div>
        </div>

        <!-- Sièges -->
        <div class="flex-grow-1 seats-zone">
            <div class="d-flex flex-column align-items-center p-2">
                <div class="text-center mb-4">
                    <h2>Réservation de Sièges</h2>
                </div>
                <div class="screen mb-4"></div>

                <div v-for="(row, rowIndex) in seatRows" :key="rowIndex" class="d-flex mb-2">
                    <div v-for="(seat, colIndex) in row" :key="seat.locationId"
                        :class="['mx-1', (colIndex === 4 || colIndex === 11) ? 'ms-4' : '']">
                        <button class="btn btn-sm seat" :class="[
                            seat.type === 'Emplacement PMR'
                                ? (seat.reserved ? 'btn-primary disabled' : (seat.selected ? 'btn-primary' : 'btn-outline-primary'))
                                : (seat.reserved ? 'btn-danger' : (seat.selected ? 'btn-success' : 'btn-outline-secondary'))
                        ]" :disabled="seat.reserved" @click="() => toggleSeatSelection(seat)"
                            :title="seat.type === 'Emplacement PMR' ? 'Emplacement PMR' : ''">
                            {{ seat.name }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-center p-2">
                <div class="card text-center " style="width: 20rem;">
                    <span class="me-4"><strong>{{ selectedSeats &&
                        selectedSeats.length }} Place réservée(s) / {{ price * (selectedSeats?.length || 0) }}
                            Euros</strong>
                    </span>
                    <div v-for="seat in selectedSeats" :key="seat.locationId">
                        {{ seat.name }} <span v-if="seat.type">({{ seat.type }})</span>
                    </div>
                    <button class="btn btn-warning me-4 w-100 mt-2" :disabled="!selectedSeats.length"
                        @click="reserveSeats">
                        Réserver
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import type { Seat } from '../models/types';

// Refs
const seats = ref<Seat[]>([]);
const reservedSeats = ref<Set<number>>(new Set());
const movieTitle = ref('');
const moviePoster = ref('');
const cinemaName = ref('');
const movieDay = ref('');
const startTime = ref('');
const endTime = ref('');
const price = ref(0);

const route = useRoute();

// Fonctions
function toggleSeatSelection(seat: Seat) {
    if (!seat.reserved) { // Empêcher de sélectionner un siège déjà réservé
        seat.selected = !seat.selected;
    }
}

async function reserveSeats() {
    if (selectedSeats.value.length === 0) {
        alert('Veuillez sélectionner au moins un siège pour réserver.');
        return;
    }

    const selectedSeatIds = selectedSeats.value.map(seat => seat.locationId);
    const api = new ApiCinephoria();

    const movieId = route.params.movieId;
    const cinemaId = route.params.cinemaId;
    const reservationDate = new Date(`${movieDay.value}T00:00:00Z`).toISOString();
    const reservationTime = `${movieDay.value}T${startTime.value}:00`;

    try {
        const results = await Promise.all(selectedSeatIds.map(async (seatId) => {
            const reservationData = {
                userId: 1,
                seatId: seatId.toString(),
                movieId,
                cinemaId,
                reservationDate,
                reservationTime,
            };
            return await api.postReservation(reservationData);
        }));

        const successfulReservations = results.filter(res => res && res.id);
        if (successfulReservations.length === selectedSeatIds.length) {
            alert('Réservation de tous les sièges effectuée avec succès !');
            window.location.href = "/dashboard";
            return;
        } else if (successfulReservations.length > 0) {
            alert(`Réservation partielle réussie : ${successfulReservations.length} sur ${selectedSeatIds.length} sièges.`);
        } else {
            alert('La réservation a échoué pour tous les sièges.');
        }

        // Mise à jour des sièges
        const movieTimesId = parseInt(route.params.movieTimesId as string, 10);
        const seance = await api.getSeancesByMovieTimesId(movieTimesId);
        if (seance?.roomId) {
            await fetchSeatsByRoomId(seance.roomId);
        }

    } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        alert('Erreur lors de la réservation, veuillez réessayer.');
    }
}


async function fetchSeatsByRoomId(roomId: number) {
    const api = new ApiCinephoria();
    try {
        const data = await api.getSeatsByRoom(roomId);
        if (Array.isArray(data)) {
            // Assurez-vous que les sièges sont mis à jour correctement
            seats.value = data.map((seat: Seat) => ({
                ...seat,
                reserved: reservedSeats.value.has(seat.locationId),
                selected: false,
            }));
        } else {
            console.error("Erreur : réponse de l'API invalide.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des sièges :", error);
    }
}


async function fetchReservedSeats() {
    const reservationData = {
        movieId: Number(route.params.movieId),
        cinemaId: Number(route.params.cinemaId),
        reservationDate: new Date(`${movieDay.value}T00:00:00Z`).toISOString(),
        reservationTime: `${movieDay.value}T${startTime.value}:00`,
    };
    const api = new ApiCinephoria();
    try {
        const reservations = await api.getReservations(reservationData);
        reservedSeats.value = new Set(reservations.map((reservation: { seatId: number }) => reservation.seatId));
        // Mise à jour des sièges
        seats.value = seats.value.map(seat => ({
            ...seat,
            reserved: reservedSeats.value.has(seat.locationId),
        }));


    } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
    }
}




// Computed
const selectedSeats = computed(() =>
    seats.value.filter(seat => seat.selected)
);

const seatRows = computed(() => {
    const seatsPerRow = 15;
    const rows: Seat[][] = [];
    for (let i = 0; i < seats.value.length; i += seatsPerRow) {
        rows.push(seats.value.slice(i, i + seatsPerRow));
    }
    return rows;
});

onMounted(async () => {
    const movieTimesIdParam = Array.isArray(route.params.movieTimesId)
        ? route.params.movieTimesId[0]
        : route.params.movieTimesId;

    const parsedMovieTimesId = parseInt(movieTimesIdParam as string, 10);
    if (isNaN(parsedMovieTimesId)) {
        console.error('movieTimesId invalide dans l’URL :', movieTimesIdParam);
        return;
    }

    const api = new ApiCinephoria();
    try {
        const seance = await api.getSeancesByMovieTimesId(parsedMovieTimesId);

        if (!seance || !seance.roomId) {
            console.error("Aucune salle trouvée pour cette séance.");
            return;
        }

        movieTitle.value = seance.movie.title;
        moviePoster.value = seance.movie.poster;
        cinemaName.value = seance.cinema.name;
        movieDay.value = new Date(seance.day).toISOString().split('T')[0];
        startTime.value = seance.startTime.slice(0, 5);
        endTime.value = seance.endTime.slice(0, 5);
        price.value = seance.price;

        // Récupérer les réservations pour désactiver les sièges réservés
        await fetchReservedSeats();

        await fetchSeatsByRoomId(seance.roomId);
    } catch (error) {
        console.error("Erreur lors de la récupération de la séance :", error);
    }
});
</script>
