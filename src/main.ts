import { createApp } from 'vue'
import './assets/fonts.css'
import './style.css'
import App from './App.vue'
import router from './router';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { initConfig } from './utils/config';

// Version réellement chargée par le navigateur (utile avec un cache)
console.info(`SilverTransfert front v${__APP_VERSION__} (${__APP_COMMIT__})`);

const app = createApp(App);

app.use(router);

// Initialize configuration
initConfig();

app.mount('#app')
