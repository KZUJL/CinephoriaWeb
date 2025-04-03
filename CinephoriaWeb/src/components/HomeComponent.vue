<template>
  <div class="py-3  custom-container">
    <!-- Section Nouveautés -->
    <div class="section mb-4">
      <h2>Nouveautés</h2>
      <ul class="d-flex flex-wrap">
        <li v-for="film in nouveautes" :key="film.movieId" class="film-item">
          <img :src="film.poster" :alt="film.title" class="film-image" :title="film.title">
          <a href="#">{{ film.title }}</a>
        </li>
      </ul>
    </div>

    <!-- Section Prochaines Sorties -->
    <div class="section">
      <h2>Prochaines sorties cinéma</h2>
      <ul class="d-flex flex-wrap">
        <li v-for="film in prochainesSorties" :key="film.movieId" class="film-item">
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
      nouveautes: [] as Film[],
      prochainesSorties: [] as Film[],
    };
  },
  methods: {
    async fetchAvailableMovies() {
      const api = new ApiCinephoria();
      try {
        // Récupère les films depuis l'API
        const movies = await api.getAvailableMovies();
        if (Array.isArray(movies)) {
          this.nouveautes = movies; // Assurez-vous que l'API retourne bien un tableau de Film[]
        } else {
          console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    async fetchSoonAvailableMovies() {
      const api = new ApiCinephoria();
      try {
        // Récupère les prochaines sorties depuis l'API
        const movies = await api.getSoonAvailableMovies();
        if (Array.isArray(movies)) {
          this.prochainesSorties = movies;
        } else {
          console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
        }
      } catch (error) {
        console.error('Error fetching available movies:', error);
      }
    }
  },
  mounted() {
    // Lors du montage du composant, récupérer les films
    this.fetchAvailableMovies();
    this.fetchSoonAvailableMovies();
  }
});
</script>
