import axios from 'axios';

export default class ApiCinephoria {
    private API_URL: string;

    /**
     * Constructeur de la classe ApiCinephoria.
     * Initialise l'URL de base de l'API à partir des variables d'environnement.
     * @throws {Error} Lance une erreur si l'URL de l'API n'est pas définie.
     */
    constructor() {
        this.API_URL = import.meta.env.VITE_API_URL;
        if (!this.API_URL) {
            console.error("API URL is not defined in environment variables.");
            throw new Error("API URL is required.");
        }
    }

    /**
     * Méthode générique pour effectuer une requête GET vers un endpoint spécifique.
     * @private
     * @param {string} endpoint - Le chemin de l'endpoint à appeler (ex. '/api/Movies').
     * @returns {Promise<any>} Une promesse résolue avec les données de la réponse.
     * @throws {Error} Lance une erreur si la requête échoue.
     */

    private fetchMovies(endpoint: string) {
        console.log(`Fetching movies from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;  // Résoudre la promesse avec les données
            })
            .catch((error) => {
                console.error(`Error fetching movies from ${endpoint}:`, error);
                throw error;  // Rejeter la promesse avec l'erreur
            });
    }

    /**
     * Récupère tous les films disponibles via l'API.
     * @returns {Promise<any>} Une promesse résolue avec les données des films.
     */
    getMovies() {
        return this.fetchMovies('/api/Movies');
    }
    /**
     * Récupère les films actuellement disponibles via l'API.
     * @returns {Promise<any>} Une promesse résolue avec les données des films disponibles.
     */
    getAvailableMovies() {
        return this.fetchMovies('/api/Movies/available');
    }
    /**
     * Récupère les films qui seront bientôt disponibles via l'API.
     * @returns {Promise<any>} Une promesse résolue avec les données des films à venir.
     */
    getSoonAvailableMovies() {
        return this.fetchMovies('/api/Movies/soon-available');
    }

    getMoviesId(id: number) {
        return this.fetchMovies(`/api/Movies/${id}`)
    }

        /**
     * Méthode générique pour effectuer une requête POST vers un endpoint spécifique.
     * @private
     * @param {string} endpoint - Le chemin de l'endpoint à appeler (ex. '/api/Movies').
     * @param {object} data - Les données à envoyer dans le corps de la requête.
     * @returns {Promise<any>} Une promesse résolue avec les données de la réponse.
     * @throws {Error} Lance une erreur si la requête échoue.
     */
    private postMovie(endpoint: string, data: object) {
        console.log(`Posting movie to ${this.API_URL}${endpoint}`, data);
        return axios
            .post(`${this.API_URL}${endpoint}`, data)
            .then((response) => {
                console.log(`${endpoint} API POST response:`, response.data);
                return response.data;  // Résoudre la promesse avec les données reçues
            })
            .catch((error) => {
                console.error(`Error posting movie to ${endpoint}:`, error);
                throw error;  // Rejeter la promesse avec l'erreur
            });
    }

    /**
     * Crée un nouveau film via l'API.
     * @param {object} movie - L'objet film à créer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    createMovie(movie: object) {
        return this.postMovie('/api/Movies', movie);
    }



    private deleteMovie(endpoint: string) {
        console.log(`Deleting movie at ${this.API_URL}${endpoint}`);
        return axios
            .delete(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API delete response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error deleting movie at ${endpoint}:`, error);
                throw error;
            });
    }

    /**
     * Supprime un film via l'API.
     * @param {number} id - L'identifiant du film à supprimer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse de l'API.
     */
    deleteMovieById(id: number) {
        return this.deleteMovie(`/api/Movies/${id}`);
    }


    private updateMovie(endpoint: string, data: object) {
        console.log(`Updating movie at ${this.API_URL}${endpoint}`, data);
        return axios
            .put(`${this.API_URL}${endpoint}`, data)
            .then((response) => {
                console.log(`${endpoint} API put response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error updating movie at ${endpoint}:`, error);
                throw error;
            });
    }

    /**
     * Modifie un film via l'API.
     * @param {number} id - L'identifiant du film à modifier.
     * @param {object} movieData - Les données du film à mettre à jour.
     * @returns {Promise<any>} Une promesse résolue avec la réponse de l'API.
     */
    updateMovieById(id: number, movieData: object) {
        return this.updateMovie(`/api/Movies/${id}`, movieData);
    }

    private fetchMoviesCinema(endpoint: string, params: object) {
        console.log(`Fetching movies from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`, { params: params })
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;  // Résoudre la promesse avec les données
            })
            .catch((error) => {
                console.error(`Error fetching movies from ${endpoint}:`, error);
                throw error;  // Rejeter la promesse avec l'erreur
            });
    }
    /**
     * Récupère les films disponibles dans un cinéma spécifique via l'API.
     * @param {object} filters - Les filtres à appliquer (cinemaId, movieId).
     * @returns {Promise<any>} Une promesse résolue avec les films correspondant aux filtres.
     */
    getMoviesCinemaId(filters: { cinemaId?: number, movieId?: number, roomId?: number }) {
        // Appel à la méthode générique fetchReservations avec les filtres comme paramètres
        return this.fetchMoviesCinema('/api/MovieTimes', filters);
    }

    private updateMovieTimes(endpoint: string, data: object) {
        console.log(`Updating movie times at ${this.API_URL}${endpoint}`, data);
        return axios
            .put(`${this.API_URL}${endpoint}`, data)
            .then((response) => {
                console.log(`${endpoint} API PUT response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error updating movie times at ${endpoint}:`, error);
                throw error;
            });
    }

    updateMovieTimesById(id: number, movieTimesData: object) {
        return this.updateMovieTimes(`/api/MovieTimes/${id}`, movieTimesData);
    }

    /**
     * Crée une nouvelle séance (MovieTimes) via l'API.
     * @param {object} movieTimesData - Les données de la séance à créer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    postMovieTimes(movieTimesData: object) {
        console.log(`Posting movie times to ${this.API_URL}/api/MovieTimes`, movieTimesData);
        return axios
            .post(`${this.API_URL}/api/MovieTimes`, movieTimesData)
            .then((response) => {
                console.log(`/api/MovieTimes API POST response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error posting movie times to /api/MovieTimes:`, error);
                throw error;
            });
    }

 /**
     * Supprime une séance (MovieTimes) via l'API.
     * @param {number} movieTimesId - L'identifiant de la séance à supprimer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    deleteMovieTimesById(movieTimesId: number) {
        console.log(`Deleting movie times at ${this.API_URL}/api/MovieTimes/${movieTimesId}`);
        return axios
            .delete(`${this.API_URL}/api/MovieTimes/${movieTimesId}`)
            .then((response) => {
                console.log(`/api/MovieTimes/${movieTimesId} API DELETE response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error deleting movie times at /api/MovieTimes/${movieTimesId}:`, error);
                throw error;
            });
    }




    private fetchCinemas(endpoint: string) {
        console.log(`Fetching cinemas from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error fetching cinemas from ${endpoint}:`, error);
                throw error;
            });
    }
    getCinemas() {
        return this.fetchCinemas('/api/Cinema');
    }


    private fetchMovieTimes(endpoint: string) {
        console.log(`Fetching movie times from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error fetching movie times from ${endpoint}:`, error);
                throw error;
            });
    }
    getMovieTimes() {
        return this.fetchMovieTimes('/api/MovieTimes');
    }
    getSeancesByMovieId(id: number) {
        return this.fetchMovieTimes(`/api/MovieTimes/${id}`);
    }
    getSeancesByMovieTimesId(id: number) {
        return this.fetchMovieTimes(`/api/MovieTimes/ByMovieTimes/${id}`);
    }


    private fetchSeatsByRoom(endpoint: string) {
        console.log(`Fetching seats by room from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error fetching seats by room from ${endpoint}:`, error);
                throw error;
            });
    }
    getSeatsByRoom(id: number) {
        return this.fetchSeatsByRoom(`/api/Seats/${id}`);
    }



    private fetchSeats(endpoint: string, params: object) {
        console.log(`Fetching seats from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`, { params: params })
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error fetching seats from ${endpoint}:`, error);
                throw error;  // Rejeter la promesse avec l'erreur
            });
    }
    /**
   * Récupère les données des siéges avec un numéro de siége spécifique via l'API.
   * @param {object} filters - Les filtres à appliquer (cinemaId, movieId).
   * @returns {Promise<any>} Une promesse résolue avec les films correspondant aux filtres.
   */
    getSeatsId(filters: { locationId?: number }) {
        // Appel à la méthode générique fetchReservations avec les filtres comme paramètres
        return this.fetchSeats('/api/Seats', filters);
    }

    /**
     * Crée un nouveau siège via l'API.
     * @param {object} seatData - Les données du siège à créer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    postSeat(seatData: object) {
        console.log(`Posting seat to ${this.API_URL}/api/Seats`, seatData);
        return axios
            .post(`${this.API_URL}/api/Seats`, seatData)
            .then((response) => {
                console.log(`/api/Seats API POST response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error posting seat to /api/Seats:`, error);
                throw error;
            });
    }

    /**
     * Modifie un siège via l'API.
     * @param {number} id - L'identifiant du siège à modifier.
     * @param {object} seatData - Les données du siège à mettre à jour.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    putSeat(id: number, seatData: object) {
        console.log(`Updating seat at ${this.API_URL}/api/Seats/${id}`, seatData);
        return axios
            .put(`${this.API_URL}/api/Seats/${id}`, seatData)
            .then((response) => {
                console.log(`/api/Seats/${id} API PUT response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error updating seat at /api/Seats/${id}:`, error);
                throw error;
            });
    }

    /**
     * Supprime un siège via l'API.
     * @param {number} id - L'identifiant du siège à supprimer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    deleteSeat(id: number) {
        console.log(`Deleting seat at ${this.API_URL}/api/Seats/${id}`);
        return axios
            .delete(`${this.API_URL}/api/Seats/${id}`)
            .then((response) => {
                console.log(`/api/Seats/${id} API DELETE response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error deleting seat at /api/Seats/${id}:`, error);
                throw error;
            });
    }
    /**
    * Méthode générique pour effectuer une requête POST vers un endpoint spécifique.
    * @private
    * @param {string} endpoint - Le chemin de l'endpoint à appeler (ex. '/api/Reservation').
    * @param {object} data - Les données à envoyer dans la requête POST.
    * @returns {Promise<any>} Une promesse résolue avec les données de la réponse.
    * @throws {Error} Lance une erreur si la requête échoue.
    */
    private fetchReservation(endpoint: string, data: object) {
        console.log(`Posting data to ${this.API_URL}${endpoint}`, data);
        return axios
            .post(`${this.API_URL}${endpoint}`, data)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data; // Résoudre la promesse avec les données
            })
            .catch((error) => {
                console.error(`Error posting data to ${endpoint}:`, error);
                throw error; // Rejeter la promesse avec l'erreur
            });
    }

    /**
     * Crée une nouvelle réservation via l'API.
     * @param {object} reservationData - Les données de la réservation à créer.
     * @returns {Promise<any>} Une promesse résolue avec les données de la réservation créée.
     */
    postReservation(reservationData: object) {
        return this.fetchReservation('/api/Reservation', reservationData);
    }
    /**
 * Méthode générique pour effectuer une requête GET vers un endpoint spécifique avec des paramètres de filtre.
 * @private
 * @param {string} endpoint - Le chemin de l'endpoint à appeler (ex. '/api/Reservation').
 * @param {object} params - Les paramètres à envoyer dans la requête GET (pour les filtres).
 * @returns {Promise<any>} Une promesse résolue avec les données de la réponse.
 * @throws {Error} Lance une erreur si la requête échoue.
 */
    private fetchReservations(endpoint: string, params: object) {
        console.log(`Getting data from ${this.API_URL}${endpoint}`, params);
        return axios
            .get(`${this.API_URL}${endpoint}`, { params: params })
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data; // Résoudre la promesse avec les données
            })
            .catch((error) => {
                console.error(`Error getting data from ${endpoint}:`, error);
                throw error; // Rejeter la promesse avec l'erreur
            });
    }

    /**
     * Récupère les réservations avec des filtres via l'API.
     * @param {object} filters - Les filtres à appliquer (cinemaId, movieId, reservationDate, reservationTime).
     * @returns {Promise<any>} Une promesse résolue avec les réservations correspondant aux filtres.
     */
    getReservations(filters: { cinemaId?: number, userId?: number, movieId?: number, reservationDate?: string, reservationTime?: string }) {
        // Appel à la méthode générique fetchReservations avec les filtres comme paramètres
        return this.fetchReservations('/api/Reservation', filters);
    }

    /**
     * Méthode pour effectuer une requête POST d'authentification.
     * @param {object} params - Les données de connexion (ex: email, mot de passe).
     * @returns {Promise<any>} Une promesse résolue avec les informations d'authentification.
     */
    private fetchLogin(endpoint: string, params: object) {
        console.log(`Authenticating user at ${this.API_URL}${endpoint}`, params);
        return axios
            .post(`${this.API_URL}/api/Login/authenticate`, params)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error authenticating user:`, error);
                throw error;
            });
    }

    postLogin(filters: { email?: string, password?: string }) {
        return this.fetchLogin('/api/Login/authenticate', filters);
    }

        /**
     * Méthode pour vérifier si une adresse e-mail est déjà utilisée.
     * @param {string} email - L'adresse e-mail à vérifier.
     * @returns {Promise<boolean>} Une promesse résolue avec `true` si l'e-mail existe, `false` sinon.
     */
        private fetchCheckEmail(endpoint: string, email: string): Promise<boolean> {
            console.log(`Checking email at ${this.API_URL}${endpoint}?email=${email}`);
            return axios
                .get(`${this.API_URL}${endpoint}`, {
                    params: { email }
                })
                .then((response) => {
                    console.log(`Email check response:`, response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error(`Error checking email:`, error);
                    throw error;
                });
        }

        getEmailExists(email: string): Promise<boolean> {
            return this.fetchCheckEmail('/api/Login/check-email', email);
        }


    /**
     * Méthode pour envoyer une requête POST de création de compte utilisateur.
     * @param {object} data - Les informations d'inscription de l'utilisateur.
     * @returns {Promise<any>} - La réponse de l'API après création.
     */
        postCreateAccount(data: {
            firstName: string
            lastName: string
            email: string
            password: string
            roleId: number
            userName: string
            }) {
            return axios
                .post(`${this.API_URL}/api/Login`, data)
                .then((response) => {
                console.log('Compte créé avec succès :', response.data)
                return response.data
                })
                .catch((error) => {
                console.error('Erreur lors de la création du compte :', error)
                throw error
                })
            }

    /**
     * Méthode pour mettre à jour le mot de passe d'un compte utilisateur.
     * @param {object} data - Les informations nécessaires à la mise à jour du mot de passe.
     * @returns {Promise<any>} - La réponse de l'API après la mise à jour.
     */
    putPasswordAccount(data: { email: string; newPassword: string }) {
        return axios
            .put(`${this.API_URL}/api/Login/update-password`, data)
            .then((response) => {
                console.log('Mot de passe mis à jour avec succès :', response.data)
                return response.data
            })
            .catch((error) => {
                console.error('Erreur lors de la mise à jour du mot de passe :', error)
                throw error
            })
    }



    private fetchReviews(endpoint: string, params: object) {
        console.log(`Getting reviews data from ${this.API_URL}${endpoint}`, params);
        return axios
            .get(`${this.API_URL}${endpoint}`, { params: params })
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error getting reviews data from ${endpoint}:`, error);
                throw error;
            });
    }

    /**
     * Récupère les avis avec des filtres via l'API.
     * @param {object} filters - Les filtres à appliquer (userId, movieId).
     * @returns {Promise<any>} Une promesse résolue avec les réservations correspondant aux filtres.
     */
    getReviews(filters: { userId?: number, movieId?: number }) {
        return this.fetchReviews('/api/Reviews', filters);
    }

    /**
     * Récupère les avis validés avec des filtres via l'API.
     * @param {object} filters - Les filtres à appliquer (userId, movieId).
     * @returns {Promise<any>} Une promesse résolue avec les avis validés correspondant aux filtres.
     */
    getValidatedReviews(filters: { userId?: number, movieId?: number }) {
        return this.fetchReviews('/api/Reviews/validated', filters);
    }

        /**
         * Valide un avis via l'API.
         * @param {string} id - L'identifiant de l'avis à valider.
         * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
         */
        validationReviews(id: string) {
            console.log(`Validating review at ${this.API_URL}/api/Reviews/validate/${id}`);
            return axios
                .put(`${this.API_URL}/api/Reviews/validate/${id}`)
                .then((response) => {
                    console.log(`/api/Reviews/validate/${id} API POST response:`, response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error(`Error validating review at /api/Reviews/validate/${id}:`, error);
                    throw error;
                });
        }

        /**
         * Supprime un avis via l'API.
         * @param {string} id - L'identifiant de l'avis à supprimer.
         * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
         */
        deleteReviews(id: string) {
            console.log(`Deleting review at ${this.API_URL}/api/Reviews/${id}`);
            return axios
                .delete(`${this.API_URL}/api/Reviews/${id}`)
                .then((response) => {
                    console.log(`/api/Reviews/${id} API DELETE response:`, response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error(`Error deleting review at /api/Reviews/${id}:`, error);
                    throw error;
                });
        }

    private fetchReviewsAverage(endpoint: string) {
        console.log(`Getting average reviews data from ${this.API_URL}${endpoint}`);
        return axios
            .get(`${this.API_URL}${endpoint}`)
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error getting average reviews data from ${endpoint}:`, error);
                throw error;
            });
    }

    /**
     * Récupère les avis avec des filtres via l'API.
     * @param {object} filters - Les filtres à appliquer (userId, movieId).
     * @returns {Promise<any>} Une promesse résolue avec les réservations correspondant aux filtres.
     */
    getReviewsAverage(id: number) {
        return this.fetchReviewsAverage(`/api/Reviews/average?movieId=${id}`);
    }

    /**
     * Méthode générique pour effectuer une requête GET vers un endpoint spécifique pour les salles.
     * @private
     * @param {string} endpoint - Le chemin de l'endpoint à appeler (ex. '/api/Room').
     * @param {object} [params] - Les paramètres optionnels à envoyer dans la requête GET.
     * @returns {Promise<any>} Une promesse résolue avec les données de la réponse.
     * @throws {Error} Lance une erreur si la requête échoue.
     */
    private fetchRooms(endpoint: string, params?: { roomId?: number }) {
        console.log(`Fetching rooms from ${this.API_URL}${endpoint}`, params);
        return axios
            .get(`${this.API_URL}${endpoint}`, { params })
            .then((response) => {
                console.log(`${endpoint} API response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error fetching rooms from ${endpoint}:`, error);
                throw error;
            });
    }

    /**
     * Récupère toutes les salles disponibles via l'API, avec un filtre optionnel sur roomId.
     * @param {object} [filters] - Les filtres à appliquer (roomId).
     * @returns {Promise<any>} Une promesse résolue avec les données des salles.
     */
    getRooms(filters?: { roomId?: number, cinemaId?: number }) {
        return this.fetchRooms('/api/Room', filters);
    }

    /**
     * Crée une nouvelle salle via l'API.
     * @param {object} roomData - Les données de la salle à créer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    postRoom(roomData: object) {
        console.log(`Posting room to ${this.API_URL}/api/Room`, roomData);
        return axios
            .post(`${this.API_URL}/api/Room`, roomData)
            .then((response) => {
                console.log(`/api/Room API POST response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error posting room to /api/Room:`, error);
                throw error;
            });
    }

    /**
     * Modifie une salle via l'API.
     * @param {number} id - L'identifiant de la salle à modifier.
     * @param {object} roomData - Les données de la salle à mettre à jour.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    putRoom(id: number, roomData: object) {
        console.log(`Updating room at ${this.API_URL}/api/Room/${id}`, roomData);
        return axios
            .put(`${this.API_URL}/api/Room/${id}`, roomData)
            .then((response) => {
                console.log(`/api/Room/${id} API PUT response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error updating room at /api/Room/${id}:`, error);
                throw error;
            });
    }

    /**
     * Supprime une salle via l'API.
     * @param {number} id - L'identifiant de la salle à supprimer.
     * @returns {Promise<any>} Une promesse résolue avec la réponse du serveur.
     */
    deleteRoom(id: number) {
        console.log(`Deleting room at ${this.API_URL}/api/Room/${id}`);
        return axios
            .delete(`${this.API_URL}/api/Room/${id}`)
            .then((response) => {
                console.log(`/api/Room/${id} API DELETE response:`, response.data);
                return response.data;
            })
            .catch((error) => {
                console.error(`Error deleting room at /api/Room/${id}:`, error);
                throw error;
            });
    }

}


