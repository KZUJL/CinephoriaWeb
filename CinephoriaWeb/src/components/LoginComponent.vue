<template>
    <div class="container mt-5" style="max-width: 500px;">
        <div class="card movie-info">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">Connexion</h3>
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="email" type="email" class="form-control" id="email"
                            placeholder="Entrez votre e-mail" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Mot de passe</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Mot de passe" required />
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Se connecter</button>
                </form>
                <div class="text-center mt-3">
                    <small>Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous</a></small>
                </div>
                <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
    const api = new ApiCinephoria();

    try {
        const response = await api.postLogin({
            email: email.value,
            password: password.value,
        });
        localStorage.setItem('user', JSON.stringify(response));

        let previousRoute = localStorage.getItem('previousRoute');
        if (previousRoute === '/createaccount') {
            previousRoute = '/';
        }
        router.push(previousRoute || '/').then(() => {
            window.location.reload();
        });
        // router.push('/').then(() => {
        //     window.location.reload();
        // });
    } catch (error) {
        errorMessage.value = "Identifiants incorrects ou erreur serveur.";
        console.error("Erreur d'authentification :", error);
    }
};
</script>
