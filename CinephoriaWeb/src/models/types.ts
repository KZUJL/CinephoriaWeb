// Définition des types 
export interface Film {
    movieId: number;
    title: string;
    poster: string; 
  }

export interface Cinema {
    cinemaId: number;
    name: string;
    address: string;
    country: string;
    city: string;
    phoneNumber: string;
    schedules: Schedule[];
}

export interface Schedule {
    scheduleId: number;
    cinemaId: number;
    jour: string;
    heure_ouverture: string;
    heure_fermeture: string;
}
  
 