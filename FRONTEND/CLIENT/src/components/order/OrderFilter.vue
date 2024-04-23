<template>
  <div class="d-flex justify-content-around align-items-center filter-bar">
    <div v-for="status in statusList" :key="status.value">
      <button
        class="btn btn-sm"
        :class="{
          active: status.value === route.query.currentStatus,
          'd-none d-lg-inline': status.value === undefined,
        }"
        @click="onFilter(status.value)"
      >
        {{ status.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const props = defineProps(['currentStatus']);
const emits = defineEmits(['filter-order']);
const router = useRouter();
const route = useRoute();

const statusList = [
  { value: undefined, label: 'Tất cả' },
  { value: 'pending', label: 'Đang chờ duyệt' },
  { value: 'accepted', label: 'Chờ nhận sách' },
  { value: 'shipping', label: 'Đang mượn' },
  { value: 'delivered', label: 'Đã trả' },
  { value: 'cancelled', label: 'Đã hủy' },
];

async function onFilter(status) {
  await router.push({
    name: 'order-list',
    query: { currentStatus: status },
  });
  emits('filter-order');
}
</script>

<style scoped>
.filter-bar {
  width: 100%;
  padding: 10px 0;
  background-color: #fff;
  box-shadow: 0 0 3px #ccc;
}

.btn {
  border: none;
  border-bottom: 2px solid #fff;
  border-radius: 0;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  color: var(--color-secondary);
}

.active {
  border: none;
  color: var(--color-secondary);
  border-bottom: 2px solid var(--color-secondary);
}
</style>

