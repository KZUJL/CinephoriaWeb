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
        <div class="section mb-4">
            <ul class="d-flex flex-wrap">
                <li v-for="seance in filteredMovieTimes" :key="seance.movieTimesId" class="film-item">
                    <img :src="seance.movie.poster" :alt="seance.movie.title" class="film-image"
                        @click.prevent="goToMovieReservation(seance.movie.movieId, seance.cinemaId)" />
                    <div class="card-body">
                        <h6 class="card-title text-center">{{ seance.movie.title }}</h6>
                    </div>
                </li>
                <li v-if="filteredMovieTimes.length === 0">Aucun film prévu cette semaine.</li>
            </ul>
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

// État réactif
const cinemas = ref<Cinema[]>([]);
const movies = ref<Seance[]>([]);
const selectedCinemaId = ref<number | null>(null);
const user = ref(null);

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
            movies.value = result;
        } else {
            console.error("Erreur : la réponse de l'API films n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
    }
};

// Filtrage des séances (entre aujourd'hui et mercredi prochain)
const filteredMovieTimes = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWednesday = new Date(today);
    nextWednesday.setDate(today.getDate() + ((3 - today.getDay() + 7) % 7 + 1));
    nextWednesday.setHours(23, 59, 59, 999);

    const seenMovieIds = new Set<number>();

    return movies.value.filter((seance) => {
        const seanceDate = new Date(seance.day);
        seanceDate.setHours(0, 0, 0, 0);

        const isInRange = seanceDate >= today && seanceDate <= nextWednesday;
        const isNotSeen = !seenMovieIds.has(seance.movie.movieId);
        const isSameCinema = selectedCinemaId.value === null || seance.cinemaId === selectedCinemaId.value;

        if (isInRange && isSameCinema && isNotSeen) {
            seenMovieIds.add(seance.movie.movieId);
            return true;
        }
        return false;
    });
});

// Navigation vers la réservation
const goToMovieReservation = (movieId: number, cinemaId: number) => {
    if (user.value) {
        router.push({ name: 'movieReservation', params: { movieId, cinemaId } });
    } else {
        router.push({ name: 'login' });
    }
};

// Initialisation des données au montage
onMounted(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            user.value = JSON.parse(userString);
        } catch (e) {
            console.warn("Erreur lors du parsing de l'utilisateur :", e);
            user.value = null;
        }
    }
    fetchCinemas();
    fetchMoviesTimes();

});
</script>
