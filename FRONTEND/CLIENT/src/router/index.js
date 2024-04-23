import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

// Components
import LoginPage from '@/views/auth/LoginPage.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import RegisterPage from '@/views/auth/RegisterPage.vue';
import LogoutPage from '@/views/auth/LogoutPage.vue';
import ActivePage from '@/views/auth/ActivePage.vue';
import HomePage from '@/views/HomePage.vue';
import CheckoutPage from '@/views/CheckoutPage.vue';
import NotFound from '@/views/NotFound.vue';

// Routes
import productRoutes from '@/router/product.route.js';
import userRoutes from './user.route';

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
    path: '/register',
    name: 'register-page',
    component: RegisterPage,
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/active-account/:activeToken',
    name: 'active-page',
    component: ActivePage,
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
  },
  {
    path: '/logout',
    name: 'logout-page',
    component: LogoutPage,
  },
  {
    path: '/checkout',
    name: 'checkout-page',
    component: CheckoutPage,
    meta: {
      requiresAuth: true,
    },
  },
  productRoutes,
  userRoutes,
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

