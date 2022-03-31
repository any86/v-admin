<script setup lang="ts">
import { ref } from 'vue';
import to from 'await-to-js';
import { type FormInstance, type FormProps, Modal, message } from 'ant-design-vue';
import NForm from './NForm.vue';
import type { CProps, NFormItem, KV } from './Types';

interface Props extends CProps {
  modelValue: KV;
  formProps?: FormProps;
  items: () => NFormItem[];
  done: (formData: KV) => Promise<string>;
}

interface Emits {
  (type: 'success', formData: KV): void;
  (type: 'fail', error: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 提交中
const isSubmitting = ref(false);
const isShow = ref(false);
// 默认值
const formData = ref({});
const nFormRef = ref<typeof NForm>();
const modalRef = ref<typeof Modal>();
// 保存新增
async function save() {
  try {
    const formRef = nFormRef.value?.formRef;
    if (formRef) {
      // console.log(formRef);
      isSubmitting.value = true;
      await formRef.validateFields();
      const text = await props.done(formData.value);
      // message.success(text);
      reset();
      emit('success', formData.value);
      isShow.value = false;
    }
  } catch (error) {
    console.log(error);
    if ('string' === typeof error) {
      message.error(error);
    }
    emit('fail', error);
  } finally {
    isSubmitting.value = false;
  }
}

function reset() {
  const elList = document.querySelectorAll('.modal-add');
  for (const el of Array.from(elList)) {
    el.querySelector('.ant-modal-body')?.scrollTo(0, 0);
  }
  nFormRef.value?.reset();
}

defineExpose({
  reset,
  show() {
    isShow.value = true;
  },
});
</script>

<template>
  <a-modal
    class="modal-add"
    ref="modalRef"
    v-model:visible="isShow"
    title="新建"
    width="52%"
    :bodyStyle="{ overflow: 'scroll', maxHeight: '70vh' }"
  >
    <n-form ref="nFormRef" v-model="formData" :items="items" :formProps="formProps"></n-form>
    <template #footer>
      <a-button :loading="isSubmitting" @click="reset">重置</a-button>
      <a-button type="primary" :loading="isSubmitting" @click="save">确定</a-button>
    </template>
  </a-modal>
</template>
