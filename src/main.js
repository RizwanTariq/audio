import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import veeValidatePlugin from './plugins/validation';
import './assets/tailwind.css';
import './assets/css/main.css';

createApp(App).use(store).use(router).use(veeValidatePlugin).mount('#app');
