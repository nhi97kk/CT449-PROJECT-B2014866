<template>
  <div class="d-flex jusitfy-content-center align-items-center">
    <input
      type="search"
      class="form-control"
      placeholder="Tìm theo email"
      v-model="email"
    />
    <select v-model="role" class="form-select form-select-md ms-1">
      <option value="" selected>Tất cả vai trò</option>
      <option value="admin">Quản trị viên</option>
      <option value="staff">Nhân viên</option>
      <option value="customer">Khách hàng</option>
    </select>
    <select
      v-model="active"
      class="form-select form-select-md ms-1"
      aria-label=".form-select-md"
    >
      <option value="" selected>Tất cả trạng thái</option>
      <option value="active">Hoạt động</option>
      <option value="inactive">Không hoạt động</option>
    </select>
    <button class="btn btn-md btn-outline-dark ms-3" @click="onSubmit">
      Lọc
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['filter-user']);
const router = useRouter();
const email = ref('');
const role = ref('');
const active = ref('');

async function onSubmit() {
  await router.push({
    name: 'user-list',
    query: {
      email: email.value ? email.value : undefined,
      role: role.value ? role.value : undefined,
      active: active.value ? active.value === 'active' : undefined,
    },
  });
  emits('filter-user');
}
</script>

