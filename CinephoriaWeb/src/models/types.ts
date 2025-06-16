// Définition des types 
export interface Film {
    movieId?: number;
    title: string;
    poster: string; 
    description: string;
    genre :string;
    duration: string; 
    director: string;
    producer: string;
    cast: string;
    releaseDate: Date;
    availableDate: Date;
    trailer: string;
    minimumAge: string;
    isfavorite: boolean;
    averageReview?: number;     
    reviews?: Review[];
    sourcePoster: string;
    sourceTrailer: string;

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
export interface Seance {
    movieTimesId: number;
    movieId: number;
    cinemaId: number;
    day: string;
    startTime: string;
    endTime: string;
    price: number;
    roomId: number;
    room: {
      roomId: number;
      name: string;
      seatsNumber: number;
      quality: string;
    };
    movie: Film; 
  }
  export interface Seat {
    locationId: number;    
    type: string;
    name: number;
    rowLocation: number;
    columnLocation: number;
    room: {
      roomId: number;
      name: string;
      seatsNumber: number;
      quality: string;
    };   
    selected: boolean;
    reserved: boolean;
  }
  export interface Reservation {
    seatId: number;
    userId: number;
    cinemaId: number;
    cinemaName: string;
    movieId: number;
    reservationDate: string;
    reservationTime: string;
    movieTitle : string;
    roomName : string;
    seatName : string
  }
  export interface AverageReviews {  
    movieId: number;
    averageReview: number   
  }
  export interface Review {
  id: string;
  userId: number;
  userName: string;
  movieId: number;
  movieTitle: string;
  reviews: number;
  comments: string;
  reviewsDate: string;
}
export interface Room {
  roomId: number;
  cinemaId: number;
  name: string;
  quality : string;
  seatsNumber: number;
  cinema: {
    cinemaId: number;
    name: string;
    address: string;
    country: string;
    city: string;
    phoneNumber: string;
  }
  seats:{
    locationId: number;    
    roomId: number;
    name: string;
    type: string;
    rowLocation: number;
    columnLocation: number;
    room: string;
  }[];
}

 