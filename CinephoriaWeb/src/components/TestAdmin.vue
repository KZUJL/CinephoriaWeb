<template>
    <div class="container my-4">
        <h1 class="mb-4">Administration</h1>

        <div class="btn-group mb-4" role="group" aria-label="Menu administration">
            <button type="button" class="btn custom-btn" :class="{ 'active-btn': currentSection === 'films' }"
                @click="currentSection = 'films'">
                Gestion des Films
            </button>
            <button type="button" class="btn custom-btn" :class="{ 'active-btn': currentSection === 'salles' }"
                @click="currentSection = 'salles'">
                Gestion des Salles
            </button>
            <button type="button" class="btn custom-btn" :class="{ 'active-btn': currentSection === 'employes' }"
                @click="currentSection = 'employes'">
                Création Compte Employé
            </button>
            <button type="button" class="btn custom-btn" :class="{ 'active-btn': currentSection === 'reservations' }"
                @click="currentSection = 'reservations'">
                Réservations (7 jours)
            </button>
        </div>

        <div v-show="currentSection === 'films'" class="card movie-info mb-3 p-3">

            <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">
                <h2 class="mb-0">Gestion des Films</h2>
                <div>
                    <button class="btn btn-success" @click="onAddClick">Ajouter</button>
                    <!-- <button class="btn btn-primary me-2">Modifier</button>
                    <button class="btn btn-danger" :disabled="selectedMovieId === null" @click="onDeleteClick">
                        Supprimer
                    </button> -->

                </div>
            </div>
            <div v-if="message" class="toast-message">{{ message }}</div>


            <table v-if="movies.length" class="table ">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Genre</th>
                        <th>Durée</th>
                        <th>Date de sortie</th>
                        <th>Action(s)</th>

                        <!-- Ajoutez d'autres colonnes si besoin -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="movie in movies" :key="movie.movieId" @click="selectMovie(movie.movieId)"
                        :class="{ 'table-active': selectedMovieId === movie.movieId }" style="cursor: pointer;">

                        <td>{{ movie.title }}</td>
                        <td>{{ movie.genre }}</td>
                        <td>{{ movie.duration }}</td>
                        <td>{{ formatDate(movie.availableDate) }}</td>
                        <td v-if="selectedMovieId === movie.movieId">
                            <button class="btn btn-primary btn-sm me-2" @click="onEditClick">
                                Modifier
                            </button>
                            <button class="btn btn-danger btn-sm" @click="onDeleteClick">
                                Supprimer
                            </button>
                        </td>
                        <td v-else></td>

                    </tr>
                </tbody>
            </table>
            <div v-else>Aucun film trouvé.</div>
        </div>

        <div v-if="currentSection === 'salles'" class="card movie-info mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 py-1">
                <h2 class="mb-0">Gestion des Salles</h2>
                <div>
                    <button class="btn btn-success">Ajouter</button>

                </div>
            </div>
            <table v-if="rooms.length" class="table ">
                <thead>
                    <tr>
                        <th>Cinema</th>
                        <th>Name</th>
                        <th>Nbre</th>
                        <th>Action(s)</th>


                        <!-- Ajoutez d'autres colonnes si besoin -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="room in rooms" :key="room.roomId" @click="selectMovie(room.roomId)"
                        :class="{ 'table-active': selectedMovieId === room.roomId }" style="cursor: pointer;">

                        <td>{{ room.cinema.name }}</td>
                        <td>{{ room.name }}</td>
                        <td>{{ room.seatsNumber }}</td>
                        <td v-if="selectedMovieId === room.roomId">
                            <button class="btn btn-primary btn-sm me-2" @click="onEditRoomClick">
                                Modifier
                            </button>
                            <button class="btn btn-danger btn-sm" @click="onDeleteClick">
                                Supprimer
                            </button>
                        </td>
                        <td v-else></td>


                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="currentSection === 'employes'" class="card movie-info mb-3 p-3">
            <h2>Création Compte Employé</h2>

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
                    <label for="roleId" class="form-label">Rôle</label>
                    <select v-model="roleId" class="form-select" id="roleId" required>
                        <option :value="1">Admin</option>
                        <option :value="2">Employé</option>
                    </select>
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
                <button type="submit" class="btn btn-primary w-100">Créer le compte Employé</button>
            </form>
        </div>

        <div v-if="currentSection === 'reservations'" class="card movie-info mb-3 p-3">
            <h2>Visualisation des Réservations (7 prochains jours)</h2>
            <p>Voir les réservations prévues entre aujourd’hui et les 7 prochains jours.</p>

            <table v-if="reservationCounts.length" class="table table-striped">
                <thead>
                    <tr>
                        <th>Film</th>
                        <th>Nombre de Réservations</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="res in reservationCounts" :key="res.movieId">
                        <tr style="cursor: pointer" @click="toggleExpand(res.movieId)">
                            <td>{{ res.title }}</td>
                            <td>{{ res.count }}</td>
                        </tr>
                        <tr v-if="expandedMovieId === res.movieId">
                            <td colspan="2" style="padding-left: 2rem;">
                                <table class="table table-borderless mb-0">
                                    <thead>
                                        <tr>
                                            <th>Cinéma</th>
                                            <th>Nombre de Réservations</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(count, cinema) in getReservationCountByCinema(res.movieId)"
                                            :key="cinema">
                                            <td>{{ cinema }}</td>
                                            <td>{{ count }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </template>
                </tbody>

            </table>

            <div v-else>Aucune réservation prévue sur les 7 prochains jours.</div>
            <!-- <div v-if="reservationCounts.length" class="mt-4">
                <ReservationChart :data="reservationCounts" />
            </div> -->
        </div>


    </div>
    <CreateAccountModal />
    <EditMovieModal :model-value="isEditModalOpen" :selected-movie="selectedMovie" @save="handleEditSave" />
    <EditRoomModal :model-value="isEditRoomModalOpen" :selected-movie="selectedRoom" @save="handleEditRoomSave" />
    <CreateMovieModal :model-value="isCreateModalOpen" :selected-movie="selectedMovie" @save="handleEditCreate"
        @update:model-value="isCreateModalOpen = $event" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ApiCinephoria from '../services/apiCinephoria';
import type { Film, Reservation, Room } from '../models/types';
import { Modal } from 'bootstrap';
import CreateAccountModal from './modal/CreateAccountModal.vue';
import Swal from 'sweetalert2';
import EditMovieModal from './modal/EditMovieModal.vue';
import CreateMovieModal from './modal/CreateMovieModal.vue';
import EditRoomModal from './modal/EditRoomModal.vue';

// import ReservationChart from './ReservationChart.vue';
const api = new ApiCinephoria();
const movies = ref<Film[]>([]);
const rooms = ref<Room[]>([]);
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const username = ref('')
const errorMessage = ref('')
const roleId = ref(2);
const expandedMovieId = ref<number | null>(null);
const selectedMovieId = ref<number | null>(null);
const message = ref('');
const isEditModalOpen = ref(false);
const isEditRoomModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const selectedMovie = ref<Film | null>(null);
const selectedRoom = ref<Room | null>(null);

async function onEditClick() {
    if (selectedMovieId.value === null) return;

    const movie = movies.value.find(m => m.movieId === selectedMovieId.value);
    if (!movie) return;

    try {
        const fetchedMovie = await api.getMoviesId(movie.movieId);
        selectedMovie.value = fetchedMovie;
        isEditModalOpen.value = true;

        // Affiche la modale Bootstrap
        const modalElement = document.getElementById('editMovieModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }

    } catch (error) {
        console.error("Erreur lors de la récupération du film :", error);
    }
}
async function handleEditCreate(createdMovie: Film) {
    await api.createMovie(createdMovie).then(() => {
        // Une fois réussi, affiche la SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le film a bien été ajouté.',
            timer: 2000,
            showConfirmButton: false,
        });

        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMovies();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'L\'ajout a échoué.',
        });
    });
}
function onAddClick() {
    isCreateModalOpen.value = true;

    const modalElement = document.getElementById('createMovieModal');
    if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
    }
}
async function handleEditSave(updatedMovie: Film) {

    // Logique pour sauvegarder les données modifiées, ex:
    console.log('Film modifié :', updatedMovie);
    await api.updateMovieById(updatedMovie.movieId, updatedMovie).then(() => {
        // Une fois réussi, affiche la SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le film a bien été modifié.',
            timer: 2000,
            showConfirmButton: false,
        });

        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMovies();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La modification a échoué.',
        });
    });
}
async function onEditRoomClick() {
    if (selectedMovieId.value === null) return;

    const room = rooms.value.find(m => m.roomId === selectedMovieId.value);
    if (!room) return;

    try {
        const fetchedRoom = await api.getRooms({ roomId: room.roomId });
        // getRooms may return an array or a single room, adjust as needed
        selectedRoom.value = Array.isArray(fetchedRoom) ? fetchedRoom[0] : fetchedRoom;
        isEditRoomModalOpen.value = true;

        // Affiche la modale Bootstrap
        const modalElement = document.getElementById('editRoomModal');
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
        }

    } catch (error) {
        console.error("Erreur lors de la récupération de la salle :", error);
    }
}
async function handleEditRoomSave(updatedRoom: Room) {

    // Logique pour sauvegarder les données modifiées, ex:
    console.log('Salle modifié :', updatedRoom);
    await api.updateMovieById(updatedRoom.roomId, updatedRoom).then(() => {
        // Une fois réussi, affiche la SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La salle a bien été modifiée.',
            timer: 2000,
            showConfirmButton: false,
        });

        // Fermer la modale
        isEditModalOpen.value = false;
        // Mettre à jour la liste des films, etc...
        fetchMovies();

    }).catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La modification a échoué.',
        });
    });
}

function selectMovie(movieId: number) {
    selectedMovieId.value = movieId;
}

function toggleExpand(movieId: number) {
    if (expandedMovieId.value === movieId) {
        expandedMovieId.value = null;
    } else {
        expandedMovieId.value = movieId;
    }
}

// Fonction pour compter les réservations par cinéma pour un film donné
function getReservationCountByCinema(movieId: number): Record<string, number> {
    const filtered = reservations.value.filter(r => r.movieId === movieId);
    const counts: Record<string, number> = {};
    filtered.forEach(r => {
        counts[r.cinemaName] = (counts[r.cinemaName] || 0) + 1;
    });
    return counts;
}

const isPasswordValid = computed(() => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    return regex.test(password.value)
})

const formatDate = (input: string | Date): string => {
    const date = typeof input === 'string' ? new Date(input) : input;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const fetchMovies = async () => {
    try {
        const moviesData = await api.getMovies();
        if (Array.isArray(moviesData)) {
            movies.value = moviesData;
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
};

const fetchRooms = async () => {
    try {
        const roomData = await api.getRooms();
        if (Array.isArray(roomData)) {
            rooms.value = roomData;
            console.log("Liste des salle :", roomData)
        } else {
            console.error("Erreur : la réponse de l'API n'est pas un tableau");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des salles:', error);
    }
};

const currentSection = ref('films');
const reservations = ref<Reservation[]>([]);
const reservationCounts = ref<{ movieId: number; title: string; count: number }[]>([]);

const fetchReservationsNext7Days = async () => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const resData = await api.getReservations({});

        if (Array.isArray(resData)) {
            // Ne garde que les réservations entre aujourd’hui et +7 jours
            const upcomingReservations = resData.filter(r => {
                const resDate = new Date(r.reservationDate);
                return resDate >= today && resDate <= nextWeek;
            });

            reservations.value = upcomingReservations;

            const counts: Record<number, number> = {};

            for (const r of upcomingReservations) {
                counts[r.movieId] = (counts[r.movieId] || 0) + 1;
            }

            reservationCounts.value = Object.entries(counts).map(([movieIdStr, count]) => {
                const movieId = parseInt(movieIdStr);
                const movie = movies.value.find(m => m.movieId === movieId);
                return {
                    movieId,
                    title: movie ? movie.title : `Film #${movieId}`,
                    count,
                };
            });
        } else {
            console.error("Réponse inattendue pour les réservations");
        }
    } catch (err) {
        console.error("Erreur lors du chargement des réservations :", err);
    }
};

const showSuccessModal = () => {
    const modalElement = document.getElementById('createAccountModal')
    if (modalElement) {
        const modal = new Modal(modalElement)
        modal.show()
    }
}

const handleRegister = async () => {
    try {
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

        showSuccessModal();

    } catch (error) {
        errorMessage.value = error.response?.data?.message || "Erreur lors de l'inscription";
    }
};

async function deleteMovieById(id: number) {
    try {
        await api.deleteMovieById(id);
        // recharge la liste après suppression
        await fetchMovies();
        selectedMovieId.value = null; // déselectionner
        message.value = 'Film supprimé avec succès !';
        setTimeout(() => { message.value = ''; }, 5000);
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        message.value = "Erreur lors de la suppression du film.";
        setTimeout(() => { message.value = ''; }, 3000);
    }
}

function onDeleteClick() {
    if (selectedMovieId.value === null) return;

    const movie = movies.value.find(m => m.movieId === selectedMovieId.value);
    if (!movie) return;

    Swal.fire({
        title: 'Confirmer la suppression',
        text: `Êtes-vous sûr de vouloir supprimer le film "${movie.title}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteMovieById(selectedMovieId.value);
            Swal.fire('Supprimé!', 'Le film a été supprimé.', 'success');
        }
    });
}

onMounted(async () => {
    await fetchMovies();
    await fetchRooms();
    await fetchReservationsNext7Days();
})

</script>
