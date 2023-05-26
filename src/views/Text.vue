<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AScroll from 'any-scroll'
import Core from '@any-scroll/core'
import wheel from '@any-scroll/wheel'

const count = ref(10);
let at;
onMounted(() => {
  const el = document.getElementById('abc')
  console.log(el);
  if (el) {
    at = new AScroll(el, { allow: [true, false] })
    // at.use(wheel, {})
  }
})


function add() {
  count.value++;
  at.update()
}
</script>

<template>
  <article>
    <div id="abc">
      <ul>
        <li v-for="n in count">第{{ n }}条</li>
      </ul>
    </div>
    <button @click="add">增加</button>
  </article>
</template>

<style scoped lang="scss">
#abc {
  border: 1px solid #000;
}

ul {
  display: flex;

  li {
    list-style: none;
    min-width: 200px;
  }
}
</style>