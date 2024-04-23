import createApiClient from '@/services/api.service';
// import slugify from 'slugify';

class PublisherService {
  constructor(baseURL = '/api/v1/publishers') {
    this.api = createApiClient(baseURL);
  }

  async getAllPublishers(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPublisher(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPublisher(publisherId) {
    try {
      const response = await this.api.json.get(`/${publisherId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePublisher(publisherId, data) {
    try {
      const response = await this.api.json.patch(`/${publisherId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deletePublisher(publisherId) {
    try {
      const response = await this.api.json.delete(`/${publisherId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchPublishers(name) {
    try {
      const response = await this.api.json.get(`/search?tennxb=${name}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new PublisherService();
