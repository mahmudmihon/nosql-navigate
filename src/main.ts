import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import ToastService from 'primevue/toastservice';
import HomePageVue from './components/Dashboard/HomePage.vue';
import ConnectionInterfaceView from './components/ConnectionInterface/ConnectionInterface.vue';
import { createRouter, createMemoryHistory  } from 'vue-router'

const routes = [
    { name: '', path: '/', component: ConnectionInterfaceView },
    { name: 'Dashboard', path: '/dashboard', component: HomePageVue }
];

const router = createRouter({
    history: createMemoryHistory(), routes
});

createApp(App).use(router).use(PrimeVue).use(ToastService).mount("#app");
