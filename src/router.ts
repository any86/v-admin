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
        path: '/',
        component: () => import('./components/Layout.vue'),
        children: [
            {
                name: 'Home',
                path: '/',
                component: () => import('./views/Home.vue'),
            },
            {
                name: 'User',
                path: '/system/user',
                component: () => import('./views/User.vue'),
            },
            {
                name: 'Menu',
                path: '/system/menu',
                component: () => import('./views/Menu.vue'),
            },
        ]
    },
    {
        name: 'UnAuth',
        path: '/un-auth',
        component: () => import('./views/UnAuth.vue'),
    },
    ],
});


export default router;