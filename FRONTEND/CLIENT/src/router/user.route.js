import UserPage from '@/views/UserPage.vue';
import UserProfile from '@/components/user/UserProfile.vue';
import ChangePassword from '@/components/user/ChangePassword.vue';
import orderRoutes from '@/router/order.route.js';
import cartRoutes from '@/router/cart.route.js';

export default {
  path: '/user',
  name: 'user-page',
  component: UserPage,
  redirect: { name: 'user-profile' },
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'profile',
      name: 'user-profile',
      component: UserProfile,
    },
    {
      path: 'change-password',
      name: 'change-password',
      component: ChangePassword,
    },
    orderRoutes,
    cartRoutes,
  ],
};

