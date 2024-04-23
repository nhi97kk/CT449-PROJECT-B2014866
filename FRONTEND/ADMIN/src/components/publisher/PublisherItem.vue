<template>
  <li class="">
    <div
      class="publisher-item list-group-item d-flex justify-content-between align-items-strech mt-3"
    >
      <div class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column">
        <div class="email">
          <span class="fw-bold">Nhà xuất bản:</span>
          {{ publisher.tennxb }}
        </div>
        <div class="email">
          <span class="fw-bold">Địa chỉ:</span>
          {{ publisher.diachi }}
        </div>
      </div>

      <div class="d-flex flex-column">
        <router-link
          :to="{
            name: 'publisher-edit',
            params: { publisherId: publisher._id },
          }"
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
  </li>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import publisherService from '@/services/publisher.service.js';
import Swal from 'sweetalert2';

const props = defineProps(['publisher']);
const emit = defineEmits(['deletePublisher']);

function onEdit() {}

async function onDelete() {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: 'Bạn có chắc chắn muốn xóa nhà xuất bản này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  const response = await publisherService.deletePublisher(props.publisher._id);

  if (response.status === 'fail') {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Xóa NXB thất bại!',
      icon: 'error',
    });
  } else {
    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Xóa NXB thành công!',
      icon: 'success',
    });
  }

  emit('deletePublisher');
}
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
</style>

