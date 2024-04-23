<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">{{ title || 'Danh sách sản phẩm' }}</h2>
    </div>
    <div class="row mt-2">
      <product-item
        v-for="product in products"
        :key="product._id"
        :product="product"
      ></product-item>
    </div>
    <div class="d-flex flex-column justify-content-center align-items-center">
      <div
        v-if="products.length === 0"
        class="mt-5 d-flex justify-content-center align-items-center"
      >
        <img
          src="@/assets/img/book-not-found.png"
          alt="Không tìm thấy"
          style="width: 200px"
        />
        <h4>Không có sản phẩm nào ở đây!</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import productService from '@/services/product.service.js';
import ProductItem from '@/components/product/ProductItem.vue';

const route = useRoute();
const products = ref([]);
const props = defineProps(['query', 'title']);

async function refreshProducts() {
  if (props.query !== undefined) {
    const query = {
      ...props.query,
    };
    const response = await productService.getAllProducts(query);
    if (response.status === 'success') {
      products.value = response.data.products;
    } else {
      products.value = [];
    }
    return;
  }
  // default
  const response =
    route.query.name !== undefined
      ? await productService.searchProducts(route.query.name)
      : await productService.getAllProducts(route.query);

  if (response.status === 'success') {
    products.value = response.data.products;
  } else {
    products.value = [];
  }
}

onBeforeMount(async () => {
  await refreshProducts();
});
</script>

<style scoped>
.product-list {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>

