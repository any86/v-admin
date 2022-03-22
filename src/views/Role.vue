<script setup lang="ts">
import { h } from 'vue';
import Curd from '@/components/Curd.vue';
import HttpSelector from '@/components/HttpSelector.vue';
import { http } from '@/http';
import type { CProps, DProps, RProps, UProps, KV } from '@/components/Curd/Types';
import { Tag } from 'ant-design-vue';
const primaryKey = 'id';
const r: RProps = {
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
    },

    {
      title: '名称',
      dataIndex: 'name',
    },

    {
      title: '状态',
      customRender({ record }: any) {
        if (1 === record.state) {
          return h(Tag, { color: 'success' }, () => `开启`);
        } else {
          return h(Tag, { color: 'error' }, () => `关闭`);
        }
      },
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 250,
    },
  ],

  async done() {
    const { data } = await http('/role');
    return data;
  },
};

const c: CProps = {
  async done(formData) {
    formData.state = formData.state ? 1 : 0;
    const { data } = await http.post('/role');
    return data.msg;
  },

  items: () => [
    { is: 'a-input', name: 'name', label: '角色名' },
    { is: 'a-switch', name: 'state', label: '是否开启', modelName: 'checked' },

  ],
};

const u: UProps = {
  async getDefaultValue(formData) {
    const { data } = await http.get('/role/' + formData[primaryKey]);
    data.state = Boolean(data.state);
    return data;
  },

  async done() {
    const { data } = await http.put('/role');
    return data.msg;
  },

  items: c.items,
};

const d: DProps = {
  async done() {
    const { data } = await http.delete('/role');
    return data.msg;
  },
};
</script>

<template>
  <curd v-bind="{ primaryKey, c, u, r, d }"></curd>
</template>
