<template>
  <div class="container p-5">
    <span class="title">Oops!</span>
    <h3>404 - Không tìm thấy trang!</h3>
    <router-link :to="'/'">Quay lại trang chủ</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
h2 {
  font-size: 30px;
}
.title {
  font-size: 100px;
  font-weight: bold;
  color: #333;
}
</style>

