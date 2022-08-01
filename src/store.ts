import { createStore } from 'vuex';
import { defineStore } from 'pinia'
import { MENU_THEME } from '@/const';
// state数据
const state = {
  MENU_THEME,
  userInfo: {
    // 用户名
    userName: '',
    // 头像
    avatar: '',
  },
};

// state的类型
export type State = typeof state;




export const store = defineStore('main', {
  state: () => state,

  actions: {
  },
});


// 创建一个新的 store 实例
export default createStore<State>({
  state() {
    return state;
  },

  mutations: {
    toggleMenuTheme(state) {
      state.MENU_THEME = 'dark' === state.MENU_THEME ? 'light' : 'dark';
    },
    /**
     * 设置用户信息
     * @param state 状态
     * @param userInfo 用户信息
     */
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
});

/**
 * 根据id生成到根的路径
 * @param menuId
 * @returns 路径
 */
// export function findMenuPath(menuId: string | number) {
//   const path = [];
//   const pMap: { [k: string]: any } = {};
//   for (const menu of state.menuList) {
//     pMap[menu.menuId] = menu.menuParentid;
//   }
//   let currentId = menuId;
//   while (void 0 !== currentId) {
//     path.unshift(currentId);
//     currentId = pMap[currentId];
//   }
//   // 删除掉当前
//   return path;
// }
