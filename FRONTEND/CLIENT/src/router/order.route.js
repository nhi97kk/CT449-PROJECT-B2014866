import OrderPage from '@/views/OrderPage.vue';
import OrderView from '@/components/order/OrderView.vue';
import OrderList from '@/components/order/OrderList.vue';

export default {
  path: 'orders',
  name: 'order-page',
  component: OrderPage,
  redirect: { name: 'order-list' },
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'order-list',
      component: OrderList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: ':orderId',
      name: 'order-view',
      component: OrderView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

