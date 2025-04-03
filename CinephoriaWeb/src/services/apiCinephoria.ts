import axios from 'axios';

export default class ApiCinephoria {
    private API_URL: string;

    constructor() {
        this.API_URL = import.meta.env.VITE_API_URL;
        if (!this.API_URL) {
            console.error("API URL is not defined in environment variables.");
            throw new Error("API URL is required.");
        }
    }

    // Méthode générique pour gérer les requêtes
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

    getMovies() {
        return this.fetchMovies('/api/Movies');
    }

    getAvailableMovies() {
        return this.fetchMovies('/api/Movies/available');
    }

    getSoonAvailableMovies() {
        return this.fetchMovies('/api/Movies/soon-available');
    }
}
