import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { initConfig } from './utils/config';

const app = createApp(App);

app.use(router);

// Initialize configuration
initConfig();

app.mount('#app')
