import { createStore } from 'vuex'

// state数据
const state = {
  userInfo: {
    // 用户名
    userName: '',
    // 头像
    avatar: '',
  }
}

// state的类型
export type State = typeof state;

// 创建一个新的 store 实例
export default createStore<State>({
  state() {
    return state;
  },

  mutations: {
    /**
     * 设置用户信息
     * @param state 状态
     * @param userInfo 用户信息
     */
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  }
})