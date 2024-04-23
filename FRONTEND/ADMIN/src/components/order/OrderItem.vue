<template>
  <li
    class="order-item list-group-item d-flex justify-content-between align-items-strech mt-3"
  >
    <div class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column">
      <div class="_id">
        <span class="fw-bold">Mã mượn:</span> {{ props.order._id }}
      </div>
      <div class="_id-cusomter">
        <span class="fw-bold">Email:</span> {{ props.order.user.email }}
        <span :class="isActiveSpanClass" style="font-size: 0.5em">
          <i :class="isActiveIconClass" style="font-size: 0.9em"></i>
          {{ props.order.user.active ? 'Hoạt động' : 'Không hoạt động' }}
        </span>
      </div>
      <div class="total-price">
        <span class="fw-bold">Giá trị:</span> {{ totalPriceString }}đ
      </div>
      <div class="current-status">
        <span class="fw-bold">Trạng thái:</span>
        <span :class="currentStatusSpanClass">
          {{ currentStatus }}
          <i :class="currentStatusIconClass"></i>
        </span>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <router-link
        :to="{ name: 'order-view', params: { orderId: order._id } }"
        class="badge bg-success rounded-pill order-view"
        @click="onView"
      >
        Kiểm tra <i class="fa-solid fa-check-circle"></i>
      </router-link>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['order']);

const isActiveIconClass = computed(() => {
  return props.order.user.active ? 'fa-solid fa-check' : 'fa-solid fa-xmark';
});

const isActiveSpanClass = computed(() => {
  return {
    'badge rounded-0 border': true,
    'text-success': props.order.user.active,
    'text-danger': !props.order.user.active,
  };
});

const currentStatus = computed(() => {
  if (props.order.currentStatus === 'pending') return 'Đang chờ duyệt';
  if (props.order.currentStatus === 'accepted') return 'Chờ nhận sách';
  if (props.order.currentStatus === 'shipping') return 'Đang mượn';
  if (props.order.currentStatus === 'delivered') return 'Đã trả';
  if (props.order.currentStatus === 'cancelled') return 'Đã hủy';
});

const currentStatusIconClass = computed(() => {
  return {
    fas: true,
    'fa-solid fa-clock': props.order.currentStatus === 'pending',
    'fa-solid fa-check': props.order.currentStatus === 'accepted',
    'fa-solid fa-truck': props.order.currentStatus === 'shipping',
    'fa-solid fa-check-double': props.order.currentStatus === 'delivered',
    'fa-solid fa-xmark': props.order.currentStatus === 'cancelled',
  };
});

const currentStatusSpanClass = computed(() => {
  return {
    'badge rounded-pill': true,
    'text-warning': props.order.currentStatus === 'pending',
    'text-primary': props.order.currentStatus === 'accepted',
    'text-info': props.order.currentStatus === 'shipping',
    'text-success': props.order.currentStatus === 'delivered',
    'text-danger': props.order.currentStatus === 'cancelled',
  };
});

const totalPriceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(props.order.totalPrice);
});

function onView() {}
</script>

<style scoped>
.order-item:hover {
  transition: all 0.3s;
  background-color: #ccc;
}

.order-view {
  /* font-size: 13px; */
  transition: all 0.3s;
}

.order-view:hover {
  cursor: pointer;
  opacity: 0.6;
}
</style>

