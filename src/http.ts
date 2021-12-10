// http.ts
import axios from 'axios'
import { LOCAL_TOKEN_KEY, HTTP_TOKEN_KEY, API_BASE_URL } from './const';
export const http = axios.create({
  // 配置
  baseURL: API_BASE_URL,
  headers: {
    Authorization: localStorage.getItem(LOCAL_TOKEN_KEY) || ''
  },
});

http.interceptors.response.use()
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