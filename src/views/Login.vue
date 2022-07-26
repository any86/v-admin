<script lang="ts">
import { defineComponent } from 'vue';
import { Form, message } from 'ant-design-vue';
import axios from 'axios';
import { http } from '@/http';
import { clearToken, saveToken } from '@/auth';
import { LoginOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'Login',

  components: { LoginOutlined },

  data() {
    return {
      formData: { username: 'admin', password: 'admin' },
      isLoading: false,
      rules: {
        username: [{ required: true, message: '必填项', trigger: 'blur' }],
        password: [{ required: true, message: '必填项', trigger: 'blur' }],
      },
    };
  },

  methods: {
    async login() {
      try {
        clearToken();
        this.isLoading = true;
        const formRef = this.$refs.form as typeof Form;
        await formRef.validate();
        const response = await http.post('/login', this.formData);
        const { token, user } = response.data;
        this.$store.commit('setUserInfo', user);
        // 存储token
        saveToken(token);
        // 跳转到首页
        this.$router.push({ path: '/' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<template>
  <div class="page-login">
    <div class="login-box">
      <h1 class="login-box__title">欢迎访问Vue3管理系统</h1>
      <a-form class="login-box__form" ref="form" :rules="rules" :model="formData">
        <a-form-item name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" allow-clear />
        </a-form-item>

        <a-form-item name="password">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码"  allow-clear />
        </a-form-item>
        <a-button type="primary" htmlType="submit" @click="login" :loading="isLoading" block size="large"
          ><login-outlined />登录</a-button
        >
      </a-form>
      <a-alert class="mt-3" show-icon type="info">
        <template #message> 测试账号: admin 密码: admin </template>
        <!-- <template #description><a href="https://github.com/any86/vue-admin">源码</a></template> -->
      </a-alert>
      
      <p class="mt-1" style="color:#aaa;"><a target="_new" href="https://github.com/any86/vue-admin">源码: https://github.com/any86/vue-admin</a></p>

    </div>
  </div>
</template>

<style lang="scss">
$bgColor: #eee;

@keyframes BG {
  50% {
    background-position: 100% 0%;
  }
}

@keyframes BOX {
  from {
    transform: translateY(20%) scale(1.2);
    opacity: 0;
  }
}

.page-login {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff) repeat;
  background-size: 200% 100%;
  animation: BG 10s ease-in infinite;
}

.login-box {
  overflow: hidden;
  padding: 32px;
  width: 480px;
  background: rgba(#000, 0.8);
  margin: 20vh auto;
  box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  transition: all 0.5s;
  animation: BOX 0.3s ease-in-out;
  &:hover {
    box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.3);
  }

  &__title {
    background-image: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
