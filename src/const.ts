import { type MenuTheme } from 'ant-design-vue';

// localStorage中存储token的键值
export const LOCAL_TOKEN_KEY = 'vue-admin-token';
// axios发送http请求时, header中token的键值
export const HTTP_TOKEN_KEY = 'Authentication';
// 接口网址的相同部分
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const MENU_THEME: MenuTheme = 'dark';// light

// 是否开启顶部的跟菜单
// 开启后左侧菜单变成二级菜单
export const USE_HEADER_ROOT_MENU = true
