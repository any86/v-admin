// http.ts
import axios from 'axios'
import { message } from 'ant-design-vue';
import { API_BASE_URL } from './const';
export const http = axios.create({
  // 配置
  baseURL: API_BASE_URL,
});

http.interceptors.request.use(function (config) {
  // config.data.array  = [1,2,3]
  // config.data = qs.stringify(config.data, { arrayFormat: 'comma' });
  return config;
}, function (error) {
  return Promise.reject(error);
});


// 响应拦截
http.interceptors.response.use(function (response) {
  if ('get' !== response.config.method && '/auth' !== response.config.url) {
    message.success(`操作成功!`);
  }
  return response;
}, function (error) {
  message.error(`操作失败,请联系管理员`);
  return Promise.reject(error);
});