<template>
    <footer class="footer text-white py-2">
        <div class="container">
            <div class="cinema-section">
                <h5 class="text-center">Nos Cinémas</h5>
                <hr class="cinema-divider mb-4" />

                <div class="row">
                    <div v-for="cinema in cinemas" :key="(cinema as Cinema).cinemaId" class="col-md-3 mb-3">
                        <a href="#" @click.prevent="selectCinema((cinema as Cinema).cinemaId)"
                            class="cinema-name d-block text-center text-decoration-none text-light"
                            :aria-expanded="selectedCinemaId === (cinema as Cinema).cinemaId">
                            {{ (cinema as Cinema).name }}
                        </a>

                        <transition name="fade">
                            <div v-if="selectedCinemaId === (cinema as Cinema).cinemaId" class="cinema-details mt-2">
                                <p><strong>Adresse :</strong> {{ (cinema as Cinema).address }}</p>
                                <p><strong>Téléphone :</strong> {{ (cinema as Cinema).phoneNumber || 'Non disponible' }}
                                </p>
                                <div v-for="schedule in (cinema as Cinema).schedules" :key="schedule.scheduleId">
                                    <p>
                                        <strong>{{ schedule.jour }} :</strong>
                                        {{ schedule.heure_ouverture && schedule.heure_fermeture &&
                                            schedule.heure_ouverture !== 'null' && schedule.heure_fermeture !== 'null'
                                            ? `${schedule.heure_ouverture} - ${schedule.heure_fermeture}`
                                            : 'Fermé' }}
                                    </p>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

                <hr class="cinema-divider mb-4" />
            </div>

            <div class="text-center">
                <div>&copy; 2025 Cinephoria. Tous droits réservés.</div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiCinephoria from '../services/apiCinephoria';
import type { Cinema } from '../models/types';


const selectedCinemaId = ref<number | null>(null);
const cinemas = ref<Cinema[]>([]);

const selectCinema = (cinemaId: number) => {
    selectedCinemaId.value = selectedCinemaId.value === cinemaId ? null : cinemaId;
};

const fetchCinemas = async () => {
    const api = new ApiCinephoria();
    try {
        const data = await api.getCinemas();
        cinemas.value = data;
    } catch (error) {
        console.error('Erreur lors du chargement des cinémas :', error);
    }
};

onMounted(() => {
    fetchCinemas();
});

</script>
