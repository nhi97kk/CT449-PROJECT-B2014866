<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">Tất cả sách</h2>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <router-link :to="{ name: 'product-add' }" class="btn btn-success"
          >Thêm sách mới</router-link
        >
      </div>
    </div>
    <product-search @search-product="refreshProducts"></product-search>
    <ul class="list-group list-group-numbered">
      <div v-for="product in products" :key="product._id">
        <product-item
          :product="product"
          @delete-product="deleteProduct"
        ></product-item>
      </div>
    </ul>
    <div v-if="products.length === 0" class="text-center mt-5">
      <h3>Không có sản phẩm nào</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import productService from '@/services/product.service.js';
import ProductItem from '@/components/product/ProductItem.vue';
import ProductSearch from '@/components/product/ProductSearch.vue';

const route = useRoute();
const products = ref([]);

async function refreshProducts() {
  const response =
    route.query.name !== undefined
      ? await productService.searchProducts(route.query.name)
      : await productService.getAllProducts();

  if (response.status === 'success') {
    products.value = response.data.products;
  } else {
    products.value = [];
  }
}

onBeforeMount(async () => {
  await refreshProducts();
});

async function deleteProduct() {
  await refreshProducts();
}
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>

