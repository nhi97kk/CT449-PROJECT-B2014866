<template>
  <div class="container-fluid page text-start">
    <h2 class="form-title">Thông tin mượn sách</h2>
    <div class="mb-3 form-group">
      <table class="table">
        <tbody>
          <tr>
            <th>Mã mượn:</th>
            <td>{{ props.order._id }}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>
              {{ props.order.user?.email ? props.order.user.email : '' }}
            </td>
          </tr>
          <tr>
            <th>Họ và tên:</th>
            <td>{{ props.order.fullname }}</td>
          </tr>
          <tr>
            <th>Địa chỉ:</th>
            <td>{{ props.order.shippingAddress }}</td>
          </tr>
          <tr>
            <th>Số điện thoại:</th>
            <td>{{ props.order.telephone }}</td>
          </tr>
          <tr>
            <th>Hạn trả dự kiến:</th>
            <td>{{ getTimeString(props.order.endDate) }}</td>
          </tr>
        </tbody>
      </table>
      <h4 class="mt-3 d-none d-md-block">Chi tiết:</h4>
      <table class="table d-none d-md-block">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Sản phẩm</th>
            <th scope="col">Giá</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in props.order.orderItems" :key="item._id">
            <th scope="row">{{ index + 1 }}</th>
            <td
              @click="copyToCliboard(item.product.name)"
              style="cursor: pointer"
            >
              {{ getNameString(item.product.name) }}
            </td>
            <td>{{ getPriceString(item.price) }}đ</td>
            <td>x{{ item.quantity }}</td>
            <td>{{ getPriceString(item.price * item.quantity) }}đ</td>
          </tr>
          <tr>
            <th colspan="1"></th>
            <th class="text-end" colspan="2">Tổng giá trị:</th>
            <td class="text-center total-price" colspan="2">
              {{ getPriceString(props.order.totalPrice) }}đ
            </td>
          </tr>
        </tbody>
      </table>
      <h4 class="mt-3">
        Trạng thái mượn:
        <span :class="currentStatusSpanClass">
          {{ getStatusString(props.order.currentStatus) }}
          <i :class="currentStatusIconClass"></i>
        </span>
      </h4>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Ngày cập nhật</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, index) in props.order.status" :key="status._id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ getStatusString(status.status) }}</td>
            <td>{{ getTimeString(status.updatedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Swal from 'sweetalert2';

const props = defineProps(['order']);

function getPriceString(value) {
  return new Intl.NumberFormat('vi', {}).format(value);
}

function copyToCliboard(value) {
  navigator.clipboard.writeText(value);
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: 'success',
    title: 'Tên sản phẩm đã được sao chép!',
  });
}

function getStatusString(status) {
  if (status === 'pending') return 'Đang chờ duyệt';
  if (status === 'accepted') return 'Chờ nhận sách';
  if (status === 'shipping') return 'Đang mượn';
  if (status === 'delivered') return 'Đã trả';
  if (status === 'cancelled') return 'Đã hủy';
}

function getTimeString(date) {
  const d = new Date(date);
  return `${d.getHours()}giờ ${d.getMinutes()}phút ${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()}`;
}

function getNameString(name) {
  return name.length > 40 ? name.slice(0, 40) + '...' : name;
}

const currentStatusIconClass = computed(() => {
  return {
    fas: true,
    'fa-solid fa-clock': props.order.currentStatus === 'pending',
    'fa-solid fa-check': props.order.currentStatus === 'accepted',
    'fa-solid fa-truck': props.order.currentStatus === 'shipping',
    'fa-solid fa-check-double': props.order.currentStatus === 'delivered',
    'fa-solid fa-xmark': props.order.currentStatus === 'cancelled',
  };
});

const currentStatusSpanClass = computed(() => {
  return {
    'badge rounded-pill': true,
    'text-warning': props.order.currentStatus === 'pending',
    'text-primary': props.order.currentStatus === 'accepted',
    'text-info': props.order.currentStatus === 'shipping',
    'text-success': props.order.currentStatus === 'delivered',
    'text-danger': props.order.currentStatus === 'cancelled',
  };
});
</script>

<style scoped>
.description {
  font-size: 14px;
  height: 200px;
}
.title {
  font-weight: bold;
}

.total-price {
  font-weight: bold;
  color: var(--color-secondary);
}
</style>

