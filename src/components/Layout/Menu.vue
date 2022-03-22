<script lang="ts">
import { defineComponent } from 'vue';
import arr2tree from 'arr2tree';

export default defineComponent({
  name: 'Menu',

  props: {
    mode: {
      type: String,
      // 在父菜单下方显示子菜单
      default: 'inline',
    },
  },

  data() {
    return {
      // 菜单数据
      menuData: [] as { [k: string]: any }[],
      // 当前选中菜单的Key
      selectedKeys: [] as string[],
      // 当前打开的SubMenu
      openKeys: [] as string[],
      // 路由名称和菜单信息的映射关系
      routeNameAndMenuMap: {} as { [k: string | symbol]: any },
    };
  },

  computed: {
    /**
     * 当前路径对应的菜单id
     */
    currentPathMenu(): string | void {
      const { name } = this.$route;
      if (name) {
        return this.routeNameAndMenuMap[name];
      }
    },
  },

  watch: {
    currentPathMenu(menu?: { id: string; pid: string }) {
      if (menu) {
        this.selectedKeys = [menu.id];
        this.openKeys = [menu.pid];
      }
    },
  },

  async mounted() {
    const { data } = await this.$http.get('/global/menu');
    this.menuData = arr2tree(data, {
      transform: (node) => {
        if (node.path) {
          const route = this.$router.resolve(node.path);
          if (route.name) {
            this.routeNameAndMenuMap[route.name] = node;
          }
        }
        return node;
      },
    });
  },
});
</script>

<template>
  <a-menu class="menu" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :mode="mode">
    <template v-for="menu in menuData">
      <!-- 有下级菜单 -->
      <a-sub-menu v-if="menu.children?.length > 0" :key="menu.id" :title="menu.name">
        <template #icon>
          <span> <i class="iconfont" :class="[menu.icon]"></i></span>
        </template>
        <a-menu-item v-for="{ name, id, path, icon } in menu.children" :key="id" @click="$router.push(path)">
          {{ name }}
          <template #icon>
            <span> <i class="iconfont" :class="[icon]"></i></span>
          </template>
        </a-menu-item>
      </a-sub-menu>

      <!-- 无下级菜单 -->
      <template v-else>
        <a-menu-item :key="menu.id" @click="$router.push(menu.path)">
          {{ menu.name }}
          <template #icon>
            <span> <i class="iconfont" :class="[menu.icon]"></i></span>
          </template>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
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
