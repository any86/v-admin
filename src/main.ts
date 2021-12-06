import { createApp } from 'vue'
import { Store } from 'vuex'
import {AxiosInstance} from 'axios';
import App from './App.vue'
// 这里router.ts可以省略ts
import router from './router'
import store, { State } from './store';
import { http } from './http'
// 加载UI库, 引入后组件会被全局注册, 我们在任意组件内都可以直接使用
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

// 为 `this.$store` 提供类型声明
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $store: Store<State>
    }
}

// 为 `this.$http` 提供类型声明
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $http: AxiosInstance;
    }
}

const app = createApp(App);
app.use(router);
app.use(store);
// 加载UI
app.use(Antd);
// 组件内可以使用this.$http表示http变量(axios)
app.config.globalProperties.$http = http;
// 挂载vue的根组件到id为app的元素
app.mount('#app');