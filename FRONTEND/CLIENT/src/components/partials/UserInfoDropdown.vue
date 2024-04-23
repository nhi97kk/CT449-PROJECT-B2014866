<template>
  <div class="dropdown">
    <button
      class="btn dropdown-btn dropdown-toggle"
      type="button"
      id="userInfoDropdownMenu"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ userInfo }} <i :class="userStatusClass"></i>
    </button>
    <ul class="dropdown-menu" arsia-labelledby="userInfoDropdownMenu">
      <li v-for="(item, index) in dropdownMenu" :key="index">
        <router-link :to="item.link" class="dropdown-item">
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUpdate, ref } from 'vue';
import { useUserStore } from '@/stores/user.js';

const store = useUserStore();
const dropdownMenu = ref(null);

const userStatusClass = computed(() => ({
  'fa-regular': true,
  'fa-user': !store.isAuth,
  'fa-circle-user': store.isAuth,
}));

const userInfo = computed(() => {
  if (store.isAuth) {
    const name = store.email.split('@')[0];
    if (name.length > 10) {
      return name.slice(0, 10) + '...';
    }
    return name;
  }
  return 'Tài khoản';
});

async function updateMenu() {
  if (!store.isAuth) {
    dropdownMenu.value = [
      {
        title: 'Đăng nhập',
        link: { name: 'login-page' },
      },
      {
        title: 'Đăng ký',
        link: { name: 'register-page' },
      },
    ];
  } else {
    dropdownMenu.value = [
      {
        title: 'Thông tin',
        link: { name: 'user-page' },
      },
      {
        title: 'Đổi mật khẩu',
        link: { name: 'change-password' },
      },
      {
        title: 'Đơn hàng',
        link: { name: 'order-page' },
      },
      {
        title: 'Đăng xuất',
        link: { name: 'logout-page' },
      },
    ];
  }
}

onBeforeMount(async () => {
  await updateMenu();
});

onBeforeUpdate(async () => {
  await updateMenu();
});
</script>

<style scoped>
.dropdown-menu {
  border: none;
  border-radius: 4px;
  padding: 0;
}
.dropdown-btn {
  background-color: transparent;
  border: none;
  color: var(--color-white);
  font-weight: 600;
  transition: all 0.3s;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.3s;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: var(--color-primary-opacity);
  color: var(--color-white);
}
</style>

