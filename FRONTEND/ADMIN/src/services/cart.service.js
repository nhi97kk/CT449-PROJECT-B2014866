import createApiClient from '@/services/api.service';

class CartService {
  constructor(baseURL = '/api/v1/carts') {
    this.api = createApiClient(baseURL);
  }

  async getCart() {
    try {
      const response = await this.api.json.get('/');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async addToCart(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateCart(cartItemId, data) {
    try {
      const response = await this.api.json.patch(`/${cartItemId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async removeFromCart(cartItemId) {
    try {
      const response = await this.api.json.delete(`/${cartItemId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new CartService();

