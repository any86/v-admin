import { createApp } from 'vue'
import App from './App.vue'
// 这里router.ts可以省略ts
import router from './router'
import store from './store';
import { http } from './http';
import vGate from 'v-gate';
// 加载UI库, 引入后组件会被全局注册, 我们在任意组件内都可以直接使用
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@/theme.less';
import '@5a.css/reset';
import '@5a.css/helpers';
import '@/assets/iconfont/iconfont.css'


const app = createApp(App);
app.use(router);
let permissionRoutes: null | string[] = null;
vGate({
    router,

    axios: http,

    component404: () => import('@/views/404.vue'),

    async isAuth(to) {
        if (null === permissionRoutes) {
            await http.get('/permission').then(data => {
                permissionRoutes = data.data.routes;
            })
        }
        return permissionRoutes!.some(path => path === to.matched[to.matched.length - 1].path)
        const { status } = await http.post('/auth', to.path);
        return 200 == status;
    },
});



app.use(store);
// 加载UI
app.use(Antd);
// 组件内可以使用this.$http表示http变量(axios)
app.config.globalProperties.$http = http;
// 挂载vue的根组件到id为app的元素
app.mount('#app');