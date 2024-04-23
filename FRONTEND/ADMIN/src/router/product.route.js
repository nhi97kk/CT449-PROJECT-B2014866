import ProductPage from '@/views/ProductPage.vue';
import ProductEdit from '@/components/product/ProductEdit.vue';
import ProductAdd from '@/components/product/ProductAdd.vue';
import ProductList from '@/components/product/ProductList.vue';

export default {
  path: '/products',
  name: 'product-page',
  component: ProductPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'product-list',
      component: ProductList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'edit/:productId',
      name: 'product-edit',
      component: ProductEdit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'add',
      name: 'product-add',
      component: ProductAdd,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

