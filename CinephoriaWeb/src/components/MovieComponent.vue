<template>
    <div class="py-3 custom-container">
        <!-- Section Films -->
        <div class="section mb-4">
            <h2 class="text-center text-white font-weight-bold mb-3">Films actuellement en salle</h2>
            <hr class="cinema-divider mb-4" />

            <div class="row">
                <div class="col-12 col-lg-2 mb-4" v-for="film in movies" :key="film.movieId">
                    <div class="card h-100 custom-btn" @click="goToFilmDetail(film.movieId)">
                        <img :src="film.poster" :alt="film.title" :title="film.title"
                            style="object-fit: cover; height: 300px;">
                        <div class="card-body text-start">
                            <span class="font-weight-bold">{{ film.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import type { Film } from '../models/types';

const router = useRouter();
const movies = ref<Film[]>([]); // Déclarer un état réactif pour les films

// Fonction pour récupérer les films
const fetchMovies = async () => {
    const api = new ApiCinephoria();
    try {
        const moviesData = await api.getMovies();
        console.log('Données récupérées:', moviesData);
        if (Array.isArray(moviesData)) {
            movies.value = moviesData;
        } else {
            console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
};
const goToFilmDetail = (id: number) => {
    router.push(`/movie/${id}`);
};
onMounted(() => {
    fetchMovies();
})


</script>