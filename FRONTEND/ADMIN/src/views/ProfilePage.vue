<template>
  <div class="profile my-5">
    <Form
      class="form"
      :validation-schema="userFormSchema"
      @submit.prevent="onSubmit"
    >
      <legend class="form-title">Thông tin cá nhân</legend>
      <div class="mb-3 form-group">
        <label for="email" class="form-label">Email: </label>
        <Field
          type="text"
          name="email"
          id="email"
          class="form-control"
          v-model="data.email"
          disabled
        />
      </div>

      <div class="mb-3 form-group">
        <label for="holot" class="form-label">Họ lót</label>
        <Field
          type="text"
          name="holot"
          id="holot"
          class="form-control"
          v-model="data.holot"
        />
        <ErrorMessage name="holot" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="ten" class="form-label">Tên</label>
        <Field
          type="text"
          name="ten"
          id="ten"
          class="form-control"
          v-model="data.ten"
        />
        <ErrorMessage name="ten" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="dienthoai" class="form-label">Số điện thoại: </label>
        <Field
          type="text"
          name="dienthoai"
          id="dienthoai"
          class="form-control"
          v-model="data.dienthoai"
        />
        <ErrorMessage name="dienthoai" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="diachi" class="form-label">Địa chỉ: </label>
        <Field
          name="diachi"
          id="diachi"
          class="form-control"
          v-model="data.diachi"
        />
        <ErrorMessage name="diachi" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="phai" class="form-label">Phái</label>
        <Field
          as="select"
          name="phai"
          id="phai"
          class="form-control"
          v-model="data.phai"
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </Field>
        <ErrorMessage name="phai" class="error-feedback"></ErrorMessage>
      </div>
      <div class="mb-3 form-group">
        <label for="ngaysinh" class="form-label">Ngày sinh</label>
        <Field
          type="date"
          name="ngaysinh"
          id="ngaysinh"
          class="form-control"
          v-model="data.ngaysinh"
        />
        <ErrorMessage name="ngaysinh" class="error-feedback"></ErrorMessage>
      </div>

      <div class="mb-3 form-group">
        <label for="role" class="form-label">Vai trò: </label>
        <Field
          as="select"
          name="role"
          id="role"
          class="form-control"
          disabled
          v-model="data.role"
        >
          <option value="admin">Quản trị viên</option>
          <option value="staff">Nhân viên</option>
          <option value="customer">Khách hàng</option>
        </Field>
      </div>
      <div class="mb-3 form-group">
        <button
          class="btn btn-outline-dark btn-md"
          :disabled="loading"
          @click="onSubmit"
        >
          {{ canChange ? 'Lưu' : 'Chỉnh sửa' }}
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="loading"
          ></span>
        </button>
        <button
          type="button"
          class="btn btn-outline-dark btn-md ms-3"
          @click="onCancel"
          v-if="canChange"
        >
          Hủy
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import userService from '@/services/user.service.js';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(false);
const canChange = ref(false);
const data = ref({
  _id: '',
  email: '',
  fullname: '',
  address: '',
  telephone: '',
});

const userFormSchema = yup.object({
  fullname: yup.string(),
  telephone: yup.string().required('Số điện thoại không được để trống'),
  address: yup.string(),
});

async function onSubmit() {
  if (!canChange.value) {
    canChange.value = true;
    return;
  }

  const result = await Swal.fire({
    title: 'Xác nhận?',
    text: 'Bạn chắc chắn muốn cập nhật thông tin cá nhân.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Cập nhật',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;

  const response = await userService.updateMe(data.value);

  if (response.status !== 'success') {
    await Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    });
    router.push({ name: 'home-page' });
    return;
  }

  await Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: 'Cập nhật thông tin thành công!',
  });

  loading.value = false;
  canChange.value = false;
}

async function onCancel() {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn muốn hủy?',
    text: 'Mọi thay đổi sẽ không được áp dụng.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hủy thay đổi',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (result.isConfirmed) {
    await refreshData();
    canChange.value = false;
  }
}

async function refreshData() {
  const response = await userService.getMe();

  if (response.status !== 'success') {
    await Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: response.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    });
    router.push({ name: 'home-page' });
    return;
  }

  data.value = response.data.user;
  data.value.ngaysinh = new Date(data.value.ngaysinh)
    .toISOString()
    .split('T')[0];
}

onBeforeMount(async () => {
  refreshData();
});
</script>

<style scoped>
input:disabled,
select:disabled {
  background-color: #fff;
  border-radius: 0;
  border: 1px solid #fff;
  padding-left: 25px;
  transition: all 0.3s ease-in-out;
}

.profile {
  border: 1px solid #ccc;
  margin: auto;
  max-width: 600px;
  padding: 10px;
}
</style>

