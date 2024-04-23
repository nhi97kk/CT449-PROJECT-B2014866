<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'order-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Trở lại
      </router-link>
    </div>
    <div class="container px-5 py-3 page">
      <legend class="form-title">Thông tin mượn</legend>
      <div class="mb-3 form-group">
        <table class="table">
          <tbody>
            <tr>
              <th>Mã mượn:</th>
              <td>{{ order._id }}</td>
            </tr>
            <tr>
              <th>Mã người mượn:</th>
              <td>{{ order.user._id }}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>Họ và tên:</th>
              <td>{{ order.fullname }}</td>
            </tr>
            <tr>
              <th>Địa chỉ người mượn:</th>
              <td>{{ order.shippingAddress }}</td>
            </tr>
            <tr>
              <th>Số điện thoại liên hệ:</th>
              <td>{{ order.telephone }}</td>
            </tr>
            <tr>
              <th>Hạn trả dự kiến:</th>
              <td>{{ getTimeString(order.endDate) }}</td>
            </tr>
          </tbody>
        </table>
        <h4 class="mt-3">
          Chi tiết:
          <span style="font-size: 10px; color: green">
            (*) Nhấn vào tên sản phẩm để sao chép
          </span>
        </h4>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Giá trị</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Tổng giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.orderItems" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
              <td
                @click="copyToCliboard(item.product.name)"
                style="cursor: pointer"
              >
                {{ getNameString(item.product.name) }}
              </td>
              <td>{{ getPriceString(item.price) }}đ</td>
              <td>{{ item.quantity }}</td>
              <td>{{ getPriceString(item.price * item.quantity) }}đ</td>
            </tr>
            <tr>
              <th colspan="2"></th>
              <th colspan="2">Tổng giá trị mượn:</th>
              <td>{{ getPriceString(order.totalPrice) }}đ</td>
            </tr>
          </tbody>
        </table>
        <h4 class="mt-3">
          Trạng thái mượn:
          <span :class="currentStatusSpanClass">
            {{ getStatusString(order.currentStatus) }}
            <i :class="currentStatusIconClass"></i>
          </span>
        </h4>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày cập nhật</th>
              <th scoped="col">Người thực hiện</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(status, index) in order.status" :key="status._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ getStatusString(status.status) }}</td>
              <td>{{ getTimeString(status.updatedAt) }}</td>
              <td>{{ status.updatedBy?.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mb-3 form-group">
        <button
          class="btn btn-outline-primary btn-md"
          :disabled="confirmLoading"
          v-if="getNextStatusString"
          @click="onConfirm"
        >
          {{ getNextStatusString }}
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="confirmLoading"
          ></span>
        </button>
        <button
          class="btn btn-outline-danger btn-md ms-3"
          :disabled="removeLoading"
          v-if="order.currentStatus === 'pending'"
          @click="onCancel"
        >
          Hủy
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="removeLoading"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import orderService from '@/services/order.service';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const confirmLoading = ref(false);
const removeLoading = ref(false);
const isUpdated = ref(false);
const order = ref({
  user: {
    email: '',
  },
  orderItems: [],
  totalPrice: 0,
  currentStatus: '',
});

function getPriceString(value) {
  return new Intl.NumberFormat('vi', {}).format(value);
}

function getNameString(value) {
  if (value.length > 20) return value.slice(0, 20) + '...';
  return value;
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

const currentStatusIconClass = computed(() => {
  return {
    fas: true,
    'fa-solid fa-clock': order.value.currentStatus === 'pending',
    'fa-solid fa-check': order.value.currentStatus === 'accepted',
    'fa-solid fa-truck': order.value.currentStatus === 'shipping',
    'fa-solid fa-check-double': order.value.currentStatus === 'delivered',
    'fa-solid fa-xmark': order.value.currentStatus === 'cancelled',
  };
});

const currentStatusSpanClass = computed(() => {
  return {
    'badge rounded-pill': true,
    'text-warning': order.value.currentStatus === 'pending',
    'text-primary': order.value.currentStatus === 'accepted',
    'text-info': order.value.currentStatus === 'shipping',
    'text-success': order.value.currentStatus === 'delivered',
    'text-danger': order.value.currentStatus === 'cancelled',
  };
});

const getNextStatusString = computed(() => {
  if (order.value.currentStatus === 'pending') return 'Duyệt';
  if (order.value.currentStatus === 'accepted')
    return 'Đã giao sách cho người mượn';
  if (order.value.currentStatus === 'shipping') return 'Đã trả sách';
});

async function onConfirm() {
  confirmLoading.value = true;
  if (order.value.currentStatus === 'pending') {
    await onSubmit('accepted');
  } else if (order.value.currentStatus === 'accepted') {
    await onSubmit('shipping');
  } else if (order.value.currentStatus === 'shipping') {
    await onSubmit('delivered');
  }
  confirmLoading.value = false;
}

async function onCancel() {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc muốn hủy yêu cầu mượn? Sau khi hủy, yêu cầu mượn sẽ không thể khôi phục!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hủy yêu cầu mượn',
    cancelButtonText: 'Không',
  });

  if (result.isConfirmed) {
    const response = await orderService.cancelOrder(route.params.orderId);

    if (response.status === 'success') {
      await Swal.fire({
        title: 'Thành công',
        icon: 'success',
        text: 'Đã hủy yêu cầu mượn!',
      });
    } else {
      Swal.fire({
        title: 'Thất bại',
        icon: 'error',
        text: 'Hủy yêu cầu mượn thất bại! Vui lòng thử lại!',
      });
    }
  }
}

async function onSubmit(type) {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Bạn có chắc chắn muốn cập nhật trạng thái mượn?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    reverseButtons: false,
  });

  if (!result.isConfirmed) return;

  const response = await orderService.updateOrderStatus(route.params.orderId, {
    status: type,
  });

  if (response.status === 'success') {
    await Swal.fire({
      title: 'Thành công',
      text: response.message,
      icon: 'success',
    });
    isUpdated.value = true;
    router.push({ name: 'order-list' });
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
  }
}

onBeforeMount(async () => {
  const response = await orderService.getOrder(route.params.orderId);

  if (response.status === 'success') {
    order.value = response.data.order;
  } else {
    await Swal.fire({
      title: 'Thất bại',
      text: response.message,
      icon: 'error',
    });
    isUpdated.value = true;
    router.push({ name: 'order-list' });
  }
});

onBeforeRouteLeave(async () => {
  if (
    order.value.currentStatus !== 'pending' &&
    order.value.currentStatus !== 'accepted' &&
    order.value.currentStatus !== 'shipping'
  )
    return true;
  if (isUpdated.value) return true;
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: 'Thông tin chỉnh sửa chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang?',
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
.page {
  max-width: 1000px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
.title {
  font-weight: bold;
}
</style>

