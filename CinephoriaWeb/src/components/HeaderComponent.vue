<template>
    <div class="py-3 full-width px-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
            <router-link to="/" title="Home">
                <img :src="logoSrc" alt="Logo" class="logo mr-3">
            </router-link>
            <router-link to="/movie">
                <button class="btn custom-btn mx-2">Films</button>
            </router-link>
            <button class="btn custom-btn mx-2">Réservation</button>
            <input type="text" class="form-control mx-2 mr-3" placeholder="Rmecherche...">
        </div>
        <div class="d-flex align-items-center">
            <button class="btn btn-warning text-white">Contactez-nous</button>
            <button class="btn custom-btn mx-2 d-flex align-items-center">
                <i class="bi bi-person-circle text-white" style="font-size: 1.8rem;" title="Connexion"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import logo from '../assets/CINEPHORIA.png';  // Assurez-vous que le chemin est correct

export default defineComponent({
    data() {
        return {
            logoSrc: logo as string,
        };
    },
});
</script>