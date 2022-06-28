import { createStore } from 'vuex';
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
      const { data } = await http.get('/orgMenu/getCurrentUserMenu');
      // 存储列表到store
      commit('setMenuList', data.one);
      const menuTree = arr2tree(data.one, {
        KEY_ID: 'menuId',
        KEY_PID: 'menuParentid',
        transform: (node) => {
          if (node.menuId) {
            if (node.menuParentid) commit('setmenuIdAndMenuPidMap', [node.menuId, node.menuParentid]);
          }
          node.name = node.menuName;
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
export function findMenuPath(menuId: string | number) {
  const path = [];
  const pMap: { [k: string]: any } = {};
  for (const menu of state.menuList) {
    pMap[menu.menuId] = menu.menuParentid;
  }
  let currentId = menuId;
  while (void 0 !== currentId) {
    path.unshift(currentId);
    currentId = pMap[currentId];
  }
  // 删除掉当前
  return path;
}
