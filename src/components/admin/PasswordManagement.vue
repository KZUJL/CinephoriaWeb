<template>
    <div class="card movie-info mb-3 p-3">
        <h2>Réinitialisation du mot de passe</h2>
        <form @submit.prevent="handleRegister">
            <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input v-model="email" type="email" class="form-control" id="email"
                    placeholder="Entrez l'e-mail du compte à modifier" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input v-model="password" type="password" class="form-control" id="password"
                    placeholder="Entrez le nouveau mot de passe" required />
                <div v-if="password && !isPasswordValid" class="text-danger mt-1">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                    chiffre et un caractère spécial.
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Enregistrer</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApiCinephoria from '../../services/apiCinephoria';
import Swal from 'sweetalert2';

const api = new ApiCinephoria();

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const isPasswordValid = computed(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(password.value)
})
const handleRegister = async () => {
    try {
        const emailExists = await api.getEmailExists(email.value);
        console.log('Email check response:', emailExists);
        if (!emailExists === true) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Aucun compte n\'est associé à cet e-mail. ',
            });
            return;
        }
        // Vérifie la validité du mot de passe (par sécurité côté front)
        if (!isPasswordValid.value) {
            errorMessage.value = "Le mot de passe n'est pas assez sécurisé.";
            return;
        }
        // Création du compte
        const response = await api.putPasswordAccount({
            email: email.value,
            newPassword: password.value
        });
        console.log('Mot de passe mis à jour :', response);
        // Vide les champs du formulaire    
        email.value = '';
        password.value = '';

        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Modification du mot passe réussi',
            timer: 2000,
            showConfirmButton: false,
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.response?.data?.message || "Erreur lors de la modification du mot de passe",
        });
    }
};
</script>
