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
    },
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
    },
    {
      path: '/createaccount',
      name: 'createAccount',
      component: () => import('../views/CreateAccountView.vue')
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/employee',
      name: 'EmployePage',
      component: () => import('../views/EmployeeView.vue'),
      meta: { requiresEmployee: true }
    }
    ,
    {
      path: '/change-password',
      name: 'ChangePassword',
      component: () => import('../views/ChangePassword.vue')      
    }
    ,
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue')      
    }
  ]
})

router.beforeEach((to, _from, next) => {
  // Store previous route except for login
  if (to.path !== '/login') {
    localStorage.setItem('previousRoute', to.fullPath);
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Admin route guard
  if (to.meta.requiresAdmin) {
    if (user && (user.role?.roleName === 'admin' || user.role?.roleId === 1)) {
      return next();
    } else {
      return next('/login');
    }
  }

  // Employee route guard
  if (to.meta.requiresEmployee) {
    if (user && (user.role?.roleName === 'employee' || user.role?.roleId === 2)) {
      return next();
    } else {
      return next('/login');
    }
  }

  // No special guard, continue
  return next();
});



export default router
