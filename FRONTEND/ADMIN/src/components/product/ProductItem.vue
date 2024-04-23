<template>
  <li class="">
    <div
      class="product-item list-group-item d-flex justify-content-between align-items-strech mt-3"
    >
      <div class="d-flex justify-content-center align-items-center">
        <img class="item-image" :src="imageLink" alt="Ảnh sách" />
      </div>
      <div class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column">
        <div class="fw-bold">{{ nameString }}</div>
        <div class="categories">Nhà xuất bản: {{ product.manxb.tennxb }}</div>
        <div class="price">
          Giá: {{ priceString }}đ | Số lượng: {{ product.stockQuantity }}
        </div>
      </div>
      <div class="d-flex flex-column">
        <a
          class="badge bg-success rounded-pill item-edit mt-2"
          @click="onView()"
        >
          {{ showInfo ? 'Ẩn' : 'Xem thêm' }} <i class="fa-solid fa-info"></i>
        </a>
        <router-link
          :to="{ name: 'product-edit', params: { productId: product._id } }"
          class="badge bg-warning rounded-pill item-edit mt-2"
          @click="onEdit()"
        >
          Hiệu chỉnh <i class="fa-solid fa-pen-to-square"></i>
        </router-link>
        <a
          class="badge bg-danger rounded-pill item-edit mt-2"
          @click="onDelete()"
        >
          Xóa <i class="fa-solid fa-xmark"></i>
        </a>
      </div>
    </div>

    <!-- Product view -->
    <div style="display: none">
      <div ref="productView">
        <div style="text-align: left; color: black">
          <h4 class="fw-bold">{{ product.name }}</h4>
          <br />
          <h5 class="mt-3 fw-bold" style="font-size: 1.2em">
            Giá: {{ priceString }}đ | Số lượng: {{ product.stockQuantity }}
          </h5>
        </div>
        <div class="mb-3">
          <image-list :imagesId="product.imagesId"></image-list>
        </div>
        <div class="mb-3" style="text-align: justify; white-space: pre-wrap">
          <h5 class="fw-bold">Mô tả</h5>
          <p style="font-size: 0.8em">Nguồn gốc: {{ product.nguongoc }}</p>
          <p style="font-size: 0.8em">Năm xuất bản: {{ product.namxuatban }}</p>
          <div class="categories">Nhà xuất bản: {{ product.manxb.tennxb }}</div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import productService from '@/services/product.service.js';
import ImageList from '@/components/product/ImageList.vue';
import Swal from 'sweetalert2';

const props = defineProps(['product']);
const showInfo = ref(false);
const emit = defineEmits(['deleteProduct']);
const productView = ref(null);

const imageLink = computed(
  () =>
    `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${
      props.product.images[0]
    }`,
);

const nameString = computed(() => {
  return props.product.name.length > 50
    ? props.product.name.slice(0, 50) + '...'
    : props.product.name;
});

const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(props.product.price);
});

function onEdit() {}

async function onDelete() {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn ẩn sản phẩm này (đặt số lượng kho về 0)?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  const response = await productService.updateProduct(props.product._id, {
    stockQuantity: 0,
  });

  if (response.status === 'fail') {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Ẩn sản phẩm thất bại!',
      icon: 'error',
    });
  } else {
    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Ẩn sản phẩm thành công!',
      icon: 'success',
    });
  }

  emit('deleteProduct');
}

function onView() {
  // showInfo.value = !showInfo.value;
  Swal.fire({
    width: '90%',
    html: productView.value.innerHTML,
    showCloseButton: true,
    showCancelButton: false,
    confirmButtonText: 'Đóng',
  });
}

onBeforeMount(() => {
  props.product.imagesId = props.product.images.map((image) => ({
    _id: image,
    url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${image}`,
  }));
});
</script>

<style scoped>
.product-item {
  background-color: #f6f6f6;
  padding: 10px;
  transition: all 0.3s;
}
.product-item:hover {
  transition: all 0.3s;
  background-color: #ccc;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.item-edit {
  /* font-size: 13px; */
  transition: all 0.3s;
  color: rgb(52, 52, 52);
}

.item-edit:hover {
  cursor: pointer;
  opacity: 0.6;
}

.categories {
  font-size: 14px;
}

.price {
  font-size: 16px;
}
</style>

