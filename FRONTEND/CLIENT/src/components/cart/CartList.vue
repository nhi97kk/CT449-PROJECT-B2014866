<template>
  <div class="container-md page">
    <h2>Giỏ sách</h2>

    <div>
      <div v-for="cartItem in cart" :key="cartItem._id">
        <cart-item
          :item="cartItem"
          @remove-item="removeItem"
          @update-item="updateItem"
          @add-to-order="addToOrder"
          @remove-from-order="removeFromOrder"
        ></cart-item>
      </div>
    </div>

    <div
      v-if="cart.length === 0"
      class="d-flex flex-column justify-content-center align-items-center"
    >
      <div class="mt-5 d-flex justify-content-center align-items-center">
        <img
          src="@/assets/img/cart-empty.png"
          alt="Giỏ sách trống"
          style="width: 200px"
        />
      </div>
      <p>
        Chưa có sách nào ở đây!
        <router-link :to="{ name: 'product-page' }" class="router-link"
          >Đến trang tất cả sách</router-link
        >
      </p>
    </div>
    <cart-bar :order="order"></cart-bar>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import cartService from '@/services/cart.service.js';
import CartItem from '@/components/cart/CartItem.vue';
import CartBar from '@/components/cart/CartBar.vue';
import Swal from 'sweetalert2';

const cart = ref([]);
const order = ref([]);

async function refreshCart() {
  const response = await cartService.getCart();

  if (response.status === 'success') {
    cart.value = response.data;
  } else {
    cart.value = [];
  }
}

async function removeItem(itemId) {
  const response = await cartService.removeFromCart(itemId);
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  });

  if (response.status === 'fail') {
    Toast.fire({
      icon: 'error',
      title: response.message || 'Xóa sản phẩm khỏi giỏ sách thất bại!',
    });
  } else {
    Toast.fire({
      icon: 'success',
      title: response.message || 'Xóa sản phẩm khỏi giỏ sách thành công!',
    });
    removeFromOrder({ _id: itemId });
    await refreshCart();
  }
}

async function updateItem(itemId, quantity) {
  const response = await cartService.updateCart(itemId, { quantity });
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  });

  if (response.status === 'fail') {
    Toast.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: response.message || 'Cập nhật số lượng thất bại!',
    });
  } else {
    Toast.fire({
      icon: 'success',
      title: 'Thành công!',
      text: response.message || 'Cập nhật số lượng thành công!',
    });
    await refreshCart();
  }
}

function addToOrder(item) {
  order.value.push(item);
}

function removeFromOrder(item) {
  order.value = order.value.filter((it) => it._id !== item._id);
}

onBeforeMount(async () => {
  await refreshCart();
});
</script>

<style scoped></style>

