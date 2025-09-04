<template>
    <div class="py-3 custom-container">
        <!-- Section Films -->
        <div class="section mb-4">
            <h2 class="text-center text-white font-weight-bold mb-3">Films actuellement en salle</h2>
            <hr class="cinema-divider mb-4" />
            <div class="d-flex gap-3 mb-3 flex-wrap">

                <select id="genreSelect" class="form-select" v-model="selectedGenre" style="max-width: 220px;">
                    <option value="">Tous les genres</option>
                    <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
                </select>
                <select id="cinemaSelect" class="form-select" v-model="selectedCinemaId" style="max-width: 220px;">
                    <option value="">Tous les cinemas</option>
                    <option v-for="cinema in cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                        {{ cinema.name }}
                    </option>
                </select>

                <!-- Sélection de la date -->
                <select id="dateSelect" class="form-select" v-model="selectedDate" style="max-width: 220px;">
                    <option value="">Toutes les dates</option>
                    <option v-for="date in availableDates" :key="date" :value="date">
                        {{ new Date(date).toLocaleDateString('fr-FR', {
                            weekday: 'long', day: 'numeric', month: 'long'
                        }) }}
                    </option>
                </select>

            </div>

            <div class="row">
                <div class="col-12 col-lg-2 mb-4" v-for="film in filteredMovies" :key="film.movieId">

                    <div class="card h-100 movie-info  pointer" @click="handleFilmClick(film)">
                        <img :src="film.poster" :alt="film.title" :title="film.title"
                            style="object-fit: cover; height: 300px;">
                        <span v-if="film.isfavorite"
                            class="position-absolute top-0 end-0 bg-danger text-white rounded-start px-2 py-1"
                            style="font-size: 0.8rem; font-weight: bold;" title="Coup de cœur">
                            Coup de cœur
                        </span>
                        <div class="card-body text-start position-relative " style="padding-bottom: 2.5rem;">
                            <span class="font-weight-bold">{{ film.title }}</span>
                            <br>
                            <!-- Affichage de la note moyenne sous le titre -->
                            <div>
                                <span
                                    v-if="film.averageReview !== null && film.averageReview !== undefined && film.averageReview > 0">
                                    <span v-for="n in 5" :key="n" style="font-size: 0.9em;">
                                        <i v-if="n <= Math.floor(film.averageReview)"
                                            class="fas fa-star text-warning"></i>
                                        <i v-else-if="n - 0.5 <= film.averageReview"
                                            class="fas fa-star-half-alt text-warning"></i>
                                        <i v-else class="far fa-star text-secondary"></i>

                                    </span>
                                    <span class="ms-1 text-white" style="font-size: 0.7em;">
                                        {{ film.averageReview.toFixed(1) }}
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
                                {{ film.minimumAge }}
                            </span>
                        </div>
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
import type { Film, Cinema, Seance } from '../models/types';

const router = useRouter();
const api = new ApiCinephoria();
const movies = ref<Film[]>([]);
const cinemas = ref<Cinema[]>([]);
const movieTimes = ref<Seance[]>([]);
const selectedGenre = ref<string>('');
const selectedCinemaId = ref<string>('');
const selectedDate = ref<string>('');

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Récupère tous les genres distincts des films
const genres = computed(() => {
    const allGenres = movies.value.map(film => film.genre).filter(Boolean);
    return Array.from(new Set(allGenres)).sort();
});

// Calcule le prochain mercredi à 23h59
// const getNextWednesday = (fromDate: Date): Date => {
//     const date = new Date(fromDate);
//     const day = date.getDay();
//     const daysToAdd = (3 - day + 7) % 7; // 3 = mercredi
//     date.setDate(date.getDate() + daysToAdd);
//     date.setHours(23, 59, 59, 999);
//     return date;
// };

// Liste des films filtrés par genre, cinéma, date et jusqu’à mercredi
const filteredMovies = computed(() => {
    const now = new Date();
    // const nextWednesday = getNextWednesday(now);

    const cinemaId = Number(selectedCinemaId.value) || null;
    const selected = selectedDate.value ? new Date(selectedDate.value) : null;

    const validSessions = movieTimes.value.filter(session => {
        const sessionDate = new Date(session.day);
        if (sessionDate <= now) return false;
        if (cinemaId && session.cinemaId !== cinemaId) return false;
        if (selected && sessionDate.toDateString() !== selected.toDateString()) return false;
        return true;
    });

    const validMovieIds = new Set(validSessions.map(s => s.movieId));

    return movies.value.filter(film => {
        const matchGenre = !selectedGenre.value || film.genre === selectedGenre.value;
        const matchSession = validMovieIds.has(film.movieId);
        return matchGenre && matchSession;
    });
});

// Liste des dates disponibles pour les séances à venir jusqu’à mercredi
const availableDates = computed(() => {
    const now = new Date();
    // const nextWednesday = getNextWednesday(now);
    const cinemaId = Number(selectedCinemaId.value) || null;

    const datesSet = new Set<string>();
    movieTimes.value.forEach(session => {
        const sessionDate = new Date(session.day);
        if (
            sessionDate >= now &&
            // sessionDate <= nextWednesday &&
            (!cinemaId || session.cinemaId === cinemaId)
        ) {
            datesSet.add(formatDate(sessionDate));
        }
    });

    return Array.from(datesSet).sort();
});

// API : cinémas
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

// API : séances
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

// API : films
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

// API : avis
const fetchReviews = async (movieId: number) => {
    try {
        const reviewsData = await api.getReviewsAverage(movieId);
        if (reviewsData) {
            const film = movies.value.find(m => m.movieId === movieId);
            if (film) {
                film.averageReview = reviewsData.averageReview === 0 ? null : reviewsData.averageReview;
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis du film :', error);
    }
};

// Navigation vers la fiche du film
const goToFilmDetail = (id: number) => {
    router.push(`/movie/${id}`);
};

// Navigation vers la réservation
const goToMovieReservation = (movieId: number, cinemaId: number) => {
    router.push({ name: 'movieReservation', params: { movieId, cinemaId } });
};

const handleFilmClick = (film: Film) => {
    if (!selectedCinemaId.value) {
        goToFilmDetail(film.movieId);
    } else {
        goToMovieReservation(film.movieId, Number(selectedCinemaId.value));
    }
};

// Chargement initial
onMounted(async () => {
    await fetchMovies();
    await fetchCinemas();
    await fetchMoviesTimes();
    for (const film of movies.value) {
        await fetchReviews(film.movieId);
    }
});
</script>
