<template>
  <div class="text-center">
    <image-item :image="selectedImageId"></image-item>
    <div class="image-list d-flex mt-3">
      <image-item
        class="image-item"
        v-for="image in imagesId"
        :key="image"
        :image="image"
        :selected="selectedImageId"
        @change-image="onChange"
      >
      </image-item>
    </div>
  </div>
</template>

<script setup>
import ImageItem from '@/components/product/ImageItem.vue';
import { ref, computed } from 'vue';

const props = defineProps(['imagesId']);
const selectedImage = ref('');

const selectedImageId = computed(() => {
  return selectedImage.value || (props.imagesId ? props.imagesId[0] : '');
});

function onChange(image) {
  selectedImage.value = image;
}
</script>

<style scoped>
.image-list {
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100px;
}
</style>

