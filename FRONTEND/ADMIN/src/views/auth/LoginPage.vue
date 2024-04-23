<template>
  <div class="container p-5">
    <Form class="form" @submit="onSubmit" :validation-schema="loginFormSchema">
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
          class="btn btn-outline-dark btn-md"
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
      </div>
      <div class="mb-3">
        <router-link :to="'/forgot-password'">Quên mật khẩu?</router-link>
      </div>
    </Form>
  </div>
</template>

<script setup>
import '@/assets/css/form.css';
import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

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
  password: yup.string().required('Mật khẩu không được bỏ trống!'),
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

