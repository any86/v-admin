<script lang="ts">
import { defineComponent } from 'vue';
import { toggleFull } from 'be-full';
import { CaretDownOutlined, SettingOutlined, UserOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { http } from '@/http';
import Notices from './Layout/Notices.vue';
export default defineComponent({
  name: 'Layout',

  components: { CaretDownOutlined, SettingOutlined, UserOutlined, FullscreenOutlined, Notices },

  data() {
    return {
      name: '',
      avatar: '',
    };
  },

  async mounted() {
    const { data } = await http.get('/currentUser');
    this.name = data.name;
    this.avatar = data.avatar;
  },

  methods: {
    toggleFull,

    logout() {
      const ref = this.$route.fullPath;
      this.$router.push({ path: '/login', query: { ref } });
    },
  },
});
</script>

<template>
  <a-layout>
    <a-layout-sider class="side" collapsible :trigger="null">
      <div class="logo">
        <!-- <img width="36" src="@/assets/logo.png" /> -->
        <span>xxx</span>
      </div>
    </a-layout-sider>

    <a-layout>
      <a-layout-header ref="header" class="header">
        <a-space class="header__content">
          <!-- 全屏按钮 -->
          <a class="btn-full" title="全屏" @click="toggleFull">
            <FullscreenOutlined class="icon-lg" />
          </a>

          <!-- 通知 -->
          <notices />

          <!-- 用户头像 -->
          <a-dropdown>
            <span class="avatar">
              <img :src="avatar" alt="头像" />
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
                  <a><UserOutlined /> 退出登陆</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view> </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scope>
.header {
  position: fixed;
  z-index: 86;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 5px rgba(#000, 0.1);
  display: flex;
  justify-content: flex-end;

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
      height: 28px;
      width: 28px;
      display: block;
    }
    span {
      margin-left: 12px;
      font-size: 15px;
    }
  }
}

.side {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100%;
  box-shadow: 2px 0 5px rgba(#000, 0.1);
  .logo {
    margin: 16px;
    display: flex;
    align-items: center;
    img {
      display: block;
    }
    span {
      margin-left: 4px;
      font-size: 20px;
      letter-spacing: 1px;
    }
  }
}

.content {
  margin-top: 64px;
  padding: 24px;
  margin-left: 200px;
  &--grow {
    margin-left: 40px;
  }
}
</style>
