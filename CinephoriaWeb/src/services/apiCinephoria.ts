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

}


