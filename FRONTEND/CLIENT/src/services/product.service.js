import createApiClient from '@/services/api.service';
import slugify from 'slugify';

class ProductService {
  constructor(baseURL = '/api/v1/products') {
    this.api = createApiClient(baseURL);
  }

  async getAllProducts(query) {
    try {
      const params = new URLSearchParams({
        ...query,
        'stockQuantity[$gt]': 0,
      }).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createProduct(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createProductImages(productId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${productId}/images`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getProduct(productId) {
    try {
      const response = await this.api.json.get(`/${productId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getProductImage(imageId) {
    try {
      const response = await this.api.json.get(`/images/${imageId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateProduct(productId, data) {
    try {
      const response = await this.api.json.patch(`/${productId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await this.api.json.delete(`/${productId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteProductImage(productId, imageId) {
    try {
      const response = await this.api.json.delete(
        `/${productId}/images/${imageId}`,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchProducts(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ProductService();

