<template>
  <div class="container-md user-page">
    <div class="row">
      <user-side-bar
        class="d-none d-md-block col-12 col-md-3 col-lg-2 sidebar"
      ></user-side-bar>
      <router-view class="col-12 col-md-9 col-lg-10"></router-view>
    </div>
  </div>
</template>

<script setup>
import UserSideBar from '@/components/user/UserSidebar.vue';
</script>

<style scoped>
.user-page {
  padding: 40px;
}
.sidebar {
  border-right: 1px solid #dee2e6;
}
</style>

