import { createApp } from 'vue'
import { Store } from 'vuex'
import {AxiosInstance} from 'axios';
import App from './App.vue'
// 这里router.ts可以省略ts
import router from './router'
import store from './store';
import { http } from './http'
// 加载UI库, 引入后组件会被全局注册, 我们在任意组件内都可以直接使用
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@5a.css/reset';
import '@5a.css/helpers';

const app = createApp(App);
app.use(router);
app.use(store);
// 加载UI
app.use(Antd);
// 组件内可以使用this.$http表示http变量(axios)
app.config.globalProperties.$http = http;
// 挂载vue的根组件到id为app的元素
app.mount('#app');