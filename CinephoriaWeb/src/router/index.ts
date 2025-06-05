import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/movie',
      name: 'movie',
      component: () => import('../views/MovieView.vue')
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: () => import('../views/ReservationView.vue')
    },
    {
      path: '/movie/:movieId',
      name: 'movieDetail',
      component: () => import('../views/MovieDetailView.vue')
    }
    
    ,
    {
      path: '/reservation/:movieId/:cinemaId',
      name: 'movieReservation',
      component: () => import('../views/ShowtimesView.vue')
    },
    {
      path: '/reservation/:movieId/:cinemaId/:movieTimesId',
      name: 'seatsReservation',
      component: () => import('../views/SeatView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
     {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashBoardView.vue')
    }
    
  ]
  
})
router.beforeEach((to, _from, next) => {
    if (to.path !== '/login') {
        localStorage.setItem('previousRoute', to.fullPath);
    }
    next();
});

export default router
