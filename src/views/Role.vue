<script setup lang="ts">
import { h, reactive } from 'vue';
import arr2tree from '@any86/array-to-tree';
import crud, { defineC, defineD, defineR, defineU } from 'crud-vue';
import { http } from '@/http';
import { Tag } from 'ant-design-vue';
const primaryKey = 'id';

let treeData = reactive<KV[]>([]);
const r = defineR({
  async before() {
    const { data } = await http.get('/global/menu');
    treeData = arr2tree(data, {
      transform(node) {
        node.title = node.name;
        node.key = node.id;
        return node;
      },
    });
  },
  columns: [
    {
      title: 'id',
      dataIndex: 'id',
    },

    {
      title: '名称',
      dataIndex: 'name',
      // children: [
      //   { title: 'A1', dataIndex: 'a1', key: 'a1' },
      //   { title: 'A2', dataIndex: 'a2', key: 'a2' },
      //   { title: 'A3', dataIndex: 'a3', key: 'a3' },
      //   { title: 'A4', dataIndex: 'A4', key: 'A4' },
      //   { title: 'A5', dataIndex: 'A5', key: 'A5' },
      // ],
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
    },
  ],

  async done(params) {
    const { data } = await http.get('/role', { params });
    return data;
  },
});

const c = defineC({
  async done(formData) {
    formData.state = formData.state ? 1 : 0;
    const { data, status } = await http.post('/role', formData);
    return [200 === status, data.msg];
  },

  items: () => [
    { is: 'a-input', name: 'name', label: '角色名', rules: [{ required: true, message: '必填项' }] },
    { is: 'a-switch', name: 'state', label: '是否开启', modelName: 'checked' },
    {
      is: 'a-tree',
      name: 'menuId',
      modelName: 'checkedKeys',
      label: '菜单',
      props: {
        treeData,
        checkable: true,
        defaultExpandAll: true,
      },
    },
  ],
});

const u = defineU({
  async before(formData) {
    const { data } = await http.get('/role/' + formData[primaryKey]);
    data.state = Boolean(data.state);
    return data;
  },

  async done(formData) {
    const { id, ...kv } = formData;
    const { data, status } = await http.put('/role/' + id, kv);
    return [200 === status, data.msg];
  },

  items: c.items,
});

const d = defineD({
  async done(idList) {
    if (1 < idList.length) {
      const { data, status } = await http.delete('/role/', {
        params: {
          idList,
        },
      });
      return [200 === status, data.msg];
    } else {
      const { data, status } = await http.delete('/role/' + idList[0]);
      return [200 === status, data.msg];
    }
  },
});
</script>

<template>
  <crud v-bind="{ primaryKey, c, u, r, d }"></crud>
</template>
