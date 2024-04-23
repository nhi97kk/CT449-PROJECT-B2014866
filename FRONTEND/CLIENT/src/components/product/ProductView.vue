<template>
  <div class="container-md">
    <div class="container">
      <router-link :to="{ name: 'product-list' }" class="router-link">
        Sách
      </router-link>
      &gt;
      <span class="fw-light">{{ product.name }}</span>
    </div>
    <div class="row py-3">
      <div class="mb-3 col-12 col-lg-4">
        <image-list :imagesId="product.images"></image-list>
      </div>
      <div class="col-12 col-lg-8">
        <h4 class="product-name">{{ product.name }}</h4>
        <rating-star :lg="true"></rating-star>
        <div class="product-categories">
          <!-- Nhà xuất bản: {{ product.manxb.tennxb }} -->
        </div>
        <div class="mt-3">
          <span class="product-price">{{ priceString }}đ</span>
        </div>
        <div class="mt-5 d-flex justify-content-start align-items-stretch">
          <span class="my-auto me-2">Số lượng</span>
          <button class="quantity-btn" @click="changeQuantity(-1)">
            <i class="fa-solid fa-minus"></i>
          </button>
          <input class="quantity-input" disabled v-model="quantity" />
          <button class="quantity-btn" @click="changeQuantity(+1)">
            <i class="fa-solid fa-plus"></i>
          </button>
          <span class="ms-3 my-auto product-quantity"
            >{{ product.stockQuantity }} có sẵn</span
          >
        </div>
        <div class="mt-4">
          <button class="addcart-btn" @click="addCart">
            <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ sách
          </button>
          <button class="ms-2 order-btn" @click="createOrder">Mượn ngay</button>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <h5 class="fw-bold">Mô tả</h5>
      <p class="product-description">Nguồn gốc: {{ product.nguongoc }}</p>
      <p class="product-description">Năm xuất bản: {{ product.namxuatban }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import ImageList from '@/components/product/ImageList.vue';
import RatingStar from '@/components/product/RatingStar.vue';
import { useOrderStore } from '@/stores/order.js';
import productService from '@/services/product.service.js';
import cartService from '@/services/cart.service.js';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const product = ref({});
const quantity = ref(1);

const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(product.value.price);
});

function changeQuantity(num) {
  if (quantity.value === 0) return;
  if (quantity.value + num > product.value.stockQuantity) {
    quantity.value = product.value.stockQuantity;
  } else if (quantity.value + num < 1) {
    quantity.value = 1;
  } else quantity.value += num;
}

async function addCart() {
  const data = {
    productId: product.value._id,
    quantity: quantity.value,
  };

  if (quantity.value === 0) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    Toast.fire({
      icon: 'error',
      title: 'Số lượng không hợp lệ!',
    });
    return;
  }

  const response = await cartService.addToCart(data);

  if (response.status === 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    Toast.fire({
      icon: 'success',
      title: response.message || 'Thêm vào giỏ hàng thành công!',
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    Toast.fire({
      icon: 'error',
      title: response.message || 'Thêm sản phẩm thất bại! Vui lòng thử lại!',
    });
  }
}

async function createOrder() {
  const data = [
    {
      product: product.value,
      quantity: quantity.value,
    },
  ];

  if (quantity.value === 0) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    });
    Toast.fire({
      icon: 'error',
      title: 'Sản phẩm đã hết hàng!',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Xác nhận đặt hàng?',
    text: 'Bạn có chắc chắn muốn đặt hàng?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đặt hàng',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  const isCreated = await orderStore.createOrder(data);

  if (!isCreated) {
    router.push({ name: 'login-page' });
  } else {
    router.push({ name: 'checkout-page' });
  }
}

onBeforeMount(async () => {
  const response = await productService.getProduct(route.params.id);

  if (response.status !== 'success') {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: response.message || 'Không tìm thấy sản phẩm!',
    });
    router.push({ name: 'home-page' });

    return;
  }

  product.value = response.data.product;
  quantity.value = Math.min(1, product.value.stockQuantity);
});
</script>

<style scoped>
.product-name {
  font-size: 1.5em;
  font-weight: 600;
}

.product-categories {
  font-size: 0.9em;
}

.product-price {
  font-size: 1.8em;
  font-weight: 600;
  color: var(--color-secondary);
}

.product-description {
  white-space: pre-wrap;
  text-align: justify;
  line-height: 1.6em;
}

.quantity-btn {
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 0;
  transition: all 0.3s;
}

.quantity-btn:hover {
  opacity: 0.6;
}

.quantity-input {
  font-size: 1.2em;
  width: 60px;
  text-align: center;
  border: 1px solid #ccc;
}

.product-quantity {
  font-size: 0.9em;
  color: #6f6f6f;
}

.addcart-btn,
.order-btn {
  border-radius: 0;
  background-color: #fff;
  padding: 5px 10px;
}

.addcart-btn {
  border: 1px solid var(--color-secondary);
  background-color: rgba(255, 218, 155, 0.141);
  color: var(--color-secondary);
  transition: all 0.3s;
}

.addcart-btn:hover {
  background-color: #fff;
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

