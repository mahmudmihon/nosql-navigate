import DashboardInterface from '../components/DashboardInterface/DashboardInterface.vue';
import ConnectionInterface from '../components/ConnectionInterface/ConnectionInterface.vue';
import DatabasesSummary from '../components/DatabasesSummary/DatabasesSummary.vue';
import CollectionTabs from '../components/CollectionTabs/CollectionTabs.vue';
import { createRouter, createMemoryHistory  } from 'vue-router';

const routes = [
    { name: '', path: '/', component: ConnectionInterface },
    { 
        path: '/dashboard', 
        component: DashboardInterface,
        children: [
            {
                path: '',
                component: DatabasesSummary
            },
            {
                path: '/collection-tabs',
                component: CollectionTabs
            }
        ]
    }  
];

export const router = createRouter({
    history: createMemoryHistory(), routes
});