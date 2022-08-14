<script setup lang="ts">
import iconfont from '../assets/iconfont/iconfont.json';

// props
interface Props {
  // 当前选中
  value?: string;
}
const props = defineProps<Props>();

// js写法
// const props = defineProps({
//   value:{
//     type:String,
//   }
// });


// emit
interface Emit {
  (type: 'update:value', value: string): void;
}
const emit = defineEmits<Emit>();


// data
const icons: { font_class: string; name: string }[] = iconfont.glyphs;

// methods
function onChange(name: string) {
  emit('update:value', props.value === name ? '' : name);
}
</script>

<template>
  <!-- <icon-font-selector :value="currentIcon" @update:value="currentIcon=$event" v-model="currentIcon"></icon-font-selector> -->

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
