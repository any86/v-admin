<script setup lang="ts">
import Curd from '@/components/Curd.vue';
import { http } from '@/http';
import type { CProps, DProps, RProps, UProps, KV } from '@/components/Curd/Types';
const primaryKey = 'id';
const r: RProps = {
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 250,
    },
  ],

  async done() {
    const {data} = await http('/role');
    console.log(data);
    return data;
  },
};
</script>

<template>
  <curd v-bind="{ primaryKey, r }"></curd>
</template>
