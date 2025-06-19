<template>
    <div class="py-3 custom-container">
        <div class="mb-4">
            <label for="cinemaSelect" class="form-label">Sélectionnez un cinéma :</label>
            <select id="cinemaSelect" class="form-select" v-model="selectedCinemaId">
                <option v-for="cinema in cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                    {{ cinema.name }}
                </option>
            </select>
        </div>
        <div class="row">
            <div class="col-12 col-lg-2 mb-4" v-for="seance in filteredMovieTimes" :key="seance.movieTimesId">
                <div class="card h-100 movie-info pointer"
                    @click="goToMovieReservation(seance.movie.movieId, seance.cinemaId)">
                    <img :src="seance.movie.poster" :alt="seance.movie.title" :title="seance.movie.title"
                        style="object-fit: cover; height: 300px;">

                    <span v-if="seance.movie.isfavorite"
                        class="position-absolute top-0 end-0 bg-danger text-white rounded-start px-2 py-1"
                        style="font-size: 0.8rem; font-weight: bold;" title="Coup de cœur">
                        Coup de cœur
                    </span>

                    <div class="card-body text-start position-relative" style="padding-bottom: 2.5rem;">
                        <span class="font-weight-bold">{{ seance.movie.title }}</span>
                        <br>
                        <!-- Affichage de la note moyenne -->
                        <div>
                            <span
                                v-if="seance.movie.averageReview !== null && seance.movie.averageReview !== undefined && seance.movie.averageReview > 0">
                                <span v-for="n in 5" :key="n" style="font-size: 0.9em;">
                                    <i v-if="n <= Math.floor(seance.movie.averageReview)"
                                        class="fas fa-star text-warning"></i>
                                    <i v-else-if="n - 0.5 <= seance.movie.averageReview"
                                        class="fas fa-star-half-alt text-warning"></i>
                                    <i v-else class="far fa-star text-secondary"></i>
                                </span>
                                <span class="ms-1 text-white" style="font-size: 0.7em;">
                                    {{ seance.movie.averageReview.toFixed(1) }}
                                </span>
                            </span>
                            <span v-else class="text-white" style="font-size: 0.7em;font-style: italic;">
                                Pas encore d'avis
                            </span>
                        </div>

                    </div>

                    <div>
                        <span class="position-absolute start-0 bottom-0 mb-2 ms-2"
                            style="font-size: 0.9em; font-style: italic; color: wheat;">
                            {{ seance.movie.minimumAge }}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import type { Cinema, Seance } from '../models/types';

const router = useRouter();
const api = new ApiCinephoria();
const cinemas = ref<Cinema[]>([]);
const movieTimes = ref<Seance[]>([]);
const selectedCinemaId = ref<number | null>(null);

// Appel API : Cinémas
const fetchCinemas = async () => {
    try {
        const result = await api.getCinemas();
        if (Array.isArray(result)) {
            cinemas.value = result;
            selectedCinemaId.value = result.length > 0 ? result[0].cinemaId : null;
        } else {
            console.error("Erreur : la réponse de l'API cinémas n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des cinémas :', error);
    }
};

// Appel API : Séances
const fetchMoviesTimes = async () => {
    try {
        const result = await api.getMovieTimes();
        if (Array.isArray(result)) {
            movieTimes.value = result;
        } else {
            console.error("Erreur : la réponse de l'API films n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
    }
};

const filteredMovieTimes = computed(() => {
    const now = new Date();

    // Calculer la date du prochain mercredi
    const Wednesday = new Date();
    const day = Wednesday.getDay();
    const daysUntilWednesday = (3 - day + 7) % 7 || 7;
    Wednesday.setDate(Wednesday.getDate() + daysUntilWednesday);
    Wednesday.setHours(0, 0, 0, 0);

    const cinemaIdNum = Number(selectedCinemaId.value);

    // Filtrer les séances du cinéma sélectionné 
    return movieTimes.value.filter(session =>
        session.cinemaId === cinemaIdNum && Wednesday >= new Date(session.day) &&
        new Date(session.day) > now
    );
});

const fetchReviews = async (movieId: number) => {
    try {
        const reviewsData = await api.getReviewsAverage(movieId);
        if (reviewsData) {
            // Trouver toutes les séances correspondant à ce film
            movieTimes.value
                .filter(seance => seance.movie.movieId === movieId)
                .forEach(seance => {
                    seance.movie.averageReview = reviewsData.averageReview === 0 ? null : reviewsData.averageReview;
                });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis du film :', error);
    }
};

// Navigation vers la réservation
const goToMovieReservation = (movieId: number, cinemaId: number) => {
    router.push({ name: 'movieReservation', params: { movieId, cinemaId } });
};

// Initialisation des données au montage
onMounted(async () => {
    await fetchCinemas();
    await fetchMoviesTimes();
    for (const seance of movieTimes.value) {
        await fetchReviews(seance.movie.movieId);
    }
});
</script>
