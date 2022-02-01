<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "404",

  data() {
    return {};
  },
});
</script>

<template>
  <div class="page-login">
    <a-result
      status="404"
      title="404"
      sub-title="抱歉, 该页面不存在."
    >
      <template #extra>
        <a-button type="primary">返回上一页</a-button>
      </template>
    </a-result>
  </div>
</template>

<style lang="scss"></style>
