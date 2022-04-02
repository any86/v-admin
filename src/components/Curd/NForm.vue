<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormProps } from 'ant-design-vue';
import type { NFormItem, KV } from './Types';

interface Props {
  modelValue: KV;
  formProps?: FormProps;
  items: () => NFormItem[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
});

const isLoading = ref(true);
const formData = reactive<KV>(props.modelValue || {});
const defaultValueMap: KV = !!props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : {};

props.items().forEach((item) => {
  if (void 0 !== item.defaultValue) {
    if (void 0 === item.name) {
      console.warn('表单组件缺少name字段');
    } else {
      // 同步items配置中设置的默认值
      formData[item.name] = item.defaultValue;
      defaultValueMap[item.name] = item.defaultValue;
    }
  }
});

isLoading.value = false;
const formRef = ref<FormInstance>();

/**
 * 获取表单项应该使用的vModel名
 * @param item 表单单项配置信息
 */
function getVModelName(item: NFormItem) {
  return item.modelName || 'value';
}

/**
 * 重置表单
 */
function reset() {
  formData.value = { ...defaultValueMap };
  console.log(formRef.value?.scrollToField);
  // formRef.value?.scrollToField('mouldName')
  formRef.value?.resetFields();
}

defineExpose({ formRef, reset });
</script>

<template>
  <!-- {{ formData }} -->
  <a-form v-if="!isLoading && void 0 !== formData" ref="formRef" :model="formData" v-bind="formProps">
    <a-form-item v-for="item in items()" v-bind="item" colon :key="item.name" :id="item.name">
    <!-- {{formData[item.name]}} -->
      <!-- 表单类的组件 -->
      <component
        v-if="item.name"
        :is="item.is"
        v-bind="{
          allowClear: true,
          placeholder: `请输入${item.label || ''}`,
          ...item.props,
        }"
        v-model:[getVModelName(item)]="formData[item.name as string]"
        v-model:form-data="formData"
      >
      </component>
      <!-- 纯显示组件 -->
      <component
        v-else
        :is="item.is"
        v-bind="item.props"
      ></component>
    </a-form-item>
    <slot name="after"></slot>
  </a-form>
</template>
