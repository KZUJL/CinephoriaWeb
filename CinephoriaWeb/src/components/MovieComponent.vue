<template>
    <div class="py-3  custom-container">
        <!-- Section Nouveautés -->
        <div class="section mb-4">
            <h2>Films actuellement en salle</h2>
            <ul class="d-flex flex-wrap">
                <li v-for="film in movies" :key="film.movieId" class="film-item">
                    <img :src="film.poster" :alt="film.title" class="film-image">
                    <a href="#">{{ film.title }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ApiCinephoria from '../services/apiCinephoria';
import type { Film } from '../models/types';


export default defineComponent({
    data() {
        return {
            movies: [] as Film[],
        };
    },
    methods: {
        async fetchMovies() {
            const api = new ApiCinephoria();
            try {
                const movies = await api.getMovies();
                console.log('Données récupérées:', movies);
                if (Array.isArray(movies)) {
                    this.movies = movies;
                } else {
                    console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des films:', error);
            }
        }
    },
    mounted() {
        this.fetchMovies();
    }
});

</script>
