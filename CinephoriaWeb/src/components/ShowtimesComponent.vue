<template>
    <div class="py-3 custom-container">
        <div class="section mb-4" v-if="movieDetails">
            <div class="movie-content">
                <!-- Poster du film -->
                <div class="movie-poster">
                    <img :src="movieDetails.poster" :alt="movieDetails.title" class="film-image">
                    <button type="button" class="btn btn-secondary w-100" @click="openModal">Bande annonce</button>
                    <TrailerModal :trailerUrl="movieDetails?.trailer" />
                </div>

                <!-- Informations du film -->
                <div class="movie-info">
                    <div class="d-flex align-items-center flex-wrap">
                        <h2 class="mb-0 me-2">
                            {{ movieDetails.title }}
                        </h2>
                        <div>
                            <span class="badge rounded-pill text-bg-secondary me-1">{{ movieDetails.genre
                            }}</span>
                            <span class="badge rounded-pill text-bg-secondary">
                                {{ formatDuration(movieDetails.duration) }}
                            </span>
                        </div>
                    </div>
                    <div>
                        <!-- Date de sortie -->
                        <div class="row mb-2 align-items-center">
                            <div class="col-12 d-flex flex-wrap align-items-center">
                                <strong class="me-2">Sortie le :</strong>
                                <span class="me-3">{{ formatReleaseDate(movieDetails.releaseDate) }}</span>
                                <span class="badge bg-success" v-if="isAvailable(movieDetails.availableDate)">
                                    Actuellement en salle
                                </span>

                            </div>
                        </div>

                        <!-- Réalisateur / Producteur -->
                        <div class="row mb-2">
                            <div class="col-12">
                                <strong>Réalisateur :</strong> {{ movieDetails.director }}
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
        </div>
        <h2 class="text-center text-white font-weight-bold mb-3">Séance</h2>
        <hr class="cinema-divider mb-4" />

        <!-- Section des jours de la semaine et horaires -->
        <div class="showtimes-section mt-4">
            <div class="row">
                <div class="col-12 col-md-6" v-for="(day, index) in weekDays" :key="index">
                    <div class="d-flex gap-4 align-items-center">
                        <!-- Colonne à gauche : Jour -->
                        <button class="btn btn-dark btn-sm me-3" style="width: 100px;" disabled>
                            {{ day.name }}
                        </button>
                        <!-- Colonne à droite : Horaires -->
                        <div class="d-flex flex-wrap">
                            <button class="btn btn-light btn-sm mb-1 me-2" v-for="timeInfo in day.times"
                                :key="timeInfo.time + timeInfo.quality"
                                @click.prevent="goToSeatsReservation(timeInfo.movieTimesId)">
                                {{ timeInfo.time }}
                                <span class="badge rounded-pill text-bg-info ms-2">
                                    {{ timeInfo.quality }}
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiCinephoria from '../services/apiCinephoria';
import type { Film } from '../models/types';
import TrailerModal from './modal/TrailerModal.vue';
import { Modal } from 'bootstrap';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Variables réactives
const movieDetails = ref<Film | null>(null);
const weekDays = ref<{ name: string; times: { time: string; quality: string; movieTimesId: number }[] }[]>([]);

// Méthodes
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
        console.error('Error fetching movie details:', error);
    }
};

const formatDuration = (duration: string | undefined | null): string => {
    if (!duration) return '';
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}h${parseInt(minutes)}`;
};

const formatReleaseDate = (dateStr: string | Date | null | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
};

const generateWeekDays = async (movieId: number) => {
    const api = new ApiCinephoria();
    try {
        const seances = await api.getSeancesByMovieId(movieId);
        const daysMap = new Map<string, { time: string; quality: string; movieTimesId: number }[]>();

        seances.forEach((seance: { day: string; startTime: string; room?: { quality?: string }; movieTimesId: number }) => {
            const fullDateTimeStr = `${seance.day.substring(0, 10)}T${seance.startTime}`;
            const date = new Date(fullDateTimeStr);

            if (isNaN(date.getTime())) {
                console.warn("Date invalide pour la séance :", fullDateTimeStr);
                return;
            }

            const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const dayName = date.toLocaleDateString('fr-FR', options);
            const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const quality = seance.room?.quality ?? 'Inconnue';
            const movieTimesId = seance.movieTimesId;

            if (!daysMap.has(dayName)) {
                daysMap.set(dayName, []);
            }

            daysMap.get(dayName)!.push({ time, quality, movieTimesId });
        });

        // Trier les jours dans l’ordre de la semaine française
        const orderedDays = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
        weekDays.value = Array.from(daysMap.entries())
            .sort((a, b) => orderedDays.indexOf(a[0].toLowerCase()) - orderedDays.indexOf(b[0].toLowerCase()))
            .map(([name, times]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                times,
            }));

    } catch (error) {
        console.error("Erreur lors de la récupération des horaires de séances", error);
    }
};

const openModal = () => {
    const modal = new Modal(document.getElementById('trailerModal')!);
    modal.show();
};

const isAvailable = (availableDate: string | Date | null | undefined): boolean => {
    if (!availableDate) return false;
    const today = new Date();
    const available = new Date(availableDate);
    today.setHours(0, 0, 0, 0);
    available.setHours(0, 0, 0, 0);
    return available <= today;
};

const goToSeatsReservation = (movieTimesId: number) => {
    router.push({ name: 'seatsReservation', params: { movieTimesId } });
};

// Lors du montage, récupérer les détails du film et les horaires
onMounted(() => {
    const movieId = Array.isArray(route.params.movieId) ? route.params.movieId[0] : route.params.movieId;
    const parsedMovieId = parseInt(movieId, 10);
    fetchMovieDetails(parsedMovieId);
    generateWeekDays(parsedMovieId);
});
</script>
