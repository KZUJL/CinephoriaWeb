<template>
    <div class="py-3 full-width container">
        <!-- Section Nouveautés -->
        <div class="section mb-4">
            <h2>Films actuellement en salle</h2>
            <ul class="d-flex flex-wrap">
                <li v-for="film in nouveautes" :key="film.id" class="film-item">
                    <img :src="film.image" :alt="film.titre" class="film-image">
                    <a href="#">{{ film.titre }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import film1 from '../assets/film1.webp';
import film2 from '../assets/film2.webp';
import film3 from '../assets/film3.webp';
import film4 from '../assets/film4.webp';
import film5 from '../assets/film5.webp';
import film6 from '../assets/film6.webp';
import film7 from '../assets/film7.webp';
import film8 from '../assets/film8.webp';
import film9 from '../assets/film9.webp';
import film10 from '../assets/film10.webp';
import film11 from '../assets/film11.webp';
import film12 from '../assets/film12.webp';
import film13 from '../assets/film13.webp';
import film14 from '../assets/film14.webp';
import film15 from '../assets/film15.webp';
import film16 from '../assets/film16.webp';


export default defineComponent({
    data() {
        return {
            nouveautes: [
                { id: 1, titre: 'Film 1', image: film1 },
                { id: 2, titre: 'Film 2', image: film2 },
                { id: 3, titre: 'Film 3', image: film3 },
                { id: 4, titre: 'Film 4', image: film4 },
                { id: 5, titre: 'Film 5', image: film5 },
                { id: 6, titre: 'Film 6', image: film6 },
                { id: 7, titre: 'Film 7', image: film7 },
                { id: 8, titre: 'Film 8', image: film8 },
                { id: 9, titre: 'Film 9', image: film9 },
                { id: 10, titre: 'Film 10', image: film10 },
                { id: 11, titre: 'Film 11', image: film11 },
                { id: 12, titre: 'Film 12', image: film12 },
                { id: 13, titre: 'Film 13', image: film13 },
                { id: 14, titre: 'Film 14', image: film14 },
                { id: 15, titre: 'Film 15', image: film15 },
                { id: 16, titre: 'Film 16', image: film16 },
            ]
        };
    }
});
</script>

<style scoped>
/* Style des films */
.film-item {
    list-style: none;
    margin-right: 20px;
    text-align: center;
}

.film-image {
    width: 200px;
    height: 260px;
    border-radius: 8px;
    display: block;
    margin-bottom: 8px;
}
</style>