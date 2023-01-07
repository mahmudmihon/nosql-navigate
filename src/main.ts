import { createApp } from "vue";
import { router } from './router/index';
import { createPinia } from 'pinia';
import App from "./App.vue";
import "./style.css";

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount("#app");
