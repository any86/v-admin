import { createRouter, createWebHashHistory } from 'vue-router';
import Login from './views/Login.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes:[{
        path:'/login',
        component:Login,
    },
    {
        path:'/',
        component:()=>import('./views/Home.vue'),
    }],
})
export default router;