// http.ts
import axios from 'axios'
import { message, notification } from 'ant-design-vue';
import qs from 'qs';
import { LOCAL_TOKEN_KEY, HTTP_TOKEN_KEY, API_BASE_URL } from './const';
export const http = axios.create({
  // 配置
  baseURL: API_BASE_URL,
  headers: {
    Authorization: localStorage.getItem(LOCAL_TOKEN_KEY) || ''
  },
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
  if ('get' !== response.config.method) {
    message.success(`操作成功!`);
  }
  return response;
}, function (error) {
  message.error(`操作失败, ${error.response.data}`);
  return Promise.reject(error);
});

/**
 * 存储token
 * @param token 凭证 
 */
export const setHttpToken = (token: string) => {
  // token存储到本地的key
  localStorage.setItem(LOCAL_TOKEN_KEY, token);
  // 设置header中的token
  http.defaults.headers.common[HTTP_TOKEN_KEY] = token;
};

/**
 * 清空token
 */
export function clearHttpToken() {
  localStorage.removeItem(LOCAL_TOKEN_KEY);
  http.defaults.headers.common[HTTP_TOKEN_KEY] = '';
}