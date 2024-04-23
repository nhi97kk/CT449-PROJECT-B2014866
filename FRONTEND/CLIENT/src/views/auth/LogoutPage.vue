<template>
  <h1 class="d-flex justify-content-center align-items-center">Đăng xuất</h1>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { onMounted } from 'vue';

const store = useUserStore();
const router = useRouter();

onMounted(async () => {
  await store.logout();
  router.push({ name: 'home-page' });
});
</script>

