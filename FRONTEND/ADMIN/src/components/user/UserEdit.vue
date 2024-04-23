<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'user-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại
      </router-link>
    </div>
    <div class="container px-5 py-3">
      <Form class="form" @submit="onSubmit" :validation-schema="userFormSchema">
        <legend class="form-title">Chỉnh sửa tài khoản</legend>
        <div class="mb-3 form-group">
          <label for="email" class="form-label">Email: </label>
          <Field
            type="text"
            name="email"
            id="email"
            class="form-control"
            v-model="user.email"
          />
          <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <label for="holot" class="form-label">Họ lót</label>
          <Field
            type="text"
            name="holot"
            id="holot"
            class="form-control"
            v-model="user.holot"
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
            v-model="user.ten"
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
            v-model="user.dienthoai"
          />
          <ErrorMessage name="dienthoai" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="diachi" class="form-label">Địa chỉ: </label>
          <Field
            name="diachi"
            id="diachi"
            class="form-control"
            v-model="user.diachi"
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
            v-model="user.phai"
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
            v-model="user.ngaysinh"
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
            v-model="user.role"
          >
            <option value="admin">Quản trị viên</option>
            <option value="staff">Nhân viên</option>
            <option value="customer">Khách hàng</option>
          </Field>
          <ErrorMessage name="role" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <Field v-slot="{ field }" name="active" type="checkbox">
            <label>
              Hoạt động:
              <input type="checkbox" name="active" v-model="user.active" />
            </label>
          </Field>
          <ErrorMessage name="is-active" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-dark btn-md"
            type="submit"
            :disabled="loading"
          >
            Cập nhật
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
import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import userService from '@/services/user.service';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isUpdated = ref(false);
const user = ref({});

const userFormSchema = yup.object({
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  holot: yup.string(),
  ten: yup.string(),
  dienthoai: yup.string().required('Số điện thoại không được để trống'),
  diachi: yup.string(),
  ngaysinh: yup.string().required('Ngày sinh không được để trống'),
  role: yup.string().required('Vai trò không được để trống'),
  active: yup.boolean(),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn cập nhật?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Update user
  const response = await userService.updateUser(
    route.params.userId,
    user.value,
  );

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Cập nhật thông tin tài khoản thành công',
      icon: 'success',
    });
    isUpdated.value = true;
    router.push({ name: 'user-list' });
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!',
      icon: 'error',
    });
  }

  loading.value = false;
}

onBeforeMount(async () => {
  const response = await userService.getUser(route.params.userId);

  if (response.status === 'success') {
    user.value = response.data.user;
    user.value.ngaysinh = new Date(user.value.ngaysinh)
      .toISOString()
      .split('T')[0];
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!',
      icon: 'error',
    });
    isUpdated.value = true;
    router.push({ name: 'user-list' });
  }
});

onBeforeRouteLeave(async () => {
  if (isUpdated.value) return true;
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
  max-width: 800px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

