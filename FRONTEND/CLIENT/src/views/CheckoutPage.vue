<template>
  <div>
    <div class="container-md mt-3">
      <a @click="router.go(-1)" class="router-link">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại trang trước
      </a>
    </div>
    <div class="container-md px-5 py-3 page">
      <legend class="form-title">Xác nhận gửi yêu cầu mượn</legend>
      <div class="mb-3 form-group">
        <div class="order-info">
          <h4 class="mt-3">Thông tin mượn:</h4>
          <div class="row">
            <div class="col-12 col-md-6 my-1">
              <span class="fw-bold">Email: </span>
              <span>{{ order.user.email }}</span>
            </div>

            <div class="col-12 col-md-6 my-1">
              <span class="fw-bold">Tên: </span>
              <span>
                {{ order.fullname ? order.fullname : 'Chưa có thông tin' }}
              </span>
            </div>
            <div class="col-12 col-md-6 my-1">
              <span class="fw-bold">Địa chỉ: </span>
              <span>
                {{
                  order.shippingAddress
                    ? order.shippingAddress
                    : 'Chưa có thông tin'
                }}
              </span>
            </div>
            <div class="col-12 col-md-6 my-1">
              <span class="fw-bold">Số điện thoại: </span>
              <span>
                {{ order.telephone ? order.telephone : 'Chưa có thông tin' }}
              </span>
            </div>
          </div>
          <p class="order-date">
            <i
              class="fa-solid fa-calendar-day"
              style="color: var(--color-secondary)"
            ></i>
            Hạn trả sách vào ngày:
            {{ getDateString(Date.now() + 3600000 * 24 * 14) }}
          </p>
        </div>

        <div class="order-info">
          <h4 class="mt-3">Chi tiết:</h4>
          <table class="table">
            <thead>
              <tr>
                <th class="d-none d-lg-table-cell" scope="col">#</th>
                <th scope="col">Sản phẩm</th>
                <th class="d-none d-lg-table-cell" scope="col">Giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Tổng giá trị</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="order-item"
                v-for="(item, index) in order.orderItems"
                :key="item._id"
                style="vertical-align: middle"
              >
                <th class="d-none d-lg-table-cell" scope="row">
                  {{ index + 1 }}
                </th>
                <td>
                  <img
                    class="item-image"
                    :src="imageLink(item.product)"
                    alt="Ảnh sản phẩm"
                  />
                  <span class="d-none d-lg-inline">{{
                    getNameString(item.product.name)
                  }}</span>
                </td>
                <td class="d-none d-lg-table-cell">
                  {{ getPriceString(item.product.price) }}đ
                </td>
                <td>x{{ item.quantity }}</td>
                <td>
                  {{ getPriceString(item.product.price * item.quantity) }}đ
                </td>
              </tr>
              <tr>
                <th class="d-none d-lg-table-cell" colspan="1"></th>
                <th colspan="2" style="vertical-align: middle">
                  Tổng giá trị sách mượn:
                </th>
                <td class="total-price" colspan="2">
                  {{ getPriceString(totalPrice) }}đ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div rowspan="5" class="d-flex justify-content-center align-items-center">
        <button class="edit-btn me-2" @click="onEdit">
          Chỉnh sửa thông tin
        </button>
        <button class="order-btn" @click="onSubmit">
          Xác nhận gửi yêu cầu mượn
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order.js';
import orderService from '@/services/order.service.js';
import cartService from '@/services/cart.service.js';
import * as yup from 'yup';
import Swal from 'sweetalert2';

const router = useRouter();
const store = useOrderStore();
const order = ref({
  user: {},
  orderItems: [],
});

function getPriceString(value) {
  return new Intl.NumberFormat('vi', {}).format(value);
}

function getNameString(value) {
  if (value.length > 60) {
    return value.slice(0, 60) + '...';
  }
  return value;
}

function getDateString(date) {
  const d = new Date(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function imageLink(product) {
  return `${import.meta.env.VITE_BACKEND_PRODUCT_IMAGE_URL}/${
    product.images[0]
  }`;
}

const totalPrice = computed(() => {
  return order.value.orderItems.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
});

function onEdit() {
  Swal.fire({
    title: 'Cập nhật thông tin',
    html: `
      <div >
        <div class="input-group">
          <label for="fullname" class="input-group-text">Họ tên</label>
          <input  style="color: black;" type="text" id="fullname" class="form-control" value="${order.value.fullname}">
        </div>
        <div class="input-group">
          <label for="telephone" class="input-group-text">Số điện thoại</label>
          <input style="color: black;" type="text" id="telephone" class="form-control" value="${order.value.telephone}">
        </div>
        <div class="input-group">
          <label for="shippingAddress" class="input-group-text">Địa chỉ</label>
          <input style="color: black;" type="text" id="shippingAddress" class="form-control" value="${order.value.shippingAddress}">
        </div>
      </div>
    `,
    confirmButtonText: 'Cập nhật',
    focusConfirm: false,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      const schema = yup.object().shape({
        fullname: yup.string().required('Vui lòng nhập họ tên!'),
        telephone: yup
          .string()
          .required('Vui lòng nhập số điện thoại!')
          .matches(
            /((09|03|07|08|05)+([0-9]{8})\b)/g,
            'Số điện thoại không hợp lệ.',
          ),
        shippingAddress: yup.string().required('Vui lòng nhập địa chỉ!'),
      });
      const fullname = Swal.getPopup().querySelector('#fullname').value;
      const telephone = Swal.getPopup().querySelector('#telephone').value;
      const shippingAddress =
        Swal.getPopup().querySelector('#shippingAddress').value;

      try {
        const result = await schema.validate(
          { fullname, telephone, shippingAddress },
          { abortEarly: true },
        );

        order.value.fullname = result.fullname;
        order.value.telephone = result.telephone;
        order.value.shippingAddress = result.shippingAddress;

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật thông tin thành công!',
        });
      } catch (error) {
        Swal.showValidationMessage(error.errors[0]);
      }
    },
  });
}

async function onSubmit() {
  if (
    !order.value.fullname ||
    !order.value.telephone ||
    !order.value.shippingAddress
  ) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Vui lòng nhập đầy đủ thông tin!',
    });
    return;
  }
  const result = await Swal.fire({
    title: 'Xác nhận gửi yêu cầu mượn sách',
    text: 'Bạn có chắc chắn muốn gửi yêu cầu mượn sách?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) {
    return;
  }

  const data = {
    fullname: order.value.fullname,
    telephone: order.value.telephone,
    shippingAddress: order.value.shippingAddress,
    user: order.value.user._id,
    orderItems: order.value.orderItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    })),
  };

  const response = await orderService.createOrder(data);

  if (response.status === 'success') {
    order.value.orderItems.forEach(async (item) => {
      await cartService.removeFromCart(item.cartId);
    });

    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: response.message || 'Yêu cầu mượn thành công!',
    });
    router.push({ name: 'order-page' });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: response.message || 'Yêu cầu mượn thất bại!',
    });
  }
}

onBeforeMount(async () => {
  order.value = await store.getOrder();

  function checkOrderValid() {
    if (order.value.orderItems.length === 0) {
      return false;
    }

    order.value.orderItems.forEach((item) => {
      if (item.product.quantity === 0 || item.quantity === 0) {
        return false;
      }
    });

    return true;
  }

  if (!checkOrderValid()) {
    Swal.fire({
      icon: 'error',
      title: 'Thất bại',
      text: 'Thông tin mượn sách không hợp lệ! Vui lòng thử lại!',
    });
    router.push({ name: 'home-page' });
  }
});
</script>

<style scoped>
.page {
  margin: 0 auto;
}

.order-info {
  margin-bottom: 20px;
  padding: 20px 15px 10px 15px;
  border: 1px solid #e9e9e9;
  box-shadow: 2px 2px 5px #ccc;
}

.order-item:hover {
  background-color: #c96666;
}

.order-date {
  text-align: right;
  font-style: italic;
  font-size: 0.8em;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.total-price {
  font-weight: bold;
  color: var(--color-secondary);
  font-size: 1.2em;
}

.edit-btn,
.order-btn {
  border-radius: 0;
  background-color: #fff;
  padding: 5px 10px;
}

.edit-btn {
  border: 1px solid var(--color-secondary);
  background-color: rgba(255, 218, 155, 0.141);
  color: var(--color-secondary);
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: #fff;
}

.order-btn {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
  color: #fff;
  transition: all 0.3s;
}

.order-btn:hover {
  opacity: 0.7;
}
</style>

