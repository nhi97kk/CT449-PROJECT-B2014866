<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">Danh sách mượn</h2>
    </div>
    <order-filter @filter-order="refreshOrders"></order-filter>
    <ul class="list-group list-group-numbered">
      <div v-for="order in orders" :key="order._id">
        <order-item :order="order"></order-item>
      </div>
    </ul>
    <div v-if="orders.length === 0" class="text-center mt-5">
      <h3>Không có mượn nào</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import orderService from '@/services/order.service.js';
import orderItem from '@/components/order/OrderItem.vue';
import OrderFilter from '@/components/order/OrderFilter.vue';

const route = useRoute();
const orders = ref([]);

async function refreshOrders() {
  const response = await orderService.getAllOrders({
    ...route.query,
    sort: '+updatedAt',
  });

  if (response.status === 'success') {
    orders.value = response.data.orders;
  } else {
    orders.value = [];
  }
}

onBeforeMount(async () => {
  await refreshOrders();
});
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>

