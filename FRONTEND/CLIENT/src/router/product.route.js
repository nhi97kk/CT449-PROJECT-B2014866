import ProductPage from '@/views/ProductPage.vue';
import ProductList from '@/components/product/ProductList.vue';
import ProductView from '@/components/product/ProductView.vue';

export default {
  path: '/products',
  name: 'product-page',
  component: ProductPage,
  redirect: { name: 'product-list' },
  children: [
    {
      path: '',
      name: 'product-list',
      component: ProductList,
    },
    {
      path: ':id',
      name: 'product-view',
      component: ProductView,
    },
  ],
};

