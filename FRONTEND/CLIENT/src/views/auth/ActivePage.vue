<template>
  <div class="container p-5">
    <h2 class="text-white">
      Kích hoạt tài khoản
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </h2>
    <p class="text-light pt-3">Thông tin đang được kiểm tra, vui lòng chờ!</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import userService from '@/services/user.service.js';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const token = route.params.activeToken;
  const response = await userService.activeAccount(token);

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công!',
      text: response.message,
      icon: 'success',
    });
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: response.message,
    });
  }
  router.push({
    name: 'login-page',
  });
});
</script>

