import ConnectionInterface from '../components/Common/ConnectionInterface/ConnectionInterface.vue';
import { createRouter, createMemoryHistory  } from 'vue-router';
import MongoDashboardInterface from '../components/MongoDB/MongoDashboardInterface/MongoDashboardInterface.vue';
import MongoDatabasesSummary from '../components/MongoDB/MongoDatabasesSummary/MongoDatabasesSummary.vue';
import MongoCollectionTabs from '../components/MongoDB/MongoCollectionTabs/MongoCollectionTabs.vue';

const routes = [
    { name: '', path: '/', component: ConnectionInterface },
    { 
        path: '/mongoDB', 
        component: MongoDashboardInterface,
        children: [
            {
                path: '',
                component: MongoDatabasesSummary
            },
            {
                path: '/collection-tabs',
                component: MongoCollectionTabs
            }
        ]
    }  
];

export const router = createRouter({
    history: createMemoryHistory(), routes
});