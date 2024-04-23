<template>
  <div
    class="card product-item col-6 col-md-4 col-lg-2 rounded-0 border-0 p-2"
    @click="onView()"
  >
    <img class="product-image" :src="imageLink" alt="Ảnh sách" />
    <div class="card-body">
      <rating-star class="rating-star"></rating-star>
      <div class="product-name">{{ productNameString }}</div>
      <div class="product-price fw-bold">{{ priceString }}đ</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import RatingStar from '@/components/product/RatingStar.vue';
import { useRouter } from 'vue-router';

const props = defineProps(['product']);
const emit = defineEmits(['deleteProduct']);
const router = useRouter();

const imageLink = computed(
  () =>
    `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${
      props.product.images[0]
    }`,
);

const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(props.product.price);
});

const productNameString = computed(() => {
  return props.product.name.length > 40
    ? props.product.name.substring(0, 40) + '...'
    : props.product.name;
});

function onView() {
  router.push({ name: 'product-view', params: { id: props.product._id } });
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
  background-color: inherit;
  transition: all 0.3s;
  cursor: pointer;
}
.product-item:hover {
  transition: all 0.3s;
  background-color: #ccc;
}

.product-name {
  font-size: 14px;
  color: black;
  height: 40px;
  overflow: hidden;
}

.product-price {
  font-size: 16px;
}

.product-image {
  object-fit: cover;
}
</style>

