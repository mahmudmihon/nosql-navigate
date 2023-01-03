import { createApp } from "vue";
import { router } from './router/index';
import App from "./App.vue";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import "./style.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

createApp(App)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .mount("#app");
