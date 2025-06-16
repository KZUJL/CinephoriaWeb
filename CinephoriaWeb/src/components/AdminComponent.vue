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
        <RoomManagement v-if="currentSection === 'salles'" />
        <EmployeeCreation v-if="currentSection === 'employes'" />
        <ReservationOverview v-if="currentSection === 'reservations'" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import MovieManagement from './admin/MovieManagement.vue'
import RoomManagement from './admin/RoomManagement.vue'
import EmployeeCreation from './admin/EmployeeManagement.vue'
import ReservationOverview from './admin/ReservationOverView.vue'

const currentSection = ref('films')

const sections = [
    { id: 'films', label: 'Gestion des Films' },
    { id: 'salles', label: 'Gestion des Salles' },
    { id: 'employes', label: 'Création Compte Employé' },
    { id: 'reservations', label: 'Réservations (7 jours)' },
]
</script>
