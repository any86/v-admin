<template>
  <a-upload
    name="file"
    :list-type="'image' === type ? 'picture-card' : void 0"
    :show-upload-list="false"
    :headers="state.headers"
    :action="state.url"
    @change="onChange"
    v-bind="$attrs"
  >
    <template v-if="'button' === type">
      <a-button class="mt-1" size="small" :loading="state.isLoading">
        <cloud-upload-outlined />
        <template v-if="!value">上传</template>
        <template v-else>重新上传</template>
      </a-button>
    </template>
    <template v-else>
      <img class="preview-image" v-if="state.base64" height="100" :src="state.base64" alt="已上传图片" />
      <div v-else>
        <loading-outlined v-if="state.isLoading"></loading-outlined>
        <cloud-upload-outlined v-else class="font-1" />
        <div class="ant-upload-text">上传</div>
      </div>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { PlusOutlined, LoadingOutlined, CloudUploadOutlined } from '@ant-design/icons-vue';
import { HTTP_TOKEN_KEY } from '@/const';
import { getToken } from 'vue-auth-gate';

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response: any;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

interface Props {
  // 图片预览
  preview?: string;
  // 图片地址
  value?: string;
  type?: 'button' | 'image';
  // 返回图片地址
  transform?: (data: any) => string;
}
interface Emits {
  (type: 'done', httpResponse: FileItem['response']): void;
  (type: 'change', fileInfo: FileInfo): void;
  (type: 'update:value', base64: string): void;
}

const props = withDefaults(defineProps<Props>(), { type: 'image', transform: (data: any) => data });
const emit = defineEmits<Emits>();

const state = reactive({
  headers: { [HTTP_TOKEN_KEY]: getToken() },
  isLoading: false,
  url: `${import.meta.env.VITE_API_BASE_URL}/file?type=2`,
  base64: '',
});

watch(
  () => props.preview,
  (preview) => {
    if (preview) {
      state.base64 = preview;
    }
  },
  { immediate: true }
);

watch(
  () => props.value,
  (value) => {
    if (!value) {
      state.base64 = '';
    }
  }
);

async function onChange(file: FileInfo) {
  emit('change', file);
  //  上传完成
  if ('done' === file.file.status) {
    emit('done', file.file.response);
    getBase64(file.file.originFileObj, (base64) => {
      state.base64 = base64;
      state.isLoading = false;
      emit('update:value', props.transform(file.file.response));
    });
  } else {
    state.base64 = '';
    state.isLoading = true;
  }
}
</script>

<style scoped lang="scss">
.preview-image {
  object-fit: contain;
  width: 100%;
}
</style>
