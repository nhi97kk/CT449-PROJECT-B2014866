<template>
  <div class="bg-dark sticky-top">
    <div class="container">
      <router-link to="/" class="text-white"> Trang chủ </router-link>
      <router-link to="/products" class="text-white"> Sách </router-link>
      <router-link to="/publishers" class="text-white">
        Nhà xuất bản
      </router-link>
      <router-link to="/orders" class="text-white">
        Quản lý mượn sách</router-link
      >
      <router-link
        to="/users"
        class="text-white"
        v-show="store.role === 'admin'"
      >
        Tài khoản
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped>
a {
  text-decoration: none;
  display: inline-block;
  padding: 10px 15px;
  transition: all 0.3s;
}

a:hover {
  opacity: 0.8;
}

.router-link-active {
  background-color: #fff;
  color: #000 !important;
}

.router-link-active:hover {
  opacity: 1;
  cursor: default;
}
</style>

