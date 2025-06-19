<template>
    <div class="py-2 full-width px-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <router-link to="/" title="Home">
                <img :src="logoSrc" alt="Logo" class="logo me-3 mb-1" width="80" />
            </router-link>
            <h2 class="me-3">Cinephoria</h2>
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
            <!-- <input type="search" class="form-control mx-2 mr-3" placeholder="Recherche..." /> -->
        </div>
        <div class="d-flex align-items-center">
            <template v-if="userName">
                <span class="text-white me-3">Bienvenue, {{ userName }}</span>
            </template>
            <button class="btn btn-warning">Contactez-nous</button>

            <button class="btn custom-btn mx-2 d-flex align-items-center"
                :class="{ 'active-btn': isActiveRoute(userName ? '/dashboard' : '/login') }"
                @click="userName ? $router.push('/dashboard') : openModal()">
                <i class="bi bi-person-circle text-white" style="font-size: 1.8rem;"
                    :title="userName ? 'Dashboard' : 'Connexion'"></i>
            </button>

            <LoginModal />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import logo from '../assets/CINEPHORIA_1.png';
import { Modal } from 'bootstrap';
import LoginModal from './modal/LoginModal.vue';


const route = useRoute();
const logoSrc = logo;


const openModal = () => {
    const modal = new Modal(document.getElementById('loginModal')!);
    modal.show();
};

const isActiveRoute = (routePath: string) => {
    return route.path.startsWith(routePath);
};

// État pour l'utilisateur connecté
const userName = ref<string | null>(null);

// Vérifie localStorage au montage
onMounted(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const user = JSON.parse(userString);
        userName.value = user.userName;
    }
});

</script>