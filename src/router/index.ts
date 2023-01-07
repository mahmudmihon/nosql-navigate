import DashboardInterfaceVue from '../components/DashboardInterface/DashboardInterface.vue';
import ConnectionInterfaceVue from '../components/ConnectionInterface/ConnectionInterface.vue';
import DatabasesSummaryVue from '../components/DatabasesSummary/DatabasesSummary.vue';
import CollectionTabsVue from '../components/CollectionTabs/CollectionTabs.vue';
import { createRouter, createMemoryHistory  } from 'vue-router';

const routes = [
    { name: '', path: '/', component: ConnectionInterfaceVue },
    { 
        path: '/dashboard', 
        component: DashboardInterfaceVue,
        children: [
            {
                path: '',
                component: DatabasesSummaryVue
            },
            {
                path: '/collection-tabs',
                component: CollectionTabsVue
            }
        ]
    }  
];

export const router = createRouter({
    history: createMemoryHistory(), routes
});