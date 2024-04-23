import axios from 'axios';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
};

const formDataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
  withCredentials: true,
};

export default (baseURL) => {
  return {
    json: axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}${baseURL}`,
      ...commonConfig,
    }),
    formData: axios.create({
      baseURL: `${import.meta.env.VITE_BACKEND_URL}${baseURL}`,
      ...formDataConfig,
    }),
  };
};

