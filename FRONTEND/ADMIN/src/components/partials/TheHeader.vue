<template>
  <header>
    <div class="px-3 py-2 bg-dark text-white">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <router-link
              to="/"
              href="/"
              class="d-flex py-2 text-white text-decoration-none"
            >
              <span id="brand">NBooks Admin</span>
            </router-link>
          </div>
          <div class="d-flex justify-content-end align-items-center col-6">
            <router-link
              :to="{ name: store.isAuth ? 'profile-page' : 'login-page' }"
              class="user-link text-white text-decoration-none"
            >
              {{ userInfo }} <i :class="userStatusClass"></i>
            </router-link>
            &nbsp; &nbsp;
            <a
              class="user-link text-white text-decoration-none"
              v-if="store.isAuth"
              @click="logout"
            >
              Đăng xuất <i class="fa-solid fa-right-from-bracket"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();

const userStatusClass = computed(() => ({
  'fa-regular': true,
  'fa-user': !store.isAuth,
  'fa-circle-user': store.isAuth,
}));

const userInfo = computed(() => {
  if (store.isAuth) {
    const name = store.email.split('@')[0];

    return name.length > 10 ? name.slice(0, 10) + '...' : name;
  }
  return 'Đăng nhập';
});

async function logout() {
  await store.logout();
  router.go(router.currentRoute);
}
</script>

<style scoped>
#brand {
  font-size: 26px;
  padding: 2px 0;
  font-weight: 600;
}

.user-link {
  font-weight: 600;
  transition: all 0.3s;
  font-size: 14px;
}

.user-link:hover {
  opacity: 0.8;
}

a:hover {
  cursor: pointer;
}
</style>

