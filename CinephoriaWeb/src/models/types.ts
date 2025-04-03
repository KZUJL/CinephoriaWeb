// Définition des types pour les films
export interface Film {
    movieId: number;
    title: string;
    poster: string; // L'URL de l'affiche
  }
  
  export interface MoviesResponse {
    nouveautes: Film[];
  }
  