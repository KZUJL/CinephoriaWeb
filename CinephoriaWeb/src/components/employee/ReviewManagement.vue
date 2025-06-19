<template>
    <div class="card movie-info mb-3 p-3">
        <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">

            <div class="me-3 d-flex align-items-center">
                <h2 class="mb-0 me-3">Gestion des avis</h2>
                <select class="form-select me-2" style="width: auto;" v-model="selectedValidationFilter">
                    <option value="">Tous les avis</option>
                    <option value="true">Validés</option>
                    <option value="false">Non validés</option>
                </select>
            </div>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Film</th>
                    <th>Avis</th>
                    <th>Commentaires</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                    <th>Validé</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="review in reviews" :key="review.id" @click="selectReviews(review.id)"
                    :class="{ 'table-active': selectedReviewsId === String(review.id) }" style="cursor: pointer;">

                    <td>{{ review.movieTitle }}</td>
                    <td>{{ review.reviews }}</td>
                    <td>{{ review.comments }}</td>
                    <td>{{ review.userName }}</td>
                    <td>{{ formatDate(review.reviewsDate) }}</td>
                    <td>{{ review.reviewsValidation ? 'Oui' : 'Non' }}</td>
                    <td v-if="selectedReviewsId === String(review.id)">
                        <div class="d-flex flex-column gap-2">
                            <button v-if="!review.reviewsValidation" class="btn btn-primary btn-sm"
                                @click="onEditClick">
                                Valider
                            </button>
                            <button class="btn btn-danger btn-sm" @click="onDeleteClick">
                                Supprimer
                            </button>
                        </div>
                    </td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import ApiCinephoria from '../../services/apiCinephoria';
import type { Review, } from '../../models/types';
import { ref, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';


const api = new ApiCinephoria();
const allReviews = ref<Review[]>([]);
const reviews = ref<Review[]>([]);
const selectedValidationFilter = ref<string>('');
const selectedReviewsId = ref<string | null>(null);


const fetchReviews = async () => {
    try {
        const review = await api.getReviews({});
        if (Array.isArray(review)) {
            allReviews.value = review; // on stocke tout
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
    }
};

function selectReviews(id: string | number) {
    selectedReviewsId.value = String(id);
}


watch(selectedValidationFilter, () => {
    filterReviews();
});

const filterReviews = () => {
    if (selectedValidationFilter.value === 'true') {
        reviews.value = allReviews.value.filter(r => r.reviewsValidation === true);
    } else if (selectedValidationFilter.value === 'false') {
        reviews.value = allReviews.value.filter(r => r.reviewsValidation === false);
    } else {
        reviews.value = allReviews.value;
    }
};

const formatDate = (input: string | Date): string => {
    const date = typeof input === 'string' ? new Date(input) : input;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function onEditClick() {
    if (selectedReviewsId.value === null) return;

    const selectedReview = reviews.value.find(r => r.id === selectedReviewsId.value);
    if (!selectedReview) return;

    Swal.fire({
        title: 'Valider cet avis ?',
        text: `Souhaitez-vous valider l'avis de "${selectedReview.userName}" sur "${selectedReview.movieTitle}" ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, valider',
        cancelButtonText: 'Annuler',
    }).then(async (result) => {
        if (result.isConfirmed) {
            await validationReviewsbyId(selectedReviewsId.value);
            Swal.fire('Validé !', 'L’avis a bien été validé.', 'success');
        }
    });
}

async function validationReviewsbyId(id: string) {
    try {
        await api.validationReviews(id);
        // recharge la liste après validation
        await fetchReviews();
        filterReviews();
        selectedReviewsId.value = null;
        Swal.fire('Succès', "L'avis a été validé avec succès.", 'success');
    } catch (error) {
        console.error("Erreur de la validation :", error);
        Swal.fire('Erreur', "Une erreur est survenue lors de la validation de l'avis.", 'error');
    }
}


function onDeleteClick() {
    if (selectedReviewsId.value === null) return;

    const selectedReview = reviews.value.find(r => r.id === selectedReviewsId.value);
    if (!selectedReview) return;

    Swal.fire({
        title: 'Confirmer la suppression',
        text: `Êtes-vous sûr de vouloir supprimer l'avis de "${selectedReview.userName}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteReviewsById(selectedReviewsId.value);
            Swal.fire('Supprimé!', 'Le film a été supprimé.', 'success');
        }
    });
}

async function deleteReviewsById(id: string) {
    try {
        await api.deleteReviews(id);
        // recharge la liste après validation
        await fetchReviews();
        filterReviews();
        selectedReviewsId.value = null;
        Swal.fire('Succès', "L'avis a été supprimé avec succès.", 'success');
    } catch (error) {
        console.error("Erreur de la suppression :", error);
        Swal.fire('Erreur', "Une erreur est survenue lors de la suppression de l'avis.", 'error');
    }
}

onMounted(async () => {
    await fetchReviews();
    filterReviews();
});

</script>