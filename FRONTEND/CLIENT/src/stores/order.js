import { ref } from 'vue';
import { defineStore } from 'pinia';
import userServce from '@/services/user.service.js';
import Swal from 'sweetalert2';

export const useOrderStore = defineStore('order', () => {
  const order = ref({
    user: {},
    orderItems: [],
  });

  async function createOrder(data) {
    try {
      const response = await userServce.getMe();

      if (response.status === 'success') {
        order.value.user = response.data.user;
        order.value.shippingAddress = order.value.user.diachi || '';
        order.value.telephone = order.value.user.dienthoai || '';
        order.value.fullname = order.value.user.ten || '';
        order.value.orderItems = data;

        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thất bại',
          text: response.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      });
      return false;
    }
  }

  function getOrder() {
    return order.value;
  }

  return { order, createOrder, getOrder };
});

