<template>
  <the-header></the-header>
  <main>
    <nav-bar v-show="store.isAuth"></nav-bar>
    <router-view class="main-section"></router-view>
  </main>
  <the-footer></the-footer>
  <scroll-to-top></scroll-to-top>
</template>

<script setup>
import TheHeader from '@/components/partials/TheHeader.vue';
import TheFooter from '@/components/partials/TheFooter.vue';
import NavBar from '@/components/partials/NavBar.vue';
import ScrollToTop from '@/components/partials/ScrollToTop.vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped>
.main-section {
  min-height: calc(100vh - 222px);
  background-color: #f8f9fa;
}
</style>

