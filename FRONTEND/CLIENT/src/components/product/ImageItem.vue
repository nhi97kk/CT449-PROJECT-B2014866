<template>
  <div class="image-item" :class="isActive" @click="onChange">
    <img :src="imageUrl" alt="Ảnh sản phẩm" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['image', 'selected']);
const emits = defineEmits(['change-image']);

const imageUrl = computed(() => {
  if (!props.image) {
    return '';
  }
  return `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${props.image}`;
});

const isActive = computed(() => {
  return { active: props.image == props.selected };
});

function onChange() {
  emits('change-image', props.image);
}
</script>

<style scoped>
.image-item {
  position: relative;
  cursor: pointer;
}

.image-item + .image-item {
  margin-left: 20px;
}

img {
  border: 1px solid #ccc;
  height: 100%;
  width: 100%;
}

.active {
  border: 1px dashed var(--color-secondary);
}
</style>

