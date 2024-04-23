<template>
  <div
    class="order-product d-flex justify-content-between align-items-center"
    @click="
      router.push({
        name: 'product-view',
        params: { id: item.product._id },
      })
    "
  >
    <div class="d-lg-flex justify-content-between align-items-center">
      <img
        class="item-image"
        :src="imageLink(item.product)"
        alt="Ảnh sản phẩm"
      />
      <div class="p-1">
        <div class="product-name">
          {{ nameString }}
        </div>
        <!-- <div class="product-categories">
          {{ categoriesString }}
        </div> -->
        <div class="product-quantity">
          {{ priceString }}đ x{{ item.quantity }}
        </div>
      </div>
    </div>
    <div class="product-price">{{ totalPriceString }}đ</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps(['item']);

function imageLink() {
  return `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${
    props.item.product.images[0]
  }`;
}

const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(props.item.price);
});

const nameString = computed(() => {
  if (props.item.product.name.length > 60) {
    return props.item.product.name.slice(0, 60) + '...';
  }
  return props.item.product.name;
});

const totalPriceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(
    props.item.price * props.item.quantity,
  );
});
</script>

<style scoped>
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.order-product {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.order-product:hover {
  background-color: #eee;
  cursor: pointer;
}

.product-price {
  color: var(--color-secondary);
}

.product-categories {
  font-size: 0.8rem;
  color: #666;
}

.product-quantity {
  font-size: 0.9rem;
  color: var(--color-secondary);
}
</style>

