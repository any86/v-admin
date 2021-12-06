<script lang="ts">
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { http, setHttpToken, clearHttpToken } from "../http";
export default defineComponent({
  name: "Login",

  data() {
    return {
      formData: { username: "", password: "" },
    };
  },

  mounted() {
    clearHttpToken();
  },

  methods: {
    async login() {
      try {
        const response = await http.post(
          "http://127.0.0.1:4523/mock/486559/api/login",
          this.formData
        );
        const { token } = response.data;
        // 存储token
        setHttpToken(token);
        message.success("登陆成功");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          message.error(error.response!.data);
        } else {
          message.error(error as string);
        }
      }
    },
  },
});
</script>

<template>
  <a-input v-model:value="formData.username" placeholder="请输入用户名" />
  <a-input
    v-model:value="formData.password"
    type="password"
    placeholder="请输入密码"
  />
  <a-button type="primary" @click="login">登陆</a-button>
</template>

<style>
</style>
