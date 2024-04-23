<template>
  <div class="image-list d-flex">
    <image-item
      class="image-item"
      v-for="image in imagesId"
      :key="image._id"
      :image="image"
      :can-remove="canRemove"
      @remove="removeImage"
    ></image-item>
  </div>
</template>

<script setup>
import ImageItem from '@/components/product/ImageItem.vue';

const props = defineProps(['imagesId', 'canRemove']);
const emits = defineEmits(['remove']);

function removeImage(imageId) {
  emits('remove', imageId);
}
</script>

<style scoped>
.image-list {
  overflow-x: scroll;
  overflow-y: hidden;
  height: 200px;
}
</style>

