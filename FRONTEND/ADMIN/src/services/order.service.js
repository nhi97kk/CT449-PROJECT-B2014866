import createApiClient from '@/services/api.service';

class OrderService {
  constructor(baseURL = '/api/v1/orders') {
    this.api = createApiClient(baseURL);
  }

  async getAllOrders(query) {
    try {
      const response = await this.api.json.get('', { params: query });
      return response.data;
    } catch (err) {
      console.log(err);
      return err.response.data;
    }
  }

  async getOrder(orderId) {
    try {
      const response = await this.api.json.get(`/${orderId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createOrder(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await this.api.json.delete(`/${orderId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateOrderStatus(orderId, data) {
    try {
      const response = await this.api.json.patch(`/${orderId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deliverOrder(orderId) {
    try {
      const response = await this.api.json.post(`/${orderId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new OrderService();

