<script lang="ts">
import { defineComponent } from "vue";
import { Form } from "ant-design-vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { http, setHttpToken, clearHttpToken } from "../http";
export default defineComponent({
  name: "Login",

  data() {
    return {
      formData: { username: "", password: "" },
      isLoading: false,
      rules: {
        username: [{ required: true, message: "必填项", trigger: "blur" }],
        password: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },

  mounted() {
    clearHttpToken();
  },

  methods: {
    async login() {
      try {
        this.isLoading = true;
        const formRef = this.$refs.form as typeof Form;
        await formRef.validate();
        const response = await http.post("/login", this.formData);
        const { token, user } = response.data;
        this.$store.commit("setUserInfo", user);
        // 存储token
        setHttpToken(token);
        message.success("登陆成功");
      } catch (error) {
        if (axios.isAxiosError(error) && 200 === error.response?.status) {
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
      <h1>🚀欢迎访问Vue3系统</h1>
      <a-form
        class="login-box__form"
        ref="form"
        :rules="rules"
        :model="formData"
      >
        <a-form-item name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
          />
        </a-form-item>

        <a-form-item name="password">
          <a-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-button type="primary" @click="login" :loading="isLoading"
          >登录</a-button
        >
      </a-form>
    </div>
  </div>
</template>

<style lang="scss">
$bgColor: #eee;
.page-login {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background-color: $bgColor;
}

.login-box {
  overflow: hidden;
  padding: 32px;
  width: 480px;
  background: #ffffff;
  margin: 20vh auto;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: all 0.5s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
