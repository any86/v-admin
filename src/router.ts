import { createRouter, createWebHashHistory } from 'vue-router';


import Login from './views/Login.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: 'Login',
        path: '/login',
        component: Login,
    },
    {
        name: 'Home',
        path: '/',
        component: () => import('./views/Home.vue'),
    },
    {
        name: 'UnAuth',
        path: '/un-auth',
        component: () => import('./views/UnAuth.vue'),
    },
    // { path: '/:pathMatch(.*)*', name: '404', component: () => import('./views/404.vue') },

    ],
});


export default router;