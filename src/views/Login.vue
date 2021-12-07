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
        const formRef = this.$refs.form as typeof Form;
        await formRef.validate();
        const response = await http.post(
          "http://127.0.0.1:4523/mock/486559/api/login",
          this.formData
        );
        const { token } = response.data;
        // 存储token
        setHttpToken(token);
        message.success("登陆成功");
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data || "网络异常请联系管理员");
        }
      }
    },
  },
});
</script>

<template>
  <a-form ref="form" :rules="rules" :model="formData">
    <a-form-item name="username">
      <a-input v-model:value="formData.username" placeholder="请输入用户名" />
    </a-form-item>

    <a-form-item name="password">
      <a-input
        v-model:value="formData.password"
        type="password"
        placeholder="请输入密码"
      />
    </a-form-item>
    <a-button type="primary" @click="login">登录</a-button>
  </a-form>
</template>

<style>
</style>
