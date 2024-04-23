<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'product-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại trang danh sách
      </router-link>
    </div>
    <div class="container p-5">
      <Form
        class="form"
        @submit="onSubmit"
        :validation-schema="productFormSchema"
      >
        <legend class="form-title">Thêm sách</legend>
        <div class="mb-3 form-group">
          <label for="name" class="form-label">Tên sách: </label>
          <Field
            type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="product.name"
          />
          <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="price" class="form-label">Giá sách: </label>
          <Field
            type="text"
            name="price"
            id="price"
            class="form-control"
            v-model="product.price"
          />
          <ErrorMessage name="price" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="stock-quantity" class="form-label">Số lượng: </label>
          <Field
            type="text"
            name="stockQuantity"
            id="stock-quantity"
            class="form-control"
            v-model="product.stockQuantity"
          />
          <ErrorMessage
            name="stockQuantity"
            class="error-feedback"
          ></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="manxb" class="form-label">Nhà xuất bản: </label>
          <Field
            as="select"
            name="manxb"
            id="manxb"
            class="form-control"
            v-model="product.manxb"
          >
            <option v-for="nxb in publisher" :value="nxb._id">
              {{ nxb.tennxb }}
            </option>
          </Field>

          <ErrorMessage name="manxb" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="nguongoc" class="form-label">Nguồn gốc/ Tác giả: </label>
          <Field
            type="text"
            name="nguongoc"
            id="nguongoc"
            class="form-control"
            v-model="product.nguongoc"
          />
          <ErrorMessage name="nguongoc" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="namxuatban" class="form-label">Năm xuất bản: </label>
          <Field
            type="text"
            name="namxuatban"
            id="namxuatban"
            class="form-control"
            v-model="product.namxuatban"
          />
          <ErrorMessage name="namxuatban" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="images" class="form-label">Thêm ảnh sách: </label>
          <input
            type="file"
            name="images"
            id="images"
            class="form-control"
            multiple
            accept="image/*"
            @change="onImagesChange"
          />
        </div>
        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-dark btn-md"
            type="submit"
            :disabled="loading"
          >
            Thêm sách
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
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import productService from '@/services/product.service';
import publisherService from '@/services/publisher.service';
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(false);
const isAdd = ref(false);
const formData = ref(null);
const publisher = ref({});
const product = ref({
  name: '',
  price: 0,
  stockQuantity: 0,
  nguongoc: '',
  namxuatban: '',
});

const productFormSchema = yup.object({
  name: yup
    .string()
    .required('Tên sản phẩm không được để trống')
    .min(5, 'Tên sản phẩm phải có ít nhất 5 ký tự')
    .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự'),
  price: yup
    .number('Giá sản phẩm phải là số')
    .required('Giá sản phẩm không được để trống')
    .min(1, 'Giá sản phẩm phải lớn hơn 0'),
  stockQuantity: yup
    .number('Số lượng phải là số')
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được nhỏ hơn 0'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn thêm sản phẩm này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  if (formData.value === null) {
    await Swal.fire({
      title: 'Thất bại',
      text: 'Bạn chưa chọn ảnh cho sản phẩm!',
      icon: 'error',
    });
    loading.value = false;
    return;
  }
  // Create product
  const response = await productService.createProduct(product.value);

  if (response.status !== 'success') {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
    loading.value = false;
    return;
  }

  if (response.status === 'success') {
    isAdd.value = true;
    //  Add new image
    await productService.createProductImages(
      response.data.product._id,
      formData.value,
    );

    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Thêm sản phẩm thành công!',
      icon: 'success',
    });
    router.push({ name: 'product-list' });
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message || 'Thêm sản phẩm thất bại!',
      icon: 'error',
    });
  }
  loading.value = false;
}

function onImagesChange(e) {
  formData.value = new FormData();
  for (let i = 0; i < e.target.files.length; i++) {
    formData.value.append('images', e.target.files[i]);
  }
}

onBeforeMount(async () => {
  const response = await publisherService.getAllPublishers();

  if (response.status === 'success') {
    publisher.value = response.data.publishers;
  }
});

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
  max-width: 1000px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

