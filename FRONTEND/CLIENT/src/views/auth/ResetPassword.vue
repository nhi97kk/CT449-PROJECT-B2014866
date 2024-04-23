<template>
  <div class="container p-5">
    <Form
      class="form"
      @submit="onSubmit"
      :validation-schema="resetPasswordFormSchema"
    >
      <legend class="form-title">Tạo mật khẩu mới</legend>
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
        <label for="confirm-password" class="form-label"
          >Xác nhận mật khẩu</label
        >
        <Field
          :type="confirmPasswordInputStatus"
          name="confirmPassword"
          id="confirm-password"
          class="form-control pe-5"
          v-model="confirmPassword"
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
          Xác nhận
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
</template>

<script setup>
import '@/assets/css/form.css';
import { ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup';
import userService from '@/services/user.service';
import Swal from 'sweetalert2';

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const route = useRoute();
const router = useRouter();

const resetPasswordFormSchema = yup.object({
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

async function onSubmit() {
  loading.value = true;
  const resetToken = route.params.resetToken;
  const data = {
    password: password.value,
    confirmPassword: confirmPassword.value,
  };

  const response = await userService.resetPassword(resetToken, data);

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công!',
      text: response.message,
      icon: 'success',
    });
    router.push({ name: 'login-page' });
  } else {
    await Swal.fire({
      title: 'Thất bại!',
      text: response.message,
      icon: 'error',
    });
    password.value = '';
    confirmPassword.value = '';
  }
  loading.value = false;
}

// for show password
const passwordInputStatus = ref('password');
const confirmPasswordInputStatus = ref('password');

async function showPassword() {
  if (passwordInputStatus.value === 'password')
    passwordInputStatus.value = 'text';
  else passwordInputStatus.value = 'password';
}
async function showConfirmPassword() {
  if (confirmPasswordInputStatus.value === 'password')
    confirmPasswordInputStatus.value = 'text';
  else confirmPasswordInputStatus.value = 'password';
}
</script>

<style></style>

