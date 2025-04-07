<template>
    <footer class="footer  text-white py-2">
        <div class="container">
            <div class="cinema-section">
                <h5>Nos Cinémas</h5>
                <hr class="cinema-divider mb-4" />

                <div class="row">
                    <div v-for="cinema in cinemas" :key="cinema.cinemaId" class="col-md-3 mb-3">
                        <a href="#" @click.prevent="selectCinema(cinema.cinemaId)"
                            class="cinema-name d-block text-center text-decoration-none text-light"
                            :aria-expanded="selectedCinemaId === cinema.cinemaId">
                            {{ cinema.name }}
                        </a>
                        <transition name="fade">
                            <div v-if="selectedCinemaId === cinema.cinemaId" class="cinema-details mt-2">
                                <p><strong>Adresse :</strong> {{ cinema.address }}</p>
                                <p><strong>Téléphone :</strong> {{ cinema.phoneNumber || 'Non disponible' }}</p>
                                <div v-for="schedule in cinema.schedules" :key="schedule.scheduleId">
                                    <p><strong>{{ schedule.jour }} :</strong>
                                        {{ (schedule.horaires && schedule.horaires !== 'null - null' &&
                                            schedule.horaires.trim() !== '') ? schedule.horaires : 'Fermé' }}
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

<script>
import ApiCinephoria from '../services/apiCinephoria';

export default {
    name: 'FooterComponent',
    data() {
        return {
            selectedCinemaId: null,
            cinemas: []
        };
    },
    methods: {
        /**
         * Définit le cinéma sélectionné.
         * Si le cinéma est déjà sélectionné, le désélectionne.
         * @param {number} cinemaId
         */
        selectCinema(cinemaId) {
            this.selectedCinemaId = this.selectedCinemaId === cinemaId ? null : cinemaId;
        },

        /**
         * Récupère la liste des cinémas depuis l'API
         */
        async fetchCinemas() {
            const api = new ApiCinephoria();
            try {
                const data = await api.getCinemas();
                this.cinemas = data.map(cinema => {
                    return {
                        ...cinema,
                        schedules: cinema.schedules.map(schedule => {
                            return {
                                jour: schedule.jour,
                                horaires: `${schedule.heure_ouverture} - ${schedule.heure_fermeture}`
                            };
                        })
                    };
                });
            } catch (error) {
                console.error('Erreur lors du chargement des cinémas :', error);
            }
        }
    },
    mounted() {
        this.fetchCinemas();
    }
};
</script>
