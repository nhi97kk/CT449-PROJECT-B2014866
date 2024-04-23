<template>
  <div class="container p-5">
    <div class="auth-card">
      <Form
        class="form"
        @submit="onSubmit"
        :validation-schema="loginFormSchema"
      >
        <legend class="form-title">Đăng nhập</legend>
        <div class="mb-3 form-group">
          <label for="email" class="form-label">Email</label>
          <Field
            type="text"
            name="email"
            id="email"
            class="form-control"
            v-model="email"
          />
          <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="password" class="form-label">Mật khẩu</label>
          <Field
            :type="passwordInputStatus"
            name="password"
            id="password"
            class="form-control pe-5"
            v-model="password"
          />
          <button type="button" class="show-password" @click="showPassword">
            <i class="fa-regular fa-eye"></i>
          </button>
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-light btn-md"
            type="submit"
            :disabled="loading"
          >
            Đăng nhập
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="loading"
            ></span>
          </button>
          <router-link
            :to="'/forgot-password'"
            class="ps-3 text-white special-link"
            >Quên mật khẩu?</router-link
          >
        </div>
        <div class="mb-3">
          Bạn chưa có tài khoản?
          <router-link
            :to="'/register'"
            class="ps-3 text-primary underline special-link"
            >Đăng ký</router-link
          >
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
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const email = ref('');
const password = ref('');
const store = useUserStore();
const passwordInputStatus = ref('password');
const loading = ref(false);
const router = useRouter();

const loginFormSchema = yup.object({
  email: yup
    .string('Email không hợp lệ!')
    .email('Email không hợp lệ!')
    .required('Email không được bỏ trống!'),
  password: yup
    .string()
    .min(8, 'Mật khẩu ít nhất 8 kí tự!')
    .required('Mật khẩu không được bỏ trống!'),
});

async function onSubmit() {
  loading.value = true;
  await store.login({
    email: email.value,
    password: password.value,
  });

  if (store.isAuth) router.push({ name: 'home-page' });

  loading.value = false;
}

function showPassword() {
  if (passwordInputStatus.value === 'password')
    passwordInputStatus.value = 'text';
  else passwordInputStatus.value = 'password';
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

