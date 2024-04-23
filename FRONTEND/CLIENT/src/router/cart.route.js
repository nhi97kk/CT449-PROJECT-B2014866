import CartPage from '@/views/CartPage.vue';
import CartList from '@/components/cart/CartList.vue';

export default {
  path: 'cart',
  name: 'cart-page',
  component: CartPage,
  redirect: { name: 'cart-list' },
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'cart-list',
      component: CartList,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

