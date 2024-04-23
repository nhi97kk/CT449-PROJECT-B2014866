<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'publisher-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại
      </router-link>
    </div>
    <div class="container p-5">
      <Form
        class="form"
        @submit="onSubmit"
        :validation-schema="publisherFormSchema"
      >
        <legend class="form-title">Thêm nhà xuất bản</legend>
        <div class="mb-3 form-group">
          <label for="tennxb" class="form-label">Tên nhà xuất bản: </label>
          <Field
            type="text"
            name="tennxb"
            id="tennxb"
            class="form-control"
            v-model="publisher.tennxb"
          />
          <ErrorMessage name="tennxb" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="diachi" class="form-label">Địa chỉ: </label>
          <Field
            type="text"
            name="diachi"
            id="diachi"
            class="form-control"
            v-model="publisher.diachi"
          />
          <ErrorMessage name="diachi" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-dark btn-md"
            type="submit"
            :disabled="loading"
          >
            Thêm nhà xuất bản
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="loading"
            ></span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/form.css';
import { ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import publisherService from '@/services/publisher.service';
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(false);
const isAdd = ref(false);
const publisher = ref({
  tennxb: '',
  diachi: '',
});

const publisherFormSchema = yup.object({
  tennxb: yup
    .string()
    .required('Tên nhà xuất bản không được để trống')
    .min(5, 'Tên nhà xuất bản phải có ít nhất 5 ký tự')
    .max(200, 'Tên nhà xuất bản không được vượt quá 200 ký tự'),
  diachi: yup
    .string()
    .required('Địa chỉ nhà xuất bản không được để trống')
    .min(5, 'Địa chỉ nhà xuất bản phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ nhà xuất bản không được vượt quá 200 ký tự'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn thêm nhà xuất bản này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Create publisher
  const response = await publisherService.createPublisher(publisher.value);

  if (response.status !== 'success') {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
    loading.value = false;
    return;
  }

  if (response.status === 'success') {
    isAdd.value = true;

    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Thêm nhà xuất bản thành công!',
      icon: 'success',
    });
    router.push({ name: 'publisher-list' });
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Thêm nhà xuất bản thất bại!',
      icon: 'error',
    });
  }
  loading.value = false;
}

onBeforeRouteLeave(async () => {
  if (isAdd.value) return true;
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Thông tin chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  return result.isConfirmed;
});
</script>

<style scoped>
.form {
  max-width: 1000px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

