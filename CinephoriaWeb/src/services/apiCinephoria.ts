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
}
