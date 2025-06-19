<template>
    <div class="container mt-5 mb-3" style="max-width: 500px;">
        <div class="card movie-info">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">Nous contacter</h3>
                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="username" class="form-label">Nom d’utilisateur (facultatif)</label>
                        <input v-model="username" type="text" class="form-control" id="username"
                            placeholder="Entrez votre nom d’utilisateur" />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Adresse email</label>
                        <input v-model="email" type="email" class="form-control" id="email"
                            placeholder="Entrez votre adresse email" required />
                    </div>
                    <div class="mb-3">
                        <label for="subject" class="form-label">Objet</label>
                        <input v-model="subject" type="text" class="form-control" id="subject"
                            placeholder="Objet de votre message" required />
                    </div>
                    <div class="mb-3">
                        <label for="message" class="form-label">Message</label>
                        <textarea v-model="message" class="form-control" id="message" rows="4"
                            placeholder="Votre message" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 mb-3">Envoyer</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ApiCinephoria from '../services/apiCinephoria';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const api = new ApiCinephoria();
const email = ref('');
const subject = ref('');
const message = ref('');
const username = ref('');

const handleLogin = async () => {
    try {
        // Appel à la méthode postContact du service ApiCinephoria
        await api.postContact({
            username: username.value,
            email: email.value,
            subject: subject.value,
            message: message.value
        });

        Swal.fire('Envoyé!', 'Votre email a été envoyé.', 'success').then(() => {
            // Redirection vers la page d'accueil après confirmation
            router.push('/');
        });

        username.value = '';
        email.value = '';
        subject.value = '';
        message.value = '';
    } catch (error) {
        Swal.fire('Erreur', "Une erreur s'est produite lors de l'envoi.", 'error');
        console.error("Erreur lors de l'envoi du message :", error);
    }
};
</script>