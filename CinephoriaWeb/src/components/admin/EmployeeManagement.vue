<template>
    <div class="card movie-info mb-3 p-3">
        <h2>Création Compte Employé</h2>
        <form @submit.prevent="handleRegister">
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input v-model="email" type="email" class="form-control" id="email" placeholder="Entrez votre e-mail"
                    required />
            </div>
            <div class="mb-3">
                <label for="firstName" class="form-label">Prénom</label>
                <input v-model="firstName" type="text" class="form-control" id="firstName"
                    placeholder="Entrez votre prénom" required />
            </div>
            <div class="mb-3">
                <label for="lastName" class="form-label">Nom</label>
                <input v-model="lastName" type="text" class="form-control" id="lastName" placeholder="Entrez votre nom"
                    required />
            </div>
            <div class="mb-3">
                <label for="username" class="form-label">Nom d'utilisateur</label>
                <input v-model="username" type="text" class="form-control" id="username"
                    placeholder="Choisissez un nom d'utilisateur" required />
            </div>
            <div class="mb-3">
                <label for="roleId" class="form-label">Rôle</label>
                <select v-model="roleId" class="form-select" id="roleId" required>
                    <option :value="1">Admin</option>
                    <option :value="2">Employé</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input v-model="password" type="password" class="form-control" id="password" placeholder="Mot de passe"
                    required />
                <div v-if="password && !isPasswordValid" class="text-danger mt-1">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                    chiffre et un caractère spécial.
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Créer le compte Employé</button>
        </form>
    </div>
    <CreateAccountModal />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import CreateAccountModal from '../modal/CreateAccountModal.vue';
import Swal from 'sweetalert2';

// import ReservationChart from './ReservationChart.vue';
const api = new ApiCinephoria();


const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const username = ref('')
const errorMessage = ref('')
const roleId = ref(2);

const isPasswordValid = computed(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(password.value)
})
const handleRegister = async () => {
    try {
        const emailExists = await api.getEmailExists(email.value);
        console.log('Email check response:', emailExists);
        if (emailExists === true) {
            errorMessage.value = "Cette adresse e-mail est déjà utilisée.";
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'L\'adresse e-mail est déjà utilisée. ',
            });
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
            roleId: roleId.value,
            userName: username.value,
        });
        console.log('Utilisateur créé :', response);
        errorMessage.value = '';

        // Vide les champs du formulaire
        firstName.value = '';
        lastName.value = '';
        email.value = '';
        password.value = '';
        username.value = '';

        // showSuccessModal();

        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'L\'employé(e) a bien été ajouté(e).',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription";
    }
};
</script>
