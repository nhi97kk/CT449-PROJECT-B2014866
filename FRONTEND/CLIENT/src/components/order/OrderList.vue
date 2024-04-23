<template>
  <div>
    <div class="container-md page">
      <h2>Danh sách yêu cầu mượn sách</h2>

      <order-filter @filter-order="filterOrder"></order-filter>
      <div>
        <div v-for="order in orders" :key="order._id">
          <order-item :order="order" @show-info="showInfo"></order-item>
        </div>
      </div>
      <div style="display: none">
        <div ref="orderView">
          <order-view :order="selectedOrder"></order-view>
        </div>
      </div>
    </div>
    <div
      v-if="orders.length === 0"
      class="d-flex flex-column justify-content-center align-items-center"
    >
      <div class="mt-5 d-flex justify-content-center align-items-center">
        <img
          src="@/assets/img/order-empty.png"
          alt="Chưa có yêu cầu mượn sách nào"
          style="width: 200px"
        />
        <h4>Chưa có yêu cầu mượn sách nào ở đây!</h4>
      </div>
      <p>
        Tìm kiếm và mở rộng tri thức của bản thân ngay nào!
        <router-link :to="{ name: 'product-page' }" class="router-link"
          >Đến trang sản phẩm</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import orderService from '@/services/order.service.js';
import OrderItem from '@/components/order/OrderItem.vue';
import OrderFilter from '@/components/order/OrderFilter.vue';
import OrderView from '@/components/order/OrderView.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const orders = ref([]);
const selectedOrder = ref({});
const orderView = ref(null);

async function filterOrder() {
  await refreshOrders();
}

async function refreshOrders() {
  const response = await orderService.getAllOrders({
    ...route.query,
    sort: '-updatedAt',
  });

  if (response.status === 'success') {
    orders.value = response.data.orders;
  } else {
    orders.value = [];
  }
}

async function showInfo(order) {
  await (selectedOrder.value = order);
  // showInfo.value = !showInfo.value;
  Swal.fire({
    width: '80%',
    html: orderView.value.innerHTML,
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonText: 'Đóng',
    confirmButtonColor: 'var(--color-secondary)',
  });
}

onBeforeMount(async () => {
  await refreshOrders();
});
</script>

<style scoped></style>

