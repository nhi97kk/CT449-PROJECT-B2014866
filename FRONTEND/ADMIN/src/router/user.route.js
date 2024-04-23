import UserPage from '@/views/UserPage.vue';
import UserEdit from '@/components/user/UserEdit.vue';
import UserAdd from '@/components/user/UserAdd.vue';
import UserList from '@/components/user/UserList.vue';
import { useUserStore } from '@/stores/user.js';

export default {
  path: '/users',
  name: 'user-page',
  component: UserPage,
  beforeEnter: (to, from, next) => {
    const store = useUserStore();
    if (store.role !== 'admin') {
      next('/home');
    } else {
      next();
    }
  },
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'user-list',
      component: UserList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'edit/:userId',
      name: 'user-edit',
      component: UserEdit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'add',
      name: 'user-add',
      component: UserAdd,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

