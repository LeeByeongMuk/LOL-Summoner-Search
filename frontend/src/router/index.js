import Vue from 'vue';
import VueRouter from 'vue-router';

// search
import Search from '@/views/search/Search';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Search',
        component: Search
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;
