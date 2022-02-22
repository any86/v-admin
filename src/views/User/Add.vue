<script setup lang="ts">
import { ref } from 'vue';
import { type FormInstance } from 'ant-design-vue';
import { http } from '@/http';
import HttpSelector from '@/components/HttpSelector.vue';
import { getDepartmentOptions, getPositionOptions, getRoleOptions } from '@/shared';
export interface FormData {
  userName: string;
  realName: string;
  sex: number;
  age: number;
  departmentId: string;
  email: string;
  roleIds: string[];
  positionId: string;
  state: 0 | 1 | 2;
}

interface Emits {
  (type: 'success'): void;
  (type: 'error', error: unknown): void;
}
const emit = defineEmits<Emits>();
// 提交中
const isSubmitting = ref(false);
const isShow = ref(false);
const DEFAULT_FORM_DATA = {
  sex: 1,
  state: 1,
} as const;

const formData = ref<Partial<FormData>>({ ...DEFAULT_FORM_DATA });
const formRef = ref<FormInstance>();

// 保存新增
async function save() {
  try {
    if (formRef.value) {
      isSubmitting.value = true;
      await formRef.value.validateFields();
      const { status } = await http.post('/user', formData.value);
      isShow.value = false;
      if (200 === status) {
        formData.value = { ...DEFAULT_FORM_DATA };
        emit('success');
      }
    }
  } catch (error) {
    emit('error', error);
  } finally {
    isSubmitting.value = false;
  }
}

function reset() {
  formData.value = {...DEFAULT_FORM_DATA};
  formRef.value?.resetFields();
}

defineExpose({
  show() {
    isShow.value = true;
  },
});
</script>

<template>
  <a-modal v-model:visible="isShow" title="新增用户">
    <a-form ref="formRef" :model="formData" :label-col="{ span: 3 }">
      <a-form-item label="姓名" name="userName" :rules="[{ required: true, message: '请输入账号' }]">
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
        <a-input v-model:value="formData.age" placeholder="请输入年龄" type="number" allowClear></a-input>
      </a-form-item>

      <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
        <a-input v-model:value="formData.email" placeholder="请输入邮箱" allowClear></a-input>
      </a-form-item>

      <a-form-item label="部门" name="departmentId" :rules="[{ required: true, message: '请选择部门' }]">
        <http-selector v-model="formData.departmentId" placeholder="请选择部门" :get-options="getDepartmentOptions" />
      </a-form-item>

      <a-form-item label="角色" name="roleIds" :rules="[{ required: true, message: '请选择角色' }]">
        <http-selector
          v-model="formData.roleIds"
          placeholder="请选择部门"
          mode="multiple"
          :get-options="getRoleOptions"
        />
      </a-form-item>

      <a-form-item label="职位" name="positionId" :rules="[{ required: true, message: '请选择职位' }]">
        <http-selector v-model="formData.positionId" placeholder="请选择部门" :get-options="getPositionOptions" />
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

    <template #footer>
      <a-button :loading="isSubmitting" @click="reset">重置</a-button>
      <a-button type="primary" :loading="isSubmitting" @click="save">确定</a-button>
    </template>
  </a-modal>
</template>
