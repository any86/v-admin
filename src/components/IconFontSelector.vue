<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import iconfont from '../assets/iconfont/iconfont.json';
interface Props {
  value?: string;
  src: string;
}

interface Emit {
  (type: 'update:value', value: string | string[]): void;
}
const props = defineProps<Props>();
const a = import(props.src);
console.log(a);
const emit = defineEmits<Emit>();
const options: KV[] = iconfont.glyphs;

function onChange(name: string) {
  emit('update:value', name);
}
</script>

<template>
  <a-select :value="value" @change="onChange">
    <a-select-option v-for="{ name } in options" :key="name" show-search :value="name"
      ><i class="iconfont" :class="[`icon-${name}`]" /> {{ name }}</a-select-option
    >
  </a-select>
</template>
