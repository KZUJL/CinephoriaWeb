<template>
    <div class="py-3">
        <div class="d-flex justify-content-end mb-3 p-3 py-1">
            <button @click="logout" class="btn btn-danger">Déconnexion</button>
        </div>
        <h1 class="text-center mb-4">Bienvenue dans votre tableau de bord</h1>

        <div class="mes-reservations container py-3">
            <h2 class="mb-4">Mes réservations</h2>

            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <div v-if="reservations.length">
                <div class="row g-3">
                    <div class="col-12" v-for="reservation in reservations" :key="reservation.userId">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Film ID : {{ reservation.movieId }}</h5>
                                <p class="card-text mb-1">
                                    📅 Date : {{ new Date(reservation.reservationDate).toLocaleDateString() }}
                                </p>
                                <p class="card-text mb-0">
                                    ⏰ Heure : {{ formatHour(reservation.reservationTime) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="alert alert-info">
                Aucune réservation en cours.
            </div>
        </div>


        <div class="mes-reservations container py-3">
            <h2 class="mb-4">Anciennes réservations</h2>

            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>

            <div v-if="reservations.length">
                <div class="row g-3">
                    <div class="col-12" v-for="reservation in reservations" :key="reservation.userId">
                        <div class="card shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">Film ID : {{ reservation.movieId }}</h5>
                                <p class="card-text mb-1">
                                    📅 Date : {{ new Date(reservation.reservationDate).toLocaleDateString() }}
                                </p>
                                <p class="card-text mb-0">
                                    ⏰ Heure : {{ formatHour(reservation.reservationTime) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="alert alert-info">
                Aucune ancienne réservation.
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import type { Reservation } from '../models/types';

const errorMessage = ref('');
const reservations = ref<Reservation[]>([]);

const dashboardReservation = async () => {
    const api = new ApiCinephoria();

    try {
        const userData = localStorage.getItem('user');
        if (!userData) {
            errorMessage.value = "Utilisateur non connecté.";
            return;
        }

        const user = JSON.parse(userData);
        console.log("Récupération des réservations pour userId:", user.userId);

        const response = await api.getReservations({
            userId: user.userId,
        });
        console.log("Réponse brute de l'API :", response);
        reservations.value = (response || []).sort((a, b) => {
            return new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime();
        });
    }
    catch (error) {
        errorMessage.value = "Identifiants incorrects ou erreur serveur.";
        console.error("Erreur d'authentification :", error);
    }
};

function formatHour(isoString: string) {
    const date = new Date(isoString);
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}h${m}`;
}

onMounted(() => {
    dashboardReservation();
});

const router = useRouter();

function logout() {
    localStorage.clear();
    router.push('/').then(() => {
        window.location.reload();
    });
}

</script>
