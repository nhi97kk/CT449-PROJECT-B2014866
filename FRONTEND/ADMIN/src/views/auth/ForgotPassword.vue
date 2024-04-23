<template>
  <div class="container p-5">
    <legend class="form-title">Quên mật khẩu</legend>

    <Form
      class="form"
      @submit="onSubmit"
      :validation-schema="forgotPasswordFormSchema"
    >
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
      <p class="description">
        Thông tin xác thực sẽ được gửi đến email của bạn!
      </p>
      <div class="mb-3 form-group">
        <button
          class="btn btn-outline-dark btn-md"
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
        <span class="ms-5">
          <router-link :to="'/login'" :hidden="loading"
            >Tiếp tục đăng nhập</router-link
          >
        </span>
      </div>
    </Form>
  </div>
</template>

<script setup>
import '@/assets/css/form.css';
import { ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import userService from '@/services/user.service';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const email = ref('');
const status = ref('');
const loading = ref(false);
const router = useRouter();

const forgotPasswordFormSchema = yup.object({
  email: yup
    .string('Email không hợp lệ!')
    .email('Email không hợp lệ!')
    .required('Email không được bỏ trống!'),
});

async function onSubmit() {
  loading.value = true;
  const response = await userService.forgotPassword({ email: email.value });

  if (response.status === 'success') {
    status.value = 'success';
    await Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Thông tin xác thực đã được gửi đến email của bạn!',
    });
    router.push({ name: 'login-page' });
  } else {
    status.value = '';
    await Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Xảy ra lỗi trong quá trình xác thực! Vui lòng thử lại!',
    });
  }
  loading.value = false;
}
</script>

<style scpoed>
.description {
  font-size: 13px;
  color: #6c757d;
}
</style>

