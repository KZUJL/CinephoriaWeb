<template>
    <div class="container mt-5" style="max-width: 500px; padding-bottom: 3rem;">
        <div class="card movie-info">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">Inscription</h3>
                <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label for="email" class="form-label">E-mail</label>
                        <input v-model="email" type="email" class="form-control" id="email"
                            placeholder="Entrez votre e-mail" required />
                    </div>
                    <div class="mb-3">
                        <label for="firstName" class="form-label">Prénom</label>
                        <input v-model="firstName" type="text" class="form-control" id="firstName"
                            placeholder="Entrez votre prénom" required />
                    </div>
                    <div class="mb-3">
                        <label for="lastName" class="form-label">Nom</label>
                        <input v-model="lastName" type="text" class="form-control" id="lastName"
                            placeholder="Entrez votre nom" required />
                    </div>
                    <div class="mb-3">
                        <label for="username" class="form-label">Nom d'utilisateur</label>
                        <input v-model="username" type="text" class="form-control" id="username"
                            placeholder="Choisissez un nom d'utilisateur" required />
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Mot de passe</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Mot de passe" required />
                        <div v-if="password && !isPasswordValid" class="text-danger mt-1">
                            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                            chiffre et un caractère spécial.
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
                </form>
                <div class="text-center mt-3">
                    <small>Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></small>
                </div>
                <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
    <CreateAccountModal />
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import ApiCinephoria from '../services/apiCinephoria';
import { Modal } from 'bootstrap';
import CreateAccountModal from './modal/CreateAccountModal.vue';


const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const username = ref('')
const errorMessage = ref('')

const isPasswordValid = computed(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(password.value)
})

const showSuccessModal = () => {
    const modalElement = document.getElementById('createAccountModal')
    if (modalElement) {
        const modal = new Modal(modalElement)
        modal.show()
    }
}

const handleRegister = async () => {
    try {
        const api = new ApiCinephoria();
        const emailExists = await api.getEmailExists(email.value);
        if (emailExists) {
            errorMessage.value = "Cette adresse e-mail est déjà utilisée.";
            return;
        }
        // Vérifie la validité du mot de passe (par sécurité côté front)
        if (!isPasswordValid.value) {
            errorMessage.value = "Le mot de passe n'est pas assez sécurisé.";
            return;
        }
        // Création du compte
        const response = await api.postCreateAccount({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            roleId: 3,
            userName: username.value,
        });
        console.log('Utilisateur créé :', response);
        errorMessage.value = '';

        showSuccessModal();

    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription";
    }
};
</script>
