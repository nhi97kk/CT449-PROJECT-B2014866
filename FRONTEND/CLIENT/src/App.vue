<template>
  <div :class="activeClass">
    <the-header></the-header>
    <main>
      <router-view class="main-section"></router-view>
    </main>
    <the-footer></the-footer>
    <scroll-to-top></scroll-to-top>
  </div>
</template>

<script setup>
import TheHeader from '@/components/partials/TheHeader.vue';
import TheFooter from '@/components/partials/TheFooter.vue';
import ScrollToTop from '@/components/partials/ScrollToTop.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const activeClass = computed(() => {
  const isAuthPage = [
    'login-page',
    'register-page',
    'forgot-password',
    'reset-password',
    'active-page',
  ].includes(route.name);
  return {
    'main-page': true,
    'auth-page': isAuthPage,
    'others-page': !isAuthPage,
  };
});
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background-color: #e0e0e0;
}

.main-section {
  min-height: calc(100vh - 205px);
}

.auth-page {
  min-height: 100vh;
  /* background-color: var(--color-tertiary) !important; */
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.641),
      rgba(0, 0, 0, 0.3)
    ),
    url('@/assets/img/banner.jpg');
  background-size: cover;
  background-repeat: repeat-x;
  background-position: center;
  background-attachment: fixed;
}

.others-page {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>

