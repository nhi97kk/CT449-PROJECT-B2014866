<template>
  <div
    class="col-8 fixed-bottom cart-bar d-flex justify-content-between align-items-center"
    v-if="totalQuantity !== 0"
  >
    <div>
      Tổng số sách mượn {{ '(' + totalQuantity + ' sản phẩm)' }}
      <!-- <span class="fw-bold">{{ totalPriceString }}đ</span> -->
    </div>
    <button class="ms-2 order-btn" @click="createOrder">
      <i class="fas fa-shopping-cart"></i> Gửi yêu cầu mượn
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order.js';
import Swal from 'sweetalert2';

const props = defineProps(['order']);
const router = useRouter();
const orderStore = useOrderStore();

// const totalPriceString = computed(() => {
//   return new Intl.NumberFormat('vi', {}).format(
//     props.order.reduce((total, item) => {
//       return total + item.product.price * item.quantity;
//     }, 0),
//   );
// });

const totalQuantity = computed(() => {
  return props.order.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
});

async function createOrder() {
  const data = props.order.map((item) => {
    return {
      product: item.product,
      quantity: item.quantity,
      cartId: item._id,
    };
  });

  const result = await Swal.fire({
    title: 'Xác nhận yêu cầu mượn sách?',
    text: 'Bạn có chắc chắn muốn yêu cầu mượn sách?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yêu cầu mượn sách',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  const res = await orderStore.createOrder(data);
  if (res) router.push({ name: 'checkout-page' });
}
</script>

<style scoped>
.cart-bar {
  background-color: var(--color-primary-opacity);
  color: #fff;
  border-top: 1px solid #dee2e6;
  margin: 0 10% 20px 24%;
  padding: 10px;
  font-weight: 500;
  text-align: left;
}

.order-btn {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
  color: #fff;
  transition: all 0.3s;
}

.order-btn:hover {
  opacity: 0.7;
}
</style>

