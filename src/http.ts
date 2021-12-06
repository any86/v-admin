// http.ts
import axios from 'axios'

export const http = axios.create({
  // 配置
  headers: {
    Authorization: localStorage.getItem('vue-admin-token') || ''
  },
});

/**
 * 存储token
 * @param token 凭证 
 */
export const setHttpToken = (token: string) => {
  // 这里key大家可以随意取, 尽量保证唯一性, 比如"项目名-token".
  localStorage.setItem('vue-admin-token', token);
  // 没法发送
  http.defaults.headers.common['Authorization'] = token;
};

/**
 * 清空token
 */
export function clearHttpToken() {
  localStorage.removeItem('vue-admin-token');
  http.defaults.headers.common['Authorization'] = '';
}