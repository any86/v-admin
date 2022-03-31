<script setup lang="ts">
import { Prop, ref } from 'vue';
import to from 'await-to-js';
import cloneDeep from 'lodash/cloneDeep';
import { type FormInstance, type FormProps } from 'ant-design-vue';
import { ArrowRightOutlined, LockOutlined } from '@ant-design/icons-vue';
import NForm from './NForm.vue';
import type { UProps, KV, NFormItem } from './Types';
interface Props extends UProps {
  modelValue: KV;
  formProps?: FormProps;
  items: () => NFormItem[];
  done: (formData: KV) => Promise<string>;
  getDefaultValue: (formData: KV) => Promise<KV>;
}

interface Emits {
  (type: 'success', formData: KV): void;
  (type: 'fail', error: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

let defaultFormData = {};
// 提交中
const isSubmitting = ref(false);
const isShow = ref(false);
const isLoading = ref(false);
// 默认值
const DEFAULT_FORM_DATA = cloneDeep(props.modelValue);

const formData = ref<KV>({ ...DEFAULT_FORM_DATA });
const nFormRef = ref<{ formRef: FormInstance }>();
const errorMessage = ref('');
// 保存新增
async function save() {
  try {
    const formRef = nFormRef.value?.formRef;
    if (formRef) {
      isSubmitting.value = true;
      await formRef.validateFields();
      await props.done(formData.value);
      formData.value = { ...DEFAULT_FORM_DATA };
      emit('success', formData.value);
      isShow.value = false;
    }
  } catch (error) {
    emit('fail', error);
  } finally {
    isSubmitting.value = false;
  }
}

function reset() {
  formData.value = { ...DEFAULT_FORM_DATA };
  nFormRef.value?.formRef.resetFields();
}

async function show(params: KV) {
  isShow.value = true;
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const data = await props.getDefaultValue(params);
    defaultFormData = !!data ? data : {};
    formData.value = data;
  } catch (error) {
    errorMessage.value = 'string' === typeof error ? error : '系统故障,请稍后重试';
  } finally {
    isLoading.value = false;
  }
}

defineExpose({
  show,
});
</script>

<template>
  <a-drawer v-model:visible="isShow" title="编辑" size="large">
    <a-skeleton :loading="isLoading">
      <a-result v-if="errorMessage" status="500" title="出错了" :sub-title="errorMessage">
        <template #extra>
          <a-button type="primary" @click="isShow = false">
            <template #icon>
              <arrow-right-outlined />
            </template>
            关闭</a-button
          >
        </template>
      </a-result>
      <n-form v-else v-model="formData" ref="nFormRef" :items="items" :formProps="formProps"></n-form>
      <!-- <div v-else style="position: relative; padding: 16px">
        <n-form v-model="formData" ref="nFormRef" :items="items" :formProps="formProps"></n-form>
        <div style="display:flex;position: absolute; top: 0; right: 0; left: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2)">
          <LockOutlined style="font-size: 60px;margin:auto; color: rgba(255, 255, 255, 0.9);" />
        </div>
      </div> -->
    </a-skeleton>

    <template v-if="!isLoading && !errorMessage" #footer>
      <a-space>
        <a-button :loading="isSubmitting" @click="reset">重置</a-button>
        <a-button type="primary" :loading="isSubmitting" @click="save">确定</a-button></a-space
      >
    </template>
  </a-drawer>
</template>
