<template>
  <div class="py-3 custom-container">
    <!-- Section Nouveautés -->
    <div class="section mb-4">
      <h2 class="text-center text-white font-weight-bold mb-3">Cette semaine</h2>
      <hr class="cinema-divider mb-4" />
      <div class="row">
        <div class="col-12 col-lg-2 mb-4" v-for="film in nouveautes" :key="film.movieId">
          <div class="card h-100 custom-btn" @click="goToFilmDetail(film.movieId)">
            <img :src="film.poster" :alt="film.title" :title="film.title" style="object-fit: cover; height: 300px;">
            <div class="card-body text-start">
              <span class="font-weight-bold">{{ film.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Prochaines Sorties -->
    <div class="section mb-4">
      <h2 class="text-center text-white font-weight-bold mb-3">Prochainement</h2>
      <hr class="cinema-divider mb-4" />
      <div class="row">
        <div class="col-12 col-md-2 mb-4" v-for="film in prochainesSorties" :key="film.movieId">
          <div class="card h-100 custom-btn" @click="goToFilmDetail(film.movieId)">
            <img :src="film.poster" :alt="film.title" :title="film.title" style="object-fit: cover; height: 300px;">
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


// Déclaration des variables réactives
const router = useRouter();
const nouveautes = ref<Film[]>([]);
const prochainesSorties = ref<Film[]>([]);

// Fonction pour récupérer les films disponibles
const fetchAvailableMovies = async () => {
  const api = new ApiCinephoria();
  try {
    const movies = await api.getAvailableMovies();
    if (Array.isArray(movies)) {
      nouveautes.value = movies;
    } else {
      console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};
// Fonction pour récupérer les prochaines sorties
const fetchSoonAvailableMovies = async () => {
  const api = new ApiCinephoria();
  try {
    const movies = await api.getSoonAvailableMovies();
    if (Array.isArray(movies)) {
      prochainesSorties.value = movies;
    } else {
      console.error('Erreur : la réponse de l\'API n\'est pas un tableau');
    }
  } catch (error) {
    console.error('Error fetching available movies:', error);
  }
};

// Fonction pour naviguer vers la page de détails du film
const goToFilmDetail = (id: number) => {
  router.push(`/movie/${id}`);
};

// Utilisation de `onMounted` pour exécuter les requêtes API à la montée du composant
onMounted(() => {
  fetchAvailableMovies();
  fetchSoonAvailableMovies();
});


</script>
