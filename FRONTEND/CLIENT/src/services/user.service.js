import createApiClient from '@/services/api.service';

class UserService {
  constructor(baseURL = '/api/v1/users') {
    this.api = createApiClient(baseURL);
  }

  async login(data) {
    try {
      const response = await this.api.json.post('/login', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async register(data) {
    try {
      const response = await this.api.json.post('/signup', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async logout() {
    try {
      const response = await this.api.json.post('/logout');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async forgotPassword(data) {
    try {
      const response = await this.api.json.post('/forgotPassword', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async resetPassword(resetToken, data) {
    try {
      const response = await this.api.json.patch(
        `/resetPassword/${resetToken}`,
        data,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async activeAccount(activeToken) {
    try {
      const response = await this.api.json.patch(`/active/${activeToken}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePassword(data) {
    try {
      const response = await this.api.json.patch('/updatePassword', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getMe() {
    try {
      const response = await this.api.json.get('/me');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateMe(data) {
    try {
      const response = await this.api.json.patch('/me', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteMe() {
    try {
      const response = await this.api.json.delete('/me');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllUsers(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getUser(userId) {
    try {
      const response = await this.api.json.get(`/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createUser(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateUser(userId, data) {
    try {
      const response = await this.api.json.patch(`/${userId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await this.api.json.delete(`/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new UserService();

