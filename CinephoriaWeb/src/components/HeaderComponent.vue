<template>
    <div class="py-3 full-width px-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <router-link to="/" title="Home">
                <img :src="logoSrc" alt="Logo" class="logo mr-3" />
            </router-link>
            <router-link to="/movie">
                <button class="btn custom-btn mx-2" :class="{ 'active-btn': isActiveRoute('/movie') }">
                    Films
                </button>
            </router-link>
            <router-link to="/reservation">
                <button class="btn custom-btn mx-2" :class="{ 'active-btn': isActiveRoute('/reservation') }">
                    Réservation
                </button>
            </router-link>
            <input type="search" class="form-control mx-2 mr-3" placeholder="Recherche..." />
        </div>
        <div class="d-flex align-items-center">
            <button class="btn btn-warning">Contactez-nous</button>
            <button class="btn custom-btn mx-2 d-flex align-items-center">
                <i class="bi bi-person-circle text-white" style="font-size: 1.8rem;" title="Connexion"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'; // Importer useRoute pour accéder à la route actuelle
import logo from '../assets/CINEPHORIA.png';

const route = useRoute();
const logoSrc = logo;

const isActiveRoute = (routePath: string) => {
    return route.path.startsWith(routePath);
};

</script>