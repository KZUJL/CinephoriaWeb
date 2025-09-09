<template>
    <nav class="py-2 full-width px-4 d-flex justify-content-between align-items-center ">
        <!-- Logo + titre -->
        <div class="d-flex align-items-center">
            <router-link to="/" title="Home">
                <img :src="logoSrc" alt="Logo" class="logo me-3 mb-1" width="80" />
            </router-link>
            <h2 class="me-3 text-white">Cinephoria</h2>
        </div>

        <!-- Menu desktop -->
        <div class="d-none d-md-flex align-items-center">
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
            <button class="btn btn-warning mx-2" @click="$router.push('/contact')">
                Contactez-nous
            </button>
            <button class="btn custom-btn mx-2 d-flex align-items-center"
                :class="{ 'active-btn': isActiveRoute(userName ? '/dashboard' : '/login') }"
                @click="userName ? $router.push('/dashboard') : openModal()">
                <i class="bi bi-person-circle text-white" style="font-size: 1.8rem;"
                    :title="userName ? 'Dashboard' : 'Connexion'"></i>
            </button>
        </div>

        <!-- Menu mobile (burger) -->
        <div class="d-md-none">
            <button class="btn btn-outline-light" @click="toggleMenu" aria-label="Menu">
                ☰
            </button>
            <div v-if="isMenuOpen" class="position-absolute end-0 mt-2 me-3 w-48 mobile-menu">
                <router-link to="/movie" class="mobile-menu-item" @click="closeMenu">
                    Films
                </router-link>
                <router-link to="/reservation" class="mobile-menu-item" @click="closeMenu">
                    Réservation
                </router-link>
                <button class="mobile-menu-item" @click="() => { $router.push('/contact'); closeMenu(); }">
                    Contact
                </button>
                <button class="mobile-menu-item d-flex align-items-center"
                    @click="() => { userName ? $router.push('/dashboard') : openModal(); closeMenu(); }">
                    <i class="bi bi-person-circle text-white me-2" style="font-size: 1.5rem;"></i>
                    <span>{{ userName ? "Dashboard" : "Connexion" }}</span>
                </button>
            </div>

        </div>

        <LoginModal />
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import logo from "../assets/CINEPHORIA_1.png";
import { Modal } from "bootstrap";
import LoginModal from "./modal/LoginModal.vue";

const route = useRoute();
const logoSrc = logo;

// Burger menu state
const isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);
const closeMenu = () => (isMenuOpen.value = false);

// Modal login
const openModal = () => {
    const modal = new Modal(document.getElementById("loginModal")!);
    modal.show();
};

const isActiveRoute = (routePath: string) => {
    return route.path.startsWith(routePath);
};

// User state
const userName = ref<string | null>(null);

onMounted(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
        const user = JSON.parse(userString);
        userName.value = user.userName;
    }
});
</script>

<style scoped>
.hover-bg:hover {
    background-color: hsl(235, 49%, 42%);
}
</style>
