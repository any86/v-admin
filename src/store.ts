import { createStore } from 'vuex';
import { defineStore } from 'pinia'
import arr2tree from '@any86/array-to-tree';
import { MENU_THEME } from '@/const';
import { http } from '@/http';
// state数据
const state = {
  MENU_THEME,
  isLoadingMenu: false,
  menuTree: [] as KV<any>[],
  menuList: [] as KV<any>[],
  menuIdAndMenuPidMap: {} as KV<string>,
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
    async getMenu() {
      // const { commit } = context;
      // commit('setMenuLoading', true);
      // const { data } = await http.get('/global/menu');
      // // 存储列表到store
      // commit('setMenuList', data);
      // const menuTree = arr2tree(data, {
      //   KEY_ID: 'id',
      //   KEY_PID: 'pid',
      //   transform: (node) => {
      //     if (node.id) {
      //       if (node.pid) commit('setmenuIdAndMenuPidMap', [node.id, node.pid]);
      //     }
      //     // node.name = node.name;
      //     return node;
      //   },
      // });
      // // 存储树到store
      // commit('setMenuTree', menuTree);
      // commit('setMenuLoading', false);
    },

    setMenuLoading(isLoading: boolean) {
      this.isLoadingMenu = isLoading;
    },
    /**
     * {id:pid}映射
     * @param state
     * @param [id,pid]
     */
    setmenuIdAndMenuPidMap([id, pid]: [string, string]) {
      this.menuIdAndMenuPidMap[id] = pid;
    },

    setMenuTree(menuTree: KV<any>[]) {
      this.menuTree = menuTree;
    },

    setMenuList(menuList: KV<any>[]) {
      this.menuList = menuList;
    },

    toggleMenuTheme() {
      this.MENU_THEME = 'dark' === this.MENU_THEME ? 'light' : 'dark';
    },

    /**
     * 设置用户信息
     * @param state 状态
     * @param userInfo 用户信息
     */
    setUserInfo(userInfo: State['userInfo']) {
      this.userInfo = userInfo;
    },
  },
});


// 创建一个新的 store 实例
export default createStore<State>({
  state() {
    return state;
  },

  mutations: {
    setMenuLoading(state, isLoading) {
      state.isLoadingMenu = isLoading;
    },
    /**
     * {id:pid}映射
     * @param state
     * @param [id,pid]
     */
    setmenuIdAndMenuPidMap(state, [id, pid]) {
      state.menuIdAndMenuPidMap[id] = pid;
    },

    setMenuTree(state, menuTree) {
      state.menuTree = menuTree;
    },

    setMenuList(state, menuList) {
      state.menuList = menuList;
    },

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

  actions: {
    async getMenu(context) {
      const { commit } = context;
      commit('setMenuLoading', true);
      const { data } = await http.get('/global/menu');
      // 存储列表到store
      commit('setMenuList', data);
      const menuTree = arr2tree(data, {
        KEY_ID: 'id',
        KEY_PID: 'pid',
        transform: (node) => {
          if (node.id) {
            if (node.pid) commit('setmenuIdAndMenuPidMap', [node.id, node.pid]);
          }
          // node.name = node.name;
          return node;
        },
      });
      // 存储树到store
      commit('setMenuTree', menuTree);
      commit('setMenuLoading', false);
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
