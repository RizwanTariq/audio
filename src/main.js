import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import veeValidatePlugin from './plugins/validation';
import { auth } from './plugins/firebase';
import './assets/tailwind.css';
import './assets/css/main.css';
import i18n from './plugins/i18n';

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(i18n);
    app.use(store);
    app.use(router);
    app.use(veeValidatePlugin);
    app.mount('#app');
  }
});
