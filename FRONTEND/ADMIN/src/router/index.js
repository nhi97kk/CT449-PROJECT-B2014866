import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

// Components
import LoginPage from '@/views/auth/LoginPage.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import HomePage from '@/views/HomePage.vue';
import ProfilePage from '@/views/ProfilePage.vue';

import NotFound from '@/views/NotFound.vue';

// Routes
import productRoutes from '@/router/product.route.js';
import orderRoutes from '@/router/order.route.js';
import userRoutes from '@/router/user.route.js';
import publisherRoutes from '@/router/publisher.route.js';

const routes = [
  {
    path: '/login',
    name: 'login-page',
    component: LoginPage,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/reset-password/:resetToken',
    name: 'reset-password',
    component: ResetPassword,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/home',
    alias: '/',
    name: 'home-page',
    component: HomePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile-page',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    },
  },
  productRoutes,
  orderRoutes,
  userRoutes,
  publisherRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

router.beforeEach(async (to, from) => {
  const store = useUserStore();
  const isLogin = localStorage.getItem('hiworld201-isLogin');

  if (to.meta.authRoute && isLogin) {
    await store.login();
    if (store.isAuth) {
      return '/home';
    }
  }

  if (to.meta.requiresAuth && !store.isAuth) {
    return '/login';
  }

  if (to.meta.authRoute && store.isAuth) {
    return false;
  }

  return true;
});

export default router;

