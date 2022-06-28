import { AxiosInstance } from 'axios';
import { Store } from 'vuex'
import { State } from './store'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    // 为 `this.$http` 提供类型声明
    $http: AxiosInstance;
    // 为 `this.$store` 提供类型声明
    $store: Store<State>
    // 环境变量, 是否dev模式
    $dev: boolean;
  }
}