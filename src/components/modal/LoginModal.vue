<!-- src/components/modal/LoginModal.vue -->
<template>
    <div class="modal" id="loginModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-4">
                <div class="modal-header">
                    <h5 class="modal-title">Bienvenue</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    <p>Que souhaitez-vous faire ?</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary me-2" @click="goToLogin">Me connecter</button>
                        <button class="btn btn-secondary" @click="goToCreateAccount">Créer un compte</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import * as bootstrap from 'bootstrap'

const router = useRouter()

const closeModal = () => {
    // Utilisation de  Bootstrap  pour fermer la modal
    const modalEl = document.getElementById('loginModal')
    if (modalEl) {

        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
        modal.hide()
    }
}

const goToLogin = () => {
    closeModal()
    router.push('/login')
}

const goToCreateAccount = () => {
    closeModal()
    router.push('/createaccount')
}
</script>
