<template>
  <li
    class="user list-group-item d-flex justify-content-between align-items-strech mt-3"
  >
    <div class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column">
      <div class="fw-bold">
        <span :class="isActiveSpanClass">
          <i :class="isActiveIconClass"></i>
          {{ user.active ? 'Hoạt động' : 'Không hoạt động' }}
        </span>
        <span class="fw-bold">Vai trò:</span> {{ userRole }}
      </div>
      <div class="email">
        <span class="fw-bold">Email:</span>
        {{ user.email }}
      </div>
      <div class="fullname">
        <span class="fw-bold">Họ và tên:</span>
        {{ user.holot ? user.holot : '-' }}
        {{ user.ten ? user.ten : '-' }}
      </div>
      <div class="telephone">
        <span class="fw-bold">Số điện thoại:</span>
        {{ user.dienthoai ? user.dienthoai : '-' }}
      </div>
      <div class="address">
        <span class="fw-bold">Địa chỉ:</span>
        {{ user.diachi ? user.diachi : '-' }}
      </div>
    </div>
    <div
      class="d-flex justify-content-center align-items-center"
      v-if="user.email !== store.email"
    >
      <router-link
        :to="{ name: 'user-edit', params: { userId: user._id } }"
        class="badge bg-warning rounded-pill user-edit"
        @click="onEdit"
      >
        Hiệu chỉnh <i class="fa-solid fa-pen-to-square"></i>
      </router-link>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const props = defineProps(['user']);
const store = useUserStore();

const emit = defineEmits(['deleteUser']);

const isActiveIconClass = computed(() => {
  return props.user.active ? 'fa-solid fa-check' : 'fa-solid fa-xmark';
});

const isActiveSpanClass = computed(() => {
  return {
    'badge rounded-pill': true,
    'bg-success': props.user.active,
    'bg-danger': !props.user.active,
  };
});

const userRole = computed(() => {
  if (props.user.role === 'admin') {
    return 'Quản trị viên';
  } else if (props.user.role === 'staff') {
    return 'Nhân viên';
  } else {
    return 'Khách hàng';
  }
});

function onEdit() {}
</script>

<style scoped>
.user:hover {
  transition: all 0.3s;
  background-color: #ccc;
}

.user-edit {
  /* font-size: 13px; */
  color: rgb(52, 52, 52);
  transition: all 0.3s;
}

.user-edit:hover {
  cursor: pointer;
  opacity: 0.6;
}

.categories {
  font-size: 12px;
}

.price {
  font-size: 14px;
}
</style>

