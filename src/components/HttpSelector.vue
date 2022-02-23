<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

interface OptionItem {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string | null | string[];
  // 默认显示文字
  defaultText?: string;
  immediate?: boolean;
  getOptions: () => Promise<OptionItem[]>;
}

interface Emit {
  (type: 'update:modelValue', value: string): void;
  (type: 'error', error: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

function change(value: string) {
  emit('update:modelValue', value);
}

// 获取选项
const isLoading = ref(false);
const options = ref<OptionItem[]>();
async function _getOptions() {
  if (options.value?.length) return;
  try {
    isLoading.value = true;
    options.value = await props.getOptions();
  } catch (error) {
    emit('error', error);
  } finally {
    isLoading.value = false;
  }
}

onBeforeMount(() => {
  if (props.immediate) {
    _getOptions();
  }
});

// 默认显示文字
const value = computed(() => {
  return !!options.value?.length ? props.modelValue : props.defaultText;
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <a-select
      :value="aa"
      @update:value="change"
      @focus="_getOptions"
      allowClear
      :mode="Array.isArray(value) ? 'multiple' : void 0"
      v-bind="$attrs"
    >
      <a-select-option v-for="{ label, value } in options" :key="value" :value="value">{{ label }}</a-select-option>
    </a-select>
  </a-spin>
</template>
