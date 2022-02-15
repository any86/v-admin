<template>
  <div class="page-login">
    <a-result status="404" title="404" sub-title="抱歉, 该页面不存在.">
      <template #extra>
        <a-button type="primary" size="large" @click="$router.push('/')">首页</a-button>
        <a-button size="large" @click="$router.back">返回上一页</a-button>
      </template>
    </a-result>
  </div>
</template>