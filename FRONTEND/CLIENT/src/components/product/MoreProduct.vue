<template>
  <div class="container text-end p-2">
    <router-link
      class="router-link"
      :to="{ name: 'product-page', query: props.query }"
      >Xem thêm <i class="fa-solid fa-angles-right"></i
    ></router-link>
  </div>
</template>

<script setup>
const props = defineProps(['query']);
</script>

<style scoped></style>

