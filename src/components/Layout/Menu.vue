<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Menu',

  props: {
    containorEl: {
      type: Object,
    },
  },

  data() {
    return {
      menuData: [],
      selectedKeys: '',
    };
  },

  async mounted() {
    const { data } = await this.$http.get('/menu');
    this.menuData = data;
  },
});
</script>

<template>
  <a-menu class="menu" v-model:selectedKeys="selectedKeys" mode="inline">
    <a-sub-menu v-for="menu in menuData" :key="menu.id">
      <template #title>
        {{ menu.name }}
      </template>
      <a-menu-item v-for="{ name, id } in menu.children" :key="id">{{ name }}</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<style lang="scss" scope>
.menu {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
