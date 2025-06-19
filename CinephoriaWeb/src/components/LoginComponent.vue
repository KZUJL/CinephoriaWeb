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
                    <div class="mb-1">
                        <label for="password" class="form-label">Mot de passe</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Mot de passe" required />
                    </div>
                    <div class="mb-3 text-end">
                        <a href="#" @click.prevent="ForgotPassword">Mot de passe oublié&nbsp;?</a>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Se connecter</button>
                </form>
                <div class="text-center mt-3">
                    <small>Vous n'avez pas de compte ? <a href="/createaccount">Inscrivez-vous</a></small>
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
import Swal from 'sweetalert2';

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
        console.log(response.mustChangePassword)

        localStorage.setItem('user', JSON.stringify(response));



        if (response.mustChangePassword === true) {
            // Stocker l'email pour la page de changement de mot de passe
            localStorage.setItem('changePasswordEmail', email.value);
            // Rediriger vers la page de changement de mot de passe
            router.push('/change-password');
        } else {
            let previousRoute = localStorage.getItem('previousRoute');
            if (previousRoute === '/createaccount') {
                previousRoute = '/';
            }
            router.push(previousRoute || '/').then(() => {
                window.location.reload();
            });
        }

    } catch (error) {
        errorMessage.value = "Identifiants incorrects ou erreur serveur.";
        console.error("Erreur d'authentification :", error);
    }
};

function ForgotPassword() {
    if (!email.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Adresse e-mail requise',
            text: "Veuillez renseigner l'adresse mail pour réinitialiser le mot de passe",
        });
        return;
    }
    Swal.fire({
        title: 'Confirmer le renvoi du mot de passe',
        text: `Êtes-vous sûr de vouloir réinitialiser le mot de passe pour l'adresse e-mail : ${email.value} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, réinitialiser',
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            const api = new ApiCinephoria();
            api.postSendResetPassword(email.value)
                .then(() => {
                    Swal.fire('Envoyé!', 'Un e-mail de réinitialisation a été envoyé.', 'success');
                })
                .catch(() => {
                    Swal.fire('Erreur', "Impossible d'envoyer l'e-mail de réinitialisation.", 'error');
                });
        }
    });
}
</script>
