import { createStore } from 'vuex'

export interface State {
  // 用户信息
  userInfo: {
    // 昵称
    nickName: string;
    // 头像
    userAvatar: string;
  }
}

// 创建一个新的 store 实例
export default createStore<State>({
  state() {
    return {
      userInfo: {
        nickName: '',
        userAvatar: '',
      }

    }
  },

  mutations: {

  }
})