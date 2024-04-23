import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';

import '@/assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';

const pinia = createPinia();
const app = createApp(App);

// Pinia config
app.use(pinia);

// Router config
app.use(router);

// Handling error
app.config.errorHandler = (error, vm, info) => {
  console.log(`Error: ${error.toString()}\nInfo: ${info}`);
};

// Mount app
app.mount('#app');

