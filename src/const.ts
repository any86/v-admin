// localStorage中存储token的键值
export const LOCAL_TOKEN_KEY = 'vue-admin-token';
// axios发送http请求时, header中token的键值
export const HTTP_TOKEN_KEY = 'Authorization';
// 接口网址的相同部分
export const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:4523/mock/486559/api/' : 'https://realApi.com/';