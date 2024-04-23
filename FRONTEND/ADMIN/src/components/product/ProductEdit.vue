<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'product-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại trang danh sách
      </router-link>
    </div>
    <div class="container px-5 py-3">
      <Form
        class="form"
        @submit="onSubmit"
        :validation-schema="productFormSchema"
      >
        <legend class="form-title">Chỉnh sửa sách</legend>
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
          <label class="form-label">Ảnh về sách: </label>
          <ImageList
            :imagesId="product.images"
            @remove="removeImage"
            :can-remove="true"
          />
        </div>
        <div class="mb-3 form-group">
          <label for="images" class="form-label">Thêm ảnh cho sách: </label>
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
import productService from '@/services/product.service';
import publisherService from '@/services/publisher.service';
import ImageList from '@/components/product/ImageList.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isUpdated = ref(false);
const imageRemoved = ref([]);
const formData = ref(null);
const publisher = ref({});
const product = ref({
  name: '',
  price: '',
  stockQuantity: '',
  nguongoc: '',
  namxuatban: '',
  manxb: '',
});

const productFormSchema = yup.object({
  name: yup
    .string()
    .required('Tên sách không được để trống')
    .min(5, 'Tên sách phải có ít nhất 5 ký tự')
    .max(200, 'Tên sách không được vượt quá 200 ký tự'),
  price: yup
    .number('Giá sách phải là số')
    .required('Giá sách không được để trống')
    .min(0, 'Giá sách phải lớn hơn 0'),
  stockQuantity: yup
    .number('Số lượng phải là số')
    .required('Số lượng không được để trống')
    .min(0, 'Số lượng không được nhỏ hơn 0'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn cập nhật thông tin của sách?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  if (product.value.images.length === 0 && formData.value === null) {
    await Swal.fire({
      title: 'Thất bại',
      text: 'Bạn chưa chọn ảnh cho sách!',
      icon: 'error',
    });
    loading.value = false;
    return;
  }

  // Update product
  const response = await productService.updateProduct(
    route.params.productId,
    product.value,
  );

  if (response.status === 'success') {
    //   Remove image
    if (imageRemoved.value.length > 0) {
      imageRemoved.value.forEach(async (imageId) => {
        await productService.deleteProductImage(
          route.params.productId,
          imageId,
        );
      });
    }

    //  Add new image
    if (formData.value !== null) {
      await productService.createProductImages(
        route.params.productId,
        formData.value,
      );
    }

    await Swal.fire({
      title: 'Thành công',
      text: response.message || 'Cập nhật sách thành công!',
      icon: 'success',
    });
    isUpdated.value = true;
    router.push({ name: 'product-list' });
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
  }
  loading.value = false;
}

function removeImage(imageId) {
  imageRemoved.value.push(imageId);
  product.value.images = product.value.images.filter(
    (image) => image._id !== imageId,
  );
}

function onImagesChange(e) {
  formData.value = new FormData();
  for (let i = 0; i < e.target.files.length; i++) {
    formData.value.append('images', e.target.files[i]);
  }
}

onBeforeMount(async () => {
  const response = await productService.getProduct(route.params.productId);
  const responsee = await publisherService.getAllPublishers();

  if (responsee.status === 'success') {
    publisher.value = responsee.data.publishers;
  }

  if (response.status === 'success') {
    product.value = response.data.product;
    product.value.manxb = product.value.manxb._id;
    product.value.images = product.value.images.map((image) => ({
      _id: image,
      url: `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${image}`,
    }));
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
    isUpdated.value = true;
    router.push({ name: 'product-list' });
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
  max-width: 1000px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

