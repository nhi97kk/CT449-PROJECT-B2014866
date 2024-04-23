<template>
  <div class="change-password row">
    <div class="col-12 col-lg-6">
      <h2>Đổi mật khẩu</h2>

      <Form class="form mt-3" @submit="onSubmit">
        <div class="form-group">
          <label for="old-password">Mật khẩu cũ</label>
          <Field
            type="password"
            name="oldPassword"
            id="old-password"
            class="form-control"
            v-model="data.oldPassword"
          />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu mới</label>
          <Field
            type="password"
            name="password"
            id="password"
            class="form-control"
            v-model="data.password"
          />
        </div>
        <div class="form-group">
          <label for="confirm-password">Nhập lại mật khẩu mới</label>
          <Field
            type="password"
            name="confirmPassword"
            id="confirm-password"
            class="form-control"
            v-model="data.confirmPassword"
          />
        </div>

        <button type="submit" class="edit-btn mt-3">Đổi mật khẩu</button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import userService from '@/services/user.service.js';
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const store = useUserStore();
const router = useRouter();

const data = ref({
  oldPassword: '',
  password: '',
  confirmPassword: '',
});

const userFormSchema = yup.object().shape({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu cũ'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp'),
});

async function onSubmit() {
  try {
    await userFormSchema.validate(data.value, { abortEarly: false });

    const isConfirmed = await Swal.fire({
      title: 'Xác nhận thay đổi mật khẩu',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    });

    if (!isConfirmed) {
      return;
    }

    const response = await userService.updatePassword(data.value);

    if (response.status !== 'success') {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Mật khẩu cũ không đúng',
      });
      return;
    }

    await Swal.fire({
      title: 'Thay đổi mật khẩu thành công',
      icon: 'success',
      confirmButtonText: 'Đóng',
    });

    await store.login();
    router.push({ name: 'home-page' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: error.errors[0],
      });
    }
    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    });
  }
}
</script>

<style scoped>
label {
  color: #000;
}

input,
select {
  color: #000;
  border: 1px solid #ccc;
}

input:disabled,
select:disabled {
  background-color: transparent;
  border: 1px solid var(--color-secondary);
  padding-left: 25px;
  transition: all 0.3s ease-in-out;
  color: #000;
}

.form {
  margin: auto 0;
  padding: 0 20px;
}

.form-group + .form-group {
  margin-top: 15px;
}

.edit-btn {
  background-color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  border: 1px solid var(--color-secondary);
  background-color: rgba(255, 218, 155, 0.141);
  color: var(--color-secondary);
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: #fff;
}
</style>

