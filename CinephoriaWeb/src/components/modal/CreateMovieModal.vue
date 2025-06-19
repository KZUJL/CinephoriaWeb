<!-- components/modal/EditMovieModal.vue -->
<template>

    <div class="modal fade" id="createMovieModal" tabindex="-1" aria-labelledby="createMovieModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un film</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body scrollable-body" v-if="movie">
                    <form>
                        <div class="mb-3">
                            <label class="form-label">Titre</label>
                            <input type="text" class="form-control" v-model="movie.title" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" v-model="movie.description"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Genre</label>
                            <input type="text" class="form-control" v-model="movie.genre" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Durée</label>
                            <input type="text" class="form-control" v-model="movie.duration" placeholder="hh:mm:ss"
                                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" />
                            <small class="text-muted">Format : hh:mm:ss</small>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date de sortie</label>
                            <input type="date" class="form-control" v-model="formattedDate" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Lien de l'affiche</label>
                            <textarea class="form-control" v-model="movie.poster"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Lien de la bande annonce</label>
                            <textarea class="form-control" v-model="movie.trailer"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Directeur</label>
                            <input type="text" class="form-control" v-model="movie.director" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Producteur</label>
                            <input type="text" class="form-control" v-model="movie.producer" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Casting</label>
                            <textarea class="form-control" v-model="movie.cast"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Source de l'affiche</label>
                            <input type="text" class="form-control" v-model="movie.sourcePoster" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Source de la BA</label>
                            <input type="text" class="form-control" v-model="movie.sourceTrailer" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Age minimum</label>
                            <input type="text" class="form-control" v-model="movie.minimumAge" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Coup de coeur</label>
                            <select class="form-control" v-model="movie.isfavorite">
                                <option :value="true">Oui</option>
                                <option :value="false">Non</option>
                            </select>
                        </div>

                        <!-- Ajoute d'autres champs selon le modèle -->
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                    <button class="btn btn-primary" @click="onSave">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import type { Film } from '../../models/types';
import * as bootstrap from 'bootstrap'

const props = defineProps<{
    modelValue: boolean,
    selectedMovie: Film | null
}>();
const emit = defineEmits(['update:modelValue', 'save']);

const movie = ref<Film | null>(null);

const formattedDate = computed<string>({
    get() {
        if (movie.value && movie.value.availableDate) {
            const date = movie.value.availableDate;
            if (date instanceof Date) {
                return date.toISOString().substring(0, 10);  // substring au lieu de substr, c'est mieux
            }
            if (typeof date === 'string') {
                return (date as string).substring(0, 10);
            }
        }
        return '';
    },
    set(value: string) {
        if (movie.value) {
            movie.value.availableDate = new Date(value);
        }
    }
});
if (props.selectedMovie === null) {
    movie.value = {
        title: '',
        description: '',
        genre: '',
        duration: '',
        availableDate: new Date(),
        releaseDate: new Date(),
        poster: '',
        trailer: '',
        director: '',
        producer: '',
        cast: '',
        sourcePoster: '',
        sourceTrailer: '',
        minimumAge: '',
        isfavorite: false
    };
}

// Mise à jour locale du film quand il change
watch(() => props.selectedMovie, (val) => {
    if (val) {
        movie.value = { ...val };
    } else {
        movie.value = {
            id: null,               // ou null si ton backend génère l'id
            movieId: 0,          // valeur par défaut pour movieId
            title: '',
            description: '',
            genre: '',
            duration: '',
            availableDate: new Date(),
            releaseDate: new Date(), // valeur par défaut pour releaseDate
            poster: '',
            trailer: '',
            director: '',
            producer: '',
            cast: '',
            sourcePoster: '',
            sourceTrailer: '',
            minimumAge: '',
            isfavorite: false,
            // autres champs avec valeurs par défaut
        } as Film;
    }
});


const closeModal = () => {
    // Utilisation de  Bootstrap  pour fermer la modal
    const modalEl = document.getElementById('createMovieModal')
    if (modalEl) {

        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
        modal.hide()
    }
}

function onSave() {
    if (movie.value) {
        emit('save', movie.value);
        emit('update:modelValue', false);
        closeModal()
    }
}

</script>
