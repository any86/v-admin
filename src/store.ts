import { createStore } from 'vuex';
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

// 创建一个新的 store 实例
export default createStore({
  state() {
    return state;
  },

  mutations: {
    // toggleMenuTheme(state) {
    //   state.MENU_THEME = 'dark' === state.MENU_THEME ? 'light' : 'dark';
    // },
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