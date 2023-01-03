import DashboardInterfaceVue from '../components/DashboardInterface/DashboardInterface.vue';
import ConnectionInterfaceVue from '../components/ConnectionInterface/ConnectionInterface.vue';
import DatabaseStatsVue from '../components/DashboardInterface/DatabaseStats.vue';
import { createRouter, createMemoryHistory  } from 'vue-router'

const routes = [
    { name: '', path: '/', component: ConnectionInterfaceVue },
    { 
        path: '/dashboard', 
        component: DashboardInterfaceVue,
        children: [
            {
                path: '',
                component: DatabaseStatsVue
            }
        ]
     }
];

export const router = createRouter({
    history: createMemoryHistory(), routes
});