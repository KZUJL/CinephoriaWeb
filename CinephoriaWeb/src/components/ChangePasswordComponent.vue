<template>
    <div class="container mt-5" style="max-width: 500px;">
        <div class="card movie-info">
            <div class="card-body">
                <h3 class="card-title text-center mb-4">Nouveau mot de passe</h3>
                <form @submit.prevent="handlePassword">
                    <div class="mb-3">
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="Mot de passe" required />
                        <div v-if="password && !isPasswordValid" class="text-danger mt-1">
                            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un
                            chiffre et un caractère spécial.
                        </div>
                    </div>
                    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                        {{ errorMessage }}
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Valider</button>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ApiCinephoria from '../services/apiCinephoria';
import Swal from 'sweetalert2';

const router = useRouter();
const password = ref('');
const errorMessage = ref('');

const handlePassword = async () => {
    const api = new ApiCinephoria();

    try {
        if (!isPasswordValid.value) {
            errorMessage.value = "Le mot de passe n'est pas assez sécurisé.";

            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: errorMessage.value,
            });
            return;
        }

        await api.putPasswordAccount({
            email: localStorage.getItem('changePasswordEmail'),
            newPassword: password.value,
        });
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Votre mot de passe a été modifié avec succès.',
        }).then(() => {
            localStorage.clear();
            router.push('/login');
        });
    } catch (e) {
        errorMessage.value = e?.response?.data?.message || "Une erreur est survenue.";

        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage.value,
        });
    }
}
const isPasswordValid = computed(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(password.value)
})
</script>
