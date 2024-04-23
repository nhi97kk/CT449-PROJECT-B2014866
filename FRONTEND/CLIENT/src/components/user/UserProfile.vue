<template>
  <div class="profile row">
    <div class="col-12 col-lg-6">
      <h2>Thông tin tài khoản</h2>

      <div>
        <Form
          class="form"
          :validation-schema="userFormSchema"
          @submit="onSubmit"
        >
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
            <ErrorMessage
              name="dienthoai"
              class="error-feedback"
            ></ErrorMessage>
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
          <div class="mb-3 input-group">
            <button class="edit-btn rounded-1" :disabled="loading">
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
              class="edit-btn ms-3 rounded-1"
              @click="onCancel"
              v-if="canChange"
            >
              Hủy
            </button>
          </div>
        </Form>
      </div>
    </div>
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
  telephone: yup
    .string()
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
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
      text: response.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!',
    });
    router.push({ name: 'home-page' });
    return;
  }

  await Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: response.message || 'Cập nhật thông tin thành công!',
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
  await refreshData();
});
</script>

<style scoped>
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

.input-group-text {
  min-width: 60px;
  background-color: transparent;
  color: #000;
  border-right: 0;
  border: 1px solid var(--color-secondary);
}

.form {
  margin: auto 0;
  padding: 0 20px;
}

.input-group-text i {
  margin: auto;
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

