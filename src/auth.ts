import type { RouteLocationNormalized, Router } from 'vue-router';
import type { Component } from 'vue';
import { AxiosInstance } from 'axios';
import progress from 'nprogress'
import 'nprogress/nprogress.css'

interface Options {
    tokenName?: string;
    pathLogin?: string;
    httpTokenName?: string;
    // 不需要验证的路径
    whiteList?: string[];
    onNoToken?: () => void;
    onError?: (error: unknown) => void;
    path404?: string;
    router: Router;
    axios: AxiosInstance;
    isAuth: (to: RouteLocationNormalized, token?: string) => boolean | Promise<boolean>;
    component404: Component;
}
const NOOP = () => void 0;
const NAME_404 = '404';

let LOCAL_TOKEN_NAME = '__auth__token';
let HTTP_TOKEN_NAME = 'Authorization';
let http: AxiosInstance;

/**
 * 默认值
 */
const DEFAULT_OPTIONS = {
    onNoToken: NOOP,
    onError: NOOP,
    tokenName: LOCAL_TOKEN_NAME,
    httpTokenName: HTTP_TOKEN_NAME,
    pathLogin: '/login',
    path404: '/404',
    whiteList: ['/error', '/404', '/success', '/fail',],
}


/**
 * 路由权限验证
 * @param options 
 */
export default function (options: Options) {
    const { router, axios, whiteList, pathLogin, path404, isAuth, onNoToken, onError, component404, tokenName, httpTokenName } = { ...DEFAULT_OPTIONS, ...options };
    whiteList.push(pathLogin);
    // 修改配置
    http = axios;
    LOCAL_TOKEN_NAME = tokenName;
    HTTP_TOKEN_NAME = httpTokenName;
    if (component404) {
        router.addRoute({ path: '/:pathMatch(.*)*', name: NAME_404, component: component404 },)
    }

    router.onError(() => {
        router.push({ name: NAME_404 });
    });

    router.beforeEach(async (to) => {
        progress.start();
        // console.log(to);
        const token = getToken();
        setHttpToken(token);
        // 需要验证的路由
        if (!whiteList.includes(to.path)) {
            // 是否有token
            // 无token, 跳转到登陆页面
            if (!token) {
                onNoToken();
                return { path: pathLogin };
            }

            // 用isAuth校验路由
            // 验证不通过跳转到404页面
            try {
                if (NAME_404 !== to.name && !await isAuth(to, token)) {
                    throw 0;
                }
            } catch (error) {
                onError(error);
                router.replace({ path: path404 });
            }
        }
    });

    router.afterEach(() => {
        progress.done();
    });

    // 响应拦截
    http.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            router.push({ path: pathLogin });
        }
        return Promise.reject(error);
    });

    return { progress };
}

/**
 * 存储token
 * @param token 凭证 
 */
export const saveToken = (token: string) => {
    // token存储到本地的key
    localStorage.setItem(LOCAL_TOKEN_NAME, token);
    // 设置header中的token
    setHttpToken(token);
};

/**
 * 清空token
 */
export function clearToken() {
    localStorage.removeItem(LOCAL_TOKEN_NAME);
    Reflect.deleteProperty(http.defaults.headers.common, HTTP_TOKEN_NAME);
}

export const logout = clearToken;

/**
 * 获取token
 * @returns token
 */
export function getToken() {
    return localStorage.getItem(LOCAL_TOKEN_NAME) || ''
}

/**
 * 设置header中的token
 * @param token 
 */
function setHttpToken(token: string) {
    http.defaults.headers.common[HTTP_TOKEN_NAME] = token;
}