<script setup lang="ts">
import MenuX from '@/components/MenuX.vue';
import useMenu from '@/shared/useMenu';
import { type MenuMode } from 'ant-design-vue';
import { useRouter } from 'vue-router';

withDefaults(defineProps<{ mode?: MenuMode }>(),{mode:'inline'});
const [isLoading, menuTree, selectedKeys, openKeys] = useMenu();
const router = useRouter();

function onClickItem(item: KV<any>) {
  if (item.menuUrl && !item?.children?.length) {
    router.push({ path: item.menuUrl });
  }
}
</script>

<template>
  <a-skeleton active :loading="isLoading">
    <!-- <h1 style="color:#fff;">{{openKeys}}</h1> -->
    <menu-x
      v-if="menuTree"
      class="menu"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      :mode="mode"
      :theme="$store.state.MENU_THEME"
      :fieldNames="{ title: 'name', key: 'id', icon: 'icon' }"
      :data="menuTree"
      @click-item="onClickItem"
    ></menu-x>
  </a-skeleton>
</template>

<style lang="scss" scope>
.menu {
  overflow-x: hidden;
  overflow-y: auto;
  .iconfont {
    font-size: 20px;
  }
}
</style>
