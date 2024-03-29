<script lang="ts">
import { defineComponent } from 'vue';
import { toggleFull } from 'be-full';
import {
  CaretDownOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
import Notices from './Layout/Notices.vue';
import Menu from './Layout/Menu.vue';
import { logout } from 'vue-auth-gate';

export default defineComponent({
  name: 'Layout',

  components: {
    CaretDownOutlined,
    SettingOutlined,
    UserOutlined,
    FullscreenOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,LogoutOutlined,
    Notices,
    Menu,
  },

  data() {
    return {
      name: '',
      avatar: '',
      collapsed: false,
    };
  },

  computed: {
    sideOffsetX(): string {
      return (this.collapsed ? 80 : 200) + 'px';
    },
  },

  async mounted() {
    const { data } = await this.$http.get('/currentUser');
    this.name = data.name;
    this.avatar = data.avatar;
  },

  methods: {
    toggleFull() {
      toggleFull();
    },

    /**
     * 切换菜单的折叠/展开
     */
    collapseMenu() {
      this.collapsed = !this.collapsed;
    },

    logout() {
      const ref = this.$route.fullPath;
      this.$router.push({ path: '/login', query: { ref } });
      logout();
    },
  },
});
</script>

<template>
  <a-layout style="minheight: 100vh">
    <a-layout-sider
      class="side"
      :style="{ background: 'dark' === $store.state.MENU_THEME ? '' : '#fff' }"
      v-model:collapsed="collapsed"
    >
      <div class="logo" :style="{ color: 'dark' === $store.state.MENU_THEME ? '#fff' : '#000' }">
        <span v-show="!collapsed" @click="$router.push('/')">
          <p class="font-3" align="center">vue-admin</p>
        </span>
      </div>

      <!-- 菜单 -->
      <Menu />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header" :style="{ paddingLeft: sideOffsetX }">
        <menu-unfold-outlined v-if="collapsed" class="font-1 ml-3" @click="collapseMenu" />
        <menu-fold-outlined v-else class="font-1 ml-3" @click="collapseMenu" />

        <a-space class="header__content">
          <!-- <a-switch
            checked-children="暗"
            un-checked-children="亮"
            :checked="'dark' === $store.state.MENU_THEME"
            @change="$store.commit('toggleMenuTheme')"
          ></a-switch> -->

          <!-- 全屏按钮 -->
          <a class="btn-full" title="全屏" @click="toggleFull">
            <FullscreenOutlined class="icon-lg" />
          </a>

          <!-- 通知 -->
          <notices />

          <!-- 用户头像 -->
          <a-dropdown>
            <span v-if="name" class="avatar">
              <img :src="avatar"/>
              <span>{{ name }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a><SettingOutlined /> 个人信息</a>
                </a-menu-item>
                <a-menu-item>
                  <a><UserOutlined /> 系统设置</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="logout">
                  <a><LogoutOutlined /> 退出登陆</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content" :style="{ marginLeft: sideOffsetX }">
        <router-view v-slot="{ Component,route }">
          <transition name="slide-right" mode="out-in">
            <keep-alive :max="10">
              <component :is="Component" :key="route.path"/>
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scope>
.slide-right-enter-active,
.slide-right-leave-active {
  will-change: transform;
  transition: all 0.2s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-2%);
}

.header {
  position: fixed;
  z-index: 86;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 5px rgba(#000, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: padding 200ms;
  // 按钮通用样式
  .btn {
    display: block;
    padding: 0 16px;
    &:hover {
      cursor: pointer;
      background: #eee;
    }
  }

  .icon-lg {
    font-size: 20px;
  }

  .btn-full {
    @extend .btn;
  }

  .btn-bell {
    @extend .btn;
  }

  .avatar {
    display: flex;
    align-items: center;
    @extend .btn;
    img {
      display: block;
      height: 28px;
      width: 28px;
    }
    span {
      margin-left: 12px;
      font-size: 15px;
    }
  }
}

.side {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100%;
  box-shadow: 2px 0 5px rgba(#000, 0.1);

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    .logo {
      margin: 16px;
      display: flex;
      align-items: center;

      img {
        margin: auto;
        display: block;
      }
      span {
        flex: 1;
        padding-left: 4px;
        font-size: 20px;
        letter-spacing: 1px;
      }
    }
  }
}

.content {
  transition: margin 200ms;
  margin-top: 64px;
  padding: 24px;
  &--grow {
    margin-left: 40px;
  }
}
</style>
