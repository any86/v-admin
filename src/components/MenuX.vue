<script lang="ts">
const DEFAULT_FIELD_NAMES = { children: 'children', title: 'title', key: 'key',icon:'icon' };
</script>

<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';
import { computed } from 'vue';
type Key = string | number | symbol;
type MenuItem = {
  [k in Key]: any;
};

interface Props {
  data: MenuItem[];
  theme?: MenuProps['theme'];
  mode?: MenuProps['mode'];
  // 当前打开的SubMenu
  openKeys?: MenuProps['openKeys'];
  // 当前选中菜单的Key
  selectedKeys?: MenuProps['selectedKeys'];
  // 层级
  level?: number;
  // 字段映射
  fieldNames?: { children?: string; title?: string; key?: string; icon?: string };
}

interface Emits {
  (type: 'update:selectedKeys', data: any): void;
  (type: 'update:openKeys', data: any): void;
  (type: 'click-item', item: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  fieldNames: () => DEFAULT_FIELD_NAMES,
});

defineEmits<Emits>();

const fieldNameMap = computed(() => {
  return { ...DEFAULT_FIELD_NAMES, ...props.fieldNames };
});

// 路由名称和菜单信息的映射关系
const routeNameAndMenuMap = {};
</script>

<template>
  <!-- 根 -->
  <a-menu
    v-if="void 0 === level"
    :mode="mode"
    :theme="theme"
    :openKeys="openKeys"
    :selectedKeys="selectedKeys"
    @update:openKeys="$emit('update:openKeys', $event)"
    @update:selectedKeys="$emit('update:selectedKeys', $event)"
  >
    <menu-x :level="1" :fieldNames="fieldNames" :data="data" @click-item="$emit('click-item', $event)"></menu-x>
  </a-menu>

  <!-- 子 -->
  <template v-else>
    <template v-for="item in data" :key="item[fieldNameMap.key]">
      <a-sub-menu
        v-if="item[fieldNameMap.children]?.length"
        :title="item[fieldNameMap.title]"
        :key="item[fieldNameMap.key]"
        @click="$emit('click-item', item)"
      >
        <template #icon>
          <span> <i class="iconfont" :class="['icon-' + item[fieldNameMap.icon]]"></i></span>
        </template>
        <menu-x
          :level="(level||0) + 1"
          :fieldNames="fieldNames"
          :data="item[fieldNameMap.children]"
          @click-item="$emit('click-item', $event)"
        ></menu-x>
      </a-sub-menu>

      <!-- 套一层template解决v-if/v-else都是用key报错 , 肯能是volor的bug-->
      <template v-else>
        <a-menu-item :key="item[fieldNameMap.key]" @click="$emit('click-item', item)">
          <template #icon>
            <span> <i class="iconfont" :class="['icon-' + item[fieldNameMap.icon]]"></i></span>
          </template>
          {{ item[fieldNameMap.title] }}</a-menu-item
        >
      </template>
    </template>
  </template>
</template>

<style lang="scss" scope>
.menu {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .iconfont {
    font-size: 20px;
  }
}
</style>
