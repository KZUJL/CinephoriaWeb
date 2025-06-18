<template>
    <div class="card movie-info mb-3 p-3">
        <h2>Visualisation des Réservations (7 prochains jours)</h2>
        <p>Voir les réservations prévues entre aujourd’hui et les 7 prochains jours.</p>
        <table v-if="reservationCounts.length" class="table table-striped">
            <thead>
                <tr>
                    <th>Film</th>
                    <th>Nombre de réservations</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="res in reservationCounts" :key="res.movieId">
                    <tr style="cursor: pointer" @click="toggleExpand(res.movieId)">
                        <td>{{ res.title }}</td>
                        <td>{{ res.count }}</td>
                    </tr>
                    <tr v-if="expandedMovieId === res.movieId">
                        <td colspan="2" style="padding-left: 2rem;">
                            <table class="table table-borderless mb-0">
                                <thead>
                                    <tr>
                                        <th>Cinéma</th>
                                        <th>Nombre de Réservations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(count, cinema) in getReservationCountByCinema(res.movieId)"
                                        :key="cinema">
                                        <td>{{ cinema }}</td>
                                        <td>{{ count }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div v-else>Aucune réservation prévue sur les 7 prochains jours.</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import type { Film, Reservation } from '../../models/types';

// import ReservationChart from './ReservationChart.vue';
const api = new ApiCinephoria();
const movies = ref<Film[]>([]);
const expandedMovieId = ref<number | null>(null);

function toggleExpand(movieId: number) {
    if (expandedMovieId.value === movieId) {
        expandedMovieId.value = null;
    } else {
        expandedMovieId.value = movieId;
    }
}
// Fonction pour compter les réservations par cinéma pour un film donné
function getReservationCountByCinema(movieId: number): Record<string, number> {
    const filtered = reservations.value.filter(r => r.movieId === movieId);
    const counts: Record<string, number> = {};
    filtered.forEach(r => {
        counts[r.cinemaName] = (counts[r.cinemaName] || 0) + 1;
    });
    return counts;
}

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

const reservations = ref<Reservation[]>([]);
const reservationCounts = ref<{ movieId: number; title: string; count: number }[]>([]);

const fetchReservationsNext7Days = async () => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const resData = await api.getReservations({});

        if (Array.isArray(resData)) {
            // Ne garde que les réservations entre aujourd’hui et +7 jours
            const upcomingReservations = resData.filter(r => {
                const resDate = new Date(r.reservationDate);
                return resDate >= today && resDate <= nextWeek;
            });

            reservations.value = upcomingReservations;

            const counts: Record<number, number> = {};

            for (const r of upcomingReservations) {
                counts[r.movieId] = (counts[r.movieId] || 0) + 1;
            }

            reservationCounts.value = Object.entries(counts).map(([movieIdStr, count]) => {
                const movieId = parseInt(movieIdStr);
                const movie = movies.value.find(m => m.movieId === movieId);
                return {
                    movieId,
                    title: movie ? movie.title : `Film #${movieId}`,
                    count,
                };
            });
        } else {
            console.error("Réponse inattendue pour les réservations");
        }
    } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
    }
};
onMounted(async () => {
    await fetchMovies();
    await fetchReservationsNext7Days();
})
</script>
