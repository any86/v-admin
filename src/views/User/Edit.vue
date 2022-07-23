<script setup lang="ts">
import { ref } from 'vue';
import { FormInstance } from 'ant-design-vue';

import { http } from '@/http';
import { FormData } from './Add.vue';
import HttpSelector from '@/components/HttpSelector.vue';
import { getDepartmentOptions, getPositionOptions, getRoleOptions } from '@/shared';
import to from 'await-to-js';
interface Emits {
  (type: 'success'): void;
  (type: 'error', error: unknown): void;
}
const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const isShow = ref(false);
const isLoading = ref(false);
let defaultFormData: FormData & { userId: string };
const formData = ref<FormData>();
function reset() {
  formData.value = { ...defaultFormData };
}

async function save() {
  if (formRef.value) {
    await formRef.value.validateFields();
    const [error, response] = await to(http.put('/user/' + defaultFormData.userId, formData.value));
    if (200 === response?.status) {
      emit('success');
    } else {
      emit('error', error);
    }
    isShow.value = false;
  }
}

defineExpose({
  /**
   * 显示详情页面
   * @param userId 用户id
   */
  async show(userId: string) {
    isShow.value = true;
    isLoading.value = true;
    const { status, data } = await http.get('/user/' + userId);
    if (200 === status) {
      defaultFormData = { ...data };
      formData.value = data;
    }
    isLoading.value = false;
  },
});
</script>

<template>
  <a-drawer v-model:visible="isShow" title="编辑" size="large">
    <a-skeleton :loading="isLoading">
      <a-form v-if="void 0 !== formData" ref="formRef" :model="formData" :label-col="{ span: 3 }">
        <a-form-item label="账号" name="userName" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="formData.userName" placeholder="请输入账号" allowClear></a-input>
        </a-form-item>

        <a-form-item label="姓名" name="realName" :rules="[{ required: true, message: '请输入姓名' }]">
          <a-input v-model:value="formData.realName" placeholder="请输入姓名" allowClear></a-input>
        </a-form-item>

        <a-form-item label="性别" name="sex" :rules="[{ required: true, message: '请选择性别' }]">
          <a-radio-group
            v-model:value="formData.sex"
            :options="[
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]"
          ></a-radio-group>
        </a-form-item>

        <a-form-item label="年龄" name="age" :rules="[{ required: true, message: '请输入年龄' }]">
          <a-input-number
            v-model:value="formData.age"
            placeholder="请输入年龄"
            min="18"
            max="100"
            allowClear
          ></a-input-number>
        </a-form-item>

        <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" allowClear></a-input>
        </a-form-item>
        <a-form-item label="部门" name="departmentId" :rules="[{ required: true, message: '请选择部门' }]">
          <http-selector
            v-model:value="formData.departmentId"
            immediate
            placeholder="请选择部门"
            :get-options="getDepartmentOptions"
          />
        </a-form-item>

        <a-form-item label="角色" name="roleIds" :rules="[{ required: true, message: '请选择角色' }]">
          <http-selector
            v-model:value="formData.roleIds"
            immediate
            placeholder="请选择角色"
            mode="multiple"
            :get-options="getRoleOptions"
          />
        </a-form-item>

        <a-form-item label="职位" name="positionId" :rules="[{ required: true, message: '请选择职位' }]">
          <http-selector
            v-model:value="formData.positionId"
            immediate
            placeholder="请选择部门"
            :get-options="getPositionOptions"
          />
        </a-form-item>

        <a-form-item label="状态" :rules="[{ required: true, message: '请选择状态' }]">
          <a-radio-group
            v-model:value="formData.state"
            :options="[
              { label: '正常', value: 1 },
              { label: '离职', value: 2 },
              { label: '锁定', value: 0 },
            ]"
          ></a-radio-group>
        </a-form-item>
      </a-form>
    </a-skeleton>

    <template #footer>
      <a-space>
        <a-button :loading="isLoading" @click="reset">重置</a-button>
        <a-button type="primary" :loading="isLoading" @click="save">保存</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
