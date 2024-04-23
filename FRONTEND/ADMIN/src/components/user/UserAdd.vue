<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'user-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại
      </router-link>
    </div>
    <div class="container p-5">
      <Form class="form" @submit="onSubmit" :validation-schema="userFormSchema">
        <legend class="form-title">Thêm tài khoản mới</legend>
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
          <label for="password" class="form-label">Mật khẩu: </label>
          <Field
            type="text"
            name="password"
            id="password"
            class="form-control"
            v-model="user.password"
          />
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
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
              <input type="checkbox" name="active" v-model="user.active" />
              Active
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
            Thêm mới
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
import userService from '@/services/user.service';
import Swal from 'sweetalert2';

const router = useRouter();
const isAdd = ref(false);
const loading = ref(false);
const user = ref({
  email: '',
  password: '',
  fullname: '',
  telephone: '',
  address: '',
  role: 'customer',
  active: true,
});

const userFormSchema = yup.object({
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  holot: yup.string(),
  ten: yup.string(),
  password: yup.string().min('8', 'Mật khẩu phải có ít nhất 8 ký tự'),
  dienthoai: yup.string().required('Số điện thoại không được để trống'),
  diachi: yup.string(),
  ngaysinh: yup.string().required('Ngày sinh không được để trống'),
  role: yup.string().required('Vai trò không được để trống'),
  active: yup.boolean('Active không hợp lệ'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn thêm tài khoản?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;

  user.value.confirmPassword = user.value.password;

  // Update user
  const response = await userService.createUser(user.value);

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công',
      text: response.message,
      icon: 'success',
    });
    isAdd.value = true;
    router.push({ name: 'user-list' });
  } else {
    const result = await Swal.fire({
      title: 'Thất bại',
      text: response.message,
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
  max-width: 800px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

