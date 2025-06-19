<template>
    <div class="container my-4">
        <h1 class="mb-4">Administration</h1>

        <div class="btn-group mb-4" role="group" aria-label="Menu administration">
            <button v-for="section in sections" :key="section.id" class="btn custom-btn"
                :class="{ 'active-btn': currentSection === section.id }" @click="currentSection = section.id">
                {{ section.label }}
            </button>
        </div>

        <MovieManagement v-if="currentSection === 'films'" />
        <ShowTimesManagement v-if="currentSection === 'seances'" />
        <RoomManagement v-if="currentSection === 'salles'" />
        <EmployeeCreation v-if="currentSection === 'employes'" />
        <PasswordManagement v-if="currentSection === 'password'" />
        <ReservationOverview v-if="currentSection === 'reservations'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MovieManagement from './admin/MovieManagement.vue'
import ShowTimesManagement from './admin/ShowTimeManagement.vue'
import RoomManagement from './admin/RoomManagement.vue'
import EmployeeCreation from './admin/EmployeeManagement.vue'
import PasswordManagement from './admin/PasswordManagement.vue'
import ReservationOverview from './admin/ReservationOverView.vue'

const currentSection = ref('films')

const sections = [
    { id: 'films', label: 'Gestion des films' },
    { id: 'seances', label: 'Gestion des séances' },
    { id: 'salles', label: 'Gestion des salles' },
    { id: 'employes', label: 'Création compte employé' },
    { id: 'password', label: 'Réinitialisation du mot de passe' },
    { id: 'reservations', label: 'Réservations (7 jours)' },
]
</script>
