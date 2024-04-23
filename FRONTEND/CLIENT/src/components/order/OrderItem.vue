<template>
  <li
    class="order-item d-flex flex-column justify-content-between align-items-strech mt-4"
  >
    <div class="order-id d-lg-flex justify-content-between align-items-center">
      <div class="p-1">
        <i class="fa-solid fa-store" style="color: var(--color-secondary)"></i>
        {{ props.order._id }}
      </div>
      <div class="text-end">
        <span :class="currentStatusSpanClass">
          {{ currentStatus }}
          <i :class="currentStatusIconClass"></i>
        </span>
      </div>
    </div>
    <order-product
      v-for="item in order.orderItems"
      :item="item"
      :key="item.product._id"
    ></order-product>
    <div class="d-lg-flex justify-content-between align-items-center pt-3">
      <div>
        <button class="order-btn info-btn me-1 mb-1" @click="showInfo">
          <i class="fa-solid fa-receipt"></i> Xem chi tiết
        </button>
        <button
          class="order-btn cancel-btn"
          v-if="order.currentStatus === 'pending'"
          @click="onCancel"
        >
          <i class="fa-solid fa-ban text-danger"></i> Hủy yêu cầu mượn
        </button>
        <!-- <button
          class="order-btn receive-btn"
          v-if="order.currentStatus === 'shipping'"
          @click="onDelivered"
        >
          <i class="fa-regular fa-square-check text-success"></i> Xác nhận nhận
          sách
        </button> -->
      </div>
      <div class="p-1 ms-auto text-end">
        <span style="font-size: 0.8rem">Tổng giá trị: </span>
        <span class="total-price">{{ totalPriceString }}đ</span>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import OrderProduct from '@/components/order/OrderProduct.vue';
import orderService from '@/services/order.service.js';
import Swal from 'sweetalert2';

const router = useRouter();
const props = defineProps(['order']);
const emits = defineEmits(['show-info']);

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

async function onCancel() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc muốn hủy yêu cầu mượn? Sau khi hủy, yêu cầu mượn sẽ không thể khôi phục!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--color-secondary)',
    cancelButtonColor: 'var(--color-tertiary)',
    confirmButtonText: 'Hủy yêu cầu mượn',
    cancelButtonText: 'Không',
  });

  if (result.isConfirmed) {
    const response = await orderService.cancelOrder(props.order._id);

    if (response.status === 'success') {
      await Swal.fire({
        title: 'Thành công',
        icon: 'success',
        text: 'Đã hủy yêu cầu mượn!',
      });

      router.go(0);
    } else {
      Swal.fire({
        title: 'Thất bại',
        icon: 'error',
        text: 'Hủy yêu cầu mượn thất bại! Vui lòng thử lại!',
      });
    }
  }
}

async function onDelivered() {
  const res = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn xác nhận đã nhận sách?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--color-secondary)',
    cancelButtonColor: 'var(--color-tertiary)',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Không',
  });

  if (res.isConfirmed) {
    const response = await orderService.deliverOrder(props.order._id);

    if (response.status === 'success') {
      await Swal.fire({
        title: 'Thành công',
        icon: 'success',
        text: 'Đã xác nhận đã nhận sách!',
      });

      router.go(0);
    } else {
      Swal.fire({
        title: 'Thất bại',
        icon: 'error',
        text: 'Xác nhận đã nhận sách thất bại! Vui lòng thử lại!',
      });
    }
  }
}

function showInfo() {
  emits('show-info', props.order);
}

onBeforeMount(() => {});
</script>

<style scoped>
.order-item {
  border: 1px solid #e6e6e6;
  box-shadow: 2px 2px 8px #ccc;
  padding: 10px;
  transition: all 0.3s;
}

.order-item:hover {
  background-color: #f8f8f8;
}

.order-view {
  /* font-size: 13px; */
  transition: all 0.3s;
}

.order-view:hover {
  cursor: pointer;
  opacity: 0.6;
}

.order-id {
  border-bottom: 1px solid #ccc;
}

.total-price {
  color: var(--color-secondary);
  font-weight: bold;
}

.cancel-btn,
.receive-btn {
  border: 1px solid var(--color-secondary);
  background-color: rgba(255, 218, 155, 0.141);
  color: var(--color-secondary);
  transition: all 0.3s;
}

.info-btn {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
  color: #fff;
  transition: all 0.3s;
}
</style>

