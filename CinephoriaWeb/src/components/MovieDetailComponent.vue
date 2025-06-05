<template>
    <div class="py-3 custom-container">
        <div class="section mb-4" v-if="movieDetails">
            <div class="movie-content py-3">
                <!-- Poster du film -->
                <div class="movie-poster position-relative d-inline-block">
                    <img :src="movieDetails.poster" :alt="movieDetails.title" class="film-image" />

                    <!-- Icône Bootstrap centrée -->
                    <i class="bi bi-play-circle-fill play-icon" @click="openModal"
                        :aria-label="`Voir la bande-annonce de ${movieDetails?.title}`" role="button" tabindex="0"></i>

                    <TrailerModal :trailerUrl="movieDetails?.trailer" />
                </div>

                <!-- Informations du film -->
                <div class="card movie-info">
                    <div class="d-flex align-items-center flex-wrap">
                        <h2 class="mb-2 me-2">
                            {{ movieDetails.title }}
                        </h2>
                        <div class="mb-2 d-flex align-items-center">
                            <span class="badge rounded-pill text-bg-secondary me-1">{{ movieDetails.genre }}</span>
                            <span class="badge rounded-pill text-bg-secondary me-2">
                                {{ formatDuration(movieDetails.duration) }}
                            </span>
                            <span v-if="movieDetails.isfavorite"
                                class="bg-danger text-white rounded-start px-2 py-1 ms-2"
                                style="font-size: 0.8rem; font-weight: bold;" title="Coup de cœur">
                                Coup de cœur
                            </span>
                        </div>
                    </div>
                    <div>
                        <span
                            v-if="movieDetails.averageReview !== null && movieDetails.averageReview !== undefined && movieDetails.averageReview > 0">
                            <span v-for="n in 5" :key="n" style="font-size: 0.9em;">
                                <i v-if="n <= Math.floor(movieDetails.averageReview)"
                                    class="fas fa-star text-warning"></i>
                                <i v-else-if="n - 0.5 <= movieDetails.averageReview"
                                    class="fas fa-star-half-alt text-warning"></i>
                                <i v-else class="far fa-star text-secondary"></i>
                            </span>
                            <span class="ms-1 text-white" style="font-size: 0.7em;">
                                {{ movieDetails.averageReview.toFixed(1) }}
                            </span>
                        </span>
                        <span v-else class="text-white" style="font-size: 0.7em;font-style: italic;">
                            Pas encore d'avis
                        </span>
                    </div>
                    <div>
                        <div class="row mb-2 align-items-center">

                        </div>
                        <!-- Date de sortie -->
                        <div class="row mb-2 align-items-center">
                            <div class="col-12 d-flex flex-wrap align-items-center">
                                <strong class="me-2">Sortie le :</strong>
                                <span class="me-3">{{ formatReleaseDate(movieDetails.releaseDate) }}</span>
                                <span v-if="movieDetails.availableDate && isAvailable(movieDetails.availableDate)"
                                    class="badge bg-success">
                                    Actuellement en salle
                                </span>
                                <span v-else-if="movieDetails.availableDate" class="badge bg-warning text-dark">
                                    Bientôt dans vos salles
                                </span>
                            </div>
                        </div>

                        <!-- Réalisateur / Producteur -->
                        <div class="row mb-2">
                            <div class="col-12">
                                <strong>Réalisateurs :</strong> {{ movieDetails.director }}
                                <strong> Producteur :</strong> {{ movieDetails.producer }}
                            </div>
                        </div>

                        <!-- Casting -->
                        <div class="row mb-2">
                            <div class="col-12">
                                <strong>Casting :</strong> {{ movieDetails.cast }}
                            </div>
                        </div>
                    </div>

                    <p>{{ movieDetails.description }}</p>
                </div>


            </div>
            <div>
                <h5>Avis spectateur</h5>
                <div v-if="movieDetails && movieDetails.reviews && movieDetails.reviews.length">
                    <div v-for="review in movieDetails.reviews" :key="review.id" class="card movie-info">
                        <div class="fw-bold">{{ review.userName }}</div>
                        <div>
                            <span v-for="n in 5" :key="n" style="font-size: 0.9em;">
                                <i v-if="n <= Math.floor(review.reviews)" class="fas fa-star text-warning"></i>
                                <i v-else-if="n - 0.5 <= review.reviews" class="fas fa-star-half-alt text-warning"></i>
                                <i v-else class="far fa-star text-secondary"></i>
                            </span>

                        </div>
                        <div>{{ review.comments }}</div>
                        <div>
                            <span class="" style="font-size: 0.7em; font-style: italic;">
                                le {{ new Date(review.reviewsDate).toLocaleDateString('fr-FR') }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <em>Aucun avis pour ce film.</em>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import type { Film } from '../models/types';
import { Modal } from 'bootstrap';
import TrailerModal from './modal/TrailerModal.vue';


const movieDetails = ref<Film | null>(null);
const route = useRoute();


// Fonction pour récupérer les détails du film
const fetchMovieDetails = async (movieId: number) => {
    const api = new ApiCinephoria();
    try {
        const movie = await api.getMoviesId(movieId);
        if (movie) {
            movieDetails.value = movie;
        } else {
            console.error('Erreur : la réponse de l\'API ne contient pas les détails du film');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error);
    }
};

// Fonction pour récupérer les avis
const fetchReviewsAverage = async (movieId: number) => {
    const api = new ApiCinephoria();
    try {
        const reviewsData = await api.getReviewsAverage(movieId);
        if (reviewsData) {
            // Met à jour la note moyenne du film
            if (movieDetails.value && movieDetails.value.movieId === movieId) {
                movieDetails.value.averageReview = reviewsData.averageReview === 0 ? null : reviewsData.averageReview;
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis du film :', error);
    }
};


const fetchReviews = async (movieId: number) => {
    const api = new ApiCinephoria();
    try {
        const reviews = await api.getReviews({ movieId });
        if (reviews && movieDetails.value) {
            movieDetails.value.reviews = reviews;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis du film :', error);
    }
};


// Formatage de la durée
const formatDuration = (duration: string | null | undefined): string => {
    if (!duration) return '';
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}h${parseInt(minutes)}`;
};

// Formatage de la date de sortie
const formatReleaseDate = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const validDate = date instanceof Date ? date : new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return validDate.toLocaleDateString('fr-FR', options);
};

// Fonction pour ouvrir le modal de bande-annonce
const openModal = () => {
    const modal = new Modal(document.getElementById('trailerModal')!);
    modal.show();
};

// Vérification si le film est disponible
const isAvailable = (availableDate: Date | string | null | undefined): boolean => {
    if (!availableDate) return false;

    if (typeof availableDate === 'string') {
        availableDate = new Date(availableDate);
    }

    if (!(availableDate instanceof Date) || isNaN(availableDate.getTime())) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    availableDate.setHours(0, 0, 0, 0);
    return availableDate <= today;
};

// Récupération de l'ID du film à partir de la route et chargement des détails du film
onMounted(async () => {
    const movieId = Array.isArray(route.params.movieId) ? route.params.movieId[0] : route.params.movieId;
    const parsedMovieId = parseInt(movieId, 10);
    await fetchMovieDetails(parsedMovieId);
    if (movieDetails.value) {
        fetchReviewsAverage(movieDetails.value.movieId);
        fetchReviews(movieDetails.value.movieId);
    }
});
</script>
