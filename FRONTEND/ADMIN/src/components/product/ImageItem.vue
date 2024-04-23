<template>
  <div class="">
    <img :src="imageUrl" alt="Ảnh sản phẩm" />
    <span
      class="remove-icon"
      title="Xóa ảnh"
      @click="removeImage"
      v-if="canRemove"
    >
      <i class="fa-solid fa-xmark"></i>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps(['image', 'canRemove']);
const emits = defineEmits(['remove']);

const imageUrl = computed(() => {
  return props.image.url;
});

async function removeImage() {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa ảnh này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) {
    return;
  }

  emits('remove', props.image._id);
}
</script>

<style scoped>
div {
  position: relative;
}

div + div {
  margin-left: 20px;
}

img {
  border: 1px solid #ccc;
  height: 180px;
}

.remove-icon {
  position: absolute;
  border: 0;
  top: 0px;
  right: 0px;
  font-size: 35px;
  color: #ccc;
  background-color: inherit;
  transition: all 0.3s;
  padding: 2px;
  cursor: pointer;
}

.remove-icon:hover {
  color: red;
}
</style>

