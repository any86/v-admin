<script setup lang="ts">
import { h, onMounted } from 'vue';
import AScroll from 'any-scroll'


onMounted(() => {
  const el = document.getElementById('abc')
  console.log(el);
  if (el) {
    const at = new AScroll(el)
  }
})
</script>

<template>
  <div id="abc">
    <div>123123</div>
  </div>
</template>
