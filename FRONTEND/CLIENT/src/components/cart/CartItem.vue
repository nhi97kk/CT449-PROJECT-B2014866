<template>
  <div class="row cart-product">
    <div class="col-12 col-md-1 d-flex align-items-center">
      <input
        v-if="item.quantity > 0"
        class="item-check"
        type="checkbox"
        v-model="checked"
      />
    </div>
    <div
      class="col-12 col-md-11 d-flex justify-content-between align-items-center"
    >
      <div
        class="product-info d-flex justify-content-between align-items-center"
        @click="
          router.push({
            name: 'product-view',
            params: { id: item.product._id },
          })
        "
      >
        <img class="item-image" :src="imageLink(item.product)" alt="" />
        <div class="p-1 ms-3">
          <div class="product-name">
            {{ nameString }}
          </div>
          <div class="product-categories">
            <!-- {{ categoriesString }} -->
          </div>
          <div class="product-quantity">
            {{ priceString }}
            <span style="color: var(--color-tertiary)"
              >x{{ item.quantity }}</span
            >
          </div>
        </div>
      </div>
      <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="product-price">{{ totalPriceString }}đ</div>
        <div class="">
          <button class="btn cart-item-btn text-warning" @click="editItem">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="btn cart-item-btn text-danger"
            @click="emits('remove-item', item._id)"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const props = defineProps(['item']);
const emits = defineEmits([
  'remove-item',
  'update-item',
  'add-to-order',
  'remove-from-order',
]);
const checked = ref(false);

function imageLink(product) {
  return `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${
    props.item.product.images[0]
  }`;
}

const nameString = computed(() => {
  if (props.item.product.name.length > 60) {
    return props.item.product.name.slice(0, 60) + '...';
  }
  return props.item.product.name;
});

const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(props.item.product.price);
});

const totalPriceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(
    props.item.product.price * props.item.quantity,
  );
});

function editItem() {
  Swal.fire({
    title: 'Cập nhật số lượng',
    html: `
        <div style="text-align: right;">Hiện có ${props.item.product.stockQuantity} sản phẩm</div>
        <div class="mb-3 input-group">
          <label for="quantity" class="input-group-text">Số lượng</label>
          <input type="number" class="form-control" id="quantity" value="${props.item.quantity}" min="1" max="${props.item.product.stockQuantity}">
        </div>
    `,
    confirmButtonText: 'Cập nhật',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      const quantity = Swal.getPopup().querySelector('#quantity').value;
      emits('update-item', props.item._id, quantity);
    },
  });
}

watch(
  () => checked.value,
  (newValue) => {
    if (newValue) {
      emits('add-to-order', props.item);
    } else {
      emits('remove-from-order', props.item);
    }
  },
);
</script>

<style scoped>
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.cart-product {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.cart-product:hover {
  background-color: #eee;
}

.product-info {
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

.cart-item-btn {
  transition: all 0.3s;
}

.cart-item-btn:hover {
  opacity: 0.7;
  box-shadow: 0 0 3px #ccc;
}

.item-check {
  width: 1.2em;
  height: 1.2em;
  cursor: pointer;
}
</style>

