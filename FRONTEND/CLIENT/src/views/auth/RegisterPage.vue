<template>
  <div class="container p-5">
    <div class="auth-card">
      <Form
        class="form"
        @submit="onSubmit"
        :validation-schema="registerFormSchema"
      >
        <legend class="form-title">Đăng ký tài khoản</legend>
        <div class="mb-3 form-group">
          <label for="email" class="form-label"
            >Email<span class="required-field">*</span></label
          >
          <Field
            type="text"
            name="email"
            id="email"
            class="form-control"
            v-model="data.email"
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
          <label for="dienthoai" class="form-label">Số điện thoại</label>
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
          <label for="diachi" class="form-label">Địa chỉ</label>
          <Field
            type="text"
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
          <label for="password" class="form-label"
            >Mật khẩu<span class="required-field">*</span></label
          >
          <Field
            :type="passwordInputStatus"
            name="password"
            id="password"
            class="form-control pe-5"
            v-model="data.password"
          />
          <button type="button" class="show-password" @click="showPassword">
            <i class="fa-regular fa-eye"></i>
          </button>
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="confirm-password" class="form-label"
            >Nhập lại mật khẩu<span class="required-field">*</span></label
          >
          <Field
            :type="confirmPasswordInputStatus"
            name="confirmPassword"
            id="confirm-password"
            class="form-control pe-5"
            v-model="data.confirmPassword"
          />
          <button
            type="button"
            class="show-password"
            @click="showConfirmPassword"
          >
            <i class="fa-regular fa-eye"></i>
          </button>
          <ErrorMessage
            name="confirmPassword"
            class="error-feedback"
          ></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-light btn-md"
            type="submit"
            :disabled="loading"
          >
            Đăng ký
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="loading"
            ></span>
          </button>
        </div>
        <div class="mb-3">
          Bạn đã có tài khoản?
          <router-link
            :to="'/login'"
            class="ps-3 text-primary underline special-link"
            >Đăng nhập</router-link
          >
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/form.css';
import userSevice from '@/services/user.service.js';
import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const data = ref({
  email: '',
  holot: '',
  ten: '',
  dienthoai: '',
  diachi: '',
  ngaysinh: '',
  phai: '',
  password: '',
  confirmPassword: '',
});
const store = useUserStore();
const passwordInputStatus = ref('password');
const confirmPasswordInputStatus = ref('password');
const loading = ref(false);
const router = useRouter();

const registerFormSchema = yup.object({
  email: yup
    .string('Email không hợp lệ!')
    .email('Email không hợp lệ!')
    .required('Email không được bỏ trống!'),
  password: yup
    .string()
    .required('Mật khẩu không được bỏ trống!')
    .min(8, 'Mật khẩu ít nhất 8 kí tự!'),
  dienthoai: yup
    .string()
    .required('Số điện thoại không được bỏ trống!')
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

async function onSubmit() {
  loading.value = true;
  const response = await userSevice.register(data.value);

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công!',
      text: response.message,
      icon: 'success',
    });
    router.push({ name: 'login-page' });
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'Thất bại!',
      text: response.message,
    });
    password.value = '';
  }

  loading.value = false;
}

function showPassword() {
  if (passwordInputStatus.value === 'password')
    passwordInputStatus.value = 'text';
  else passwordInputStatus.value = 'password';
}

function showConfirmPassword() {
  if (confirmPasswordInputStatus.value === 'password')
    confirmPasswordInputStatus.value = 'text';
  else confirmPasswordInputStatus.value = 'password';
}

onBeforeMount(() => {
  if (store.isAuth) router.push({ name: 'home-page' });
});
</script>

<style scoped>
.auth-card {
  background-color: rgba(0, 0, 0, 0.103);
  color: white;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 10px;
  max-width: 600px;
  margin: auto;
}
</style>

