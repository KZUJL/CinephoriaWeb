<!-- components/modal/CreateUserReviews.vue -->
<template>
    <div class="modal fade" id="createReviewModal" tabindex="-1" aria-labelledby="createReviewModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createReviewModalLabel">Laisser un avis</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitReview">
                        <div class="mb-3">
                            <label for="comment" class="form-label">Commentaire</label>
                            <textarea id="comment" v-model="comment" class="form-control" rows="4"
                                placeholder="Votre commentaire..." required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="rating" class="form-label">Note</label>
                            <select id="rating" v-model.number="rating" class="form-select" required>
                                <option disabled value="">Sélectionnez une note</option>
                                <option v-for="n in 5" :key="n" :value="n">{{ n }} / 5</option>
                            </select>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn btn-primary">Envoyer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Reservation } from '../../models/types';
import * as bootstrap from 'bootstrap';
import Modal from 'bootstrap/js/dist/modal';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const props = defineProps<{
    reservation: Reservation | null;
}>();

const emit = defineEmits(['close', 'submitted']);

const comment = ref('');
const rating = ref<number | ''>('');
let modalInstance: Modal | null = null;

onMounted(() => {
    const modalEl = document.getElementById('createReviewModal');
    if (modalEl) {
        modalInstance = new bootstrap.Modal(modalEl, {});
        modalInstance.show();
    }
});

// Auto-affiche à chaque changement de réservation
watch(() => props.reservation, (newVal) => {
    if (newVal && modalInstance) {
        comment.value = '';
        rating.value = '';
        modalInstance.show();
    }
});

function submitReview() {
    if (props.reservation && rating.value !== '') {
        // Tu peux ici faire un appel API
        emit('submitted', {
            MovieId: props.reservation.movieId,
            MovieTitle: props.reservation.movieTitle,
            UserId: props.reservation.userId,
            UserName: user.userName,
            Comments: comment.value,
            Reviews: rating.value,
            ReviewsDate: new Date().toISOString()
        });
        closeModal();
    }
}

function closeModal() {
    if (modalInstance) {
        modalInstance.hide();
    }
    emit('close');
}
</script>
