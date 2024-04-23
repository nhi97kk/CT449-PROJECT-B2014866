<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">Danh sách tài khoản</h2>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <router-link :to="{ name: 'user-add' }" class="btn btn-success"
          >Thêm tài khoản mới</router-link
        >
      </div>
    </div>
    <user-filter @filter-user="refreshUsers"></user-filter>
    <ul class="list-group list-group-numbered">
      <div v-for="user in users" :key="user._id">
        <user-item :user="user" @delete-user="deleteUser"></user-item>
      </div>
    </ul>
    <div v-if="users.length === 0" class="text-center mt-5">
      <h3>Không có người dùng nào</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import userService from '@/services/user.service.js';
import UserItem from '@/components/user/UserItem.vue';
import UserFilter from '@/components/user/UserFilter.vue';

const route = useRoute();
const users = ref([]);

async function refreshUsers() {
  const response = await userService.getAllUsers(route.query);

  if (response.status === 'success') {
    users.value = response.data.users;
  } else {
    users.value = [];
  }
}

onBeforeMount(async () => {
  await refreshUsers();
});

async function deleteUser() {
  await refreshUsers();
}
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>

