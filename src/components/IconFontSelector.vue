<script setup lang="ts">
import iconfont from '../assets/iconfont/iconfont.json';
interface Props {
  value?: string;
}

interface Emit {
  (type: 'update:value', value: string | string[]): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emit>();

const icons: { font_class: string; name: string }[] = iconfont.glyphs;

function onChange(name: string) {
  emit('update:value', props.value === name ? '' : name);
}
</script>

<template>
  <div class="icon-font-selector">
    <i
      class="iconfont"
      :class="[`icon-${font_class}`, { current: value === font_class }]"
      :title="font_class"
      v-for="{ font_class } in icons"
      @click="onChange(font_class)"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
$size: 36px;
.icon-font-selector {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 8px;
  height: $size * 3;
  overflow-y: scroll;
  .iconfont {
    box-sizing: border-box;
    display: block;
    margin-right: math.div($size, 5);
    width: $size;
    text-align: center;
    font-size: math.div($size, 1.2);
    border-radius: 2px;
    &.current {
      color: #1890ff;
    }
    &:hover {
      cursor: pointer;
      transition: transform 0.5s;
      background-color: #ccc;
    }
  }
}
</style>
