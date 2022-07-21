<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>
<style>
body{background-color: #f0f2f5 !important;}
#app {
  font-family: 微软雅黑, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar-track {
  background: hsla(0, 0%, 100%, 0.15);
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgb(37 37 37 / 5%);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

p {
  margin: 0 !important;
}
</style>
