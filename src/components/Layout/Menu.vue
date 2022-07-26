<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { pathToRegexp } from 'path-to-regexp';
import MenuX from '@/components/MenuX.vue';
import getMenu from '@/shared/useMenu';

import { type MenuMode } from 'ant-design-vue';
export default defineComponent({
  name: 'Menu',

  components: { MenuX },

  props: {
    mode: {
      type: String as PropType<MenuMode>,
      // 在父菜单下方显示子菜单
      default: 'inline',
    },
  },

  data() {
    return {
      // 当前选中菜单的Key
      selectedKeys: [] as string[],
      // 当前打开的SubMenu
      openKeys: [] as string[],
    };
  },

  computed: {
    /**
     * 当前路径对应的菜单id
     */
    currentPathMenuId(): string | void {
      const { matched } = this.$route;
      const pathRule = matched[matched.length - 1].path;
      const regexp = pathToRegexp(pathRule);
      const one = this.$store.state.menuList.find((menu) => regexp.test(menu.menuUrl));
      if (one) {
        return one.id;
      }
    },
  },

  watch: {
    currentPathMenuId: {
      handler(currentPathMenuId: string) {
        // console.log(currentPathMenuId);
        if (currentPathMenuId) {
          this.selectedKeys = [currentPathMenuId];
          this.openKeys = [this.$store.state.menuIdAndMenuPidMap[currentPathMenuId]];
        }
      },
      immediate: true,
    },
  },

  async mounted() {
    await this.$store.dispatch('getMenu');
  },

  methods: {
    onClickItem(item: KV<any>) {
      if (item.menuUrl && !item?.children?.length) {
        this.$router.push({ path: item.menuUrl });
      }
    },
  },
});
</script>

<template>
  <a-skeleton active :loading="$store.state.isLoadingMenu">
    <menu-x
      class="menu"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      :mode="mode"
      :theme="$store.state.MENU_THEME"
      :fieldNames="{ title: 'name', key: 'id', icon: 'icon' }"
      :data="$store.state.menuTree"
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
