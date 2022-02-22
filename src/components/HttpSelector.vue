<script setup lang="ts">
import { ref } from 'vue';

interface OptionItem {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string | null | string[];
  placeholder: string;
  getOptions: () => Promise<OptionItem[]>;
}

interface Emit {
  (type: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

function change(value: string) {
  emit('update:modelValue', value);
}

// 获取选项
const options = ref<OptionItem[]>();
props.getOptions().then((data) => {
  options.value = data;
});
</script>

<template>
  <a-select :value="modelValue" @update:value="change" @focus="getOptions" allowClear v-bind="$props">
    <a-select-option v-for="{ label, value } in options" :key="value" :value="value">{{ label }}</a-select-option>
  </a-select>
</template>
