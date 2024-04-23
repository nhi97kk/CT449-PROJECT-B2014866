import PublisherPage from '@/views/PublisherPage.vue';
import PublisherEdit from '@/components/publisher/PublisherEdit.vue';
import PublisherAdd from '@/components/publisher/PublisherAdd.vue';
import PublisherList from '@/components/publisher/PublisherList.vue';

export default {
  path: '/publishers',
  name: 'publisher-page',
  component: PublisherPage,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      name: 'publisher-list',
      component: PublisherList,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'edit/:publisherId',
      name: 'publisher-edit',
      component: PublisherEdit,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'add',
      name: 'publisher-add',
      component: PublisherAdd,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};
