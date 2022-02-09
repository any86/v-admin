<script lang="ts">
import { defineComponent } from 'vue';
import { CaretDownOutlined, SettingOutlined, UserOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
import { http } from '@/http';
export default defineComponent({
  name: 'Layout',

  components: { CaretDownOutlined, SettingOutlined, UserOutlined, FullscreenOutlined },

  data() {
    return {
      name: '',
      avatar: '',
    };
  },

  async mounted() {
    const { data } = await http.get('currentUser');
    this.name = data.name;
    this.avatar = data.avatar;
  },
});
</script>

<template>
  <a-layout>
    <a-layout-sider class="side" v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img width="36" src="@/assets/logo.png" />
        <span>宽行教育</span>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div class="header__content">
          <span class="btn-full">
            <FullscreenOutlined />
          </span>

          <a-dropdown>
            <span class="avatar" @click.prevent>
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
                <a-menu-item>
                  <a><UserOutlined /> 退出登陆</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view> </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scope>
@mixin buttonHover {
  padding: 0 16px;
  &:hover {
    cursor: pointer;
    background: #eee;
  }
}
.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 5px rgba(#000, 0.1);

  &__content {
    display: flex;
    justify-content: flex-end;
  }
  .btn-full {
    display: block;
    margin-right: 16px;
    @include buttonHover;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    @include buttonHover;
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
