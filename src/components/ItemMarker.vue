<script setup lang="ts">
import loadImage from '@any86/load-image';
import { nanoid } from 'nanoid';
import clamp from 'lodash/clamp';
import type { AnyTouchEvent } from '@any-touch/shared';
import { computed, ref, watch, toRaw } from 'vue';
import UploadImage from '@/components/UploadImage.vue';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export type SlotPoint = { x: number; y: number; id: string };

// 设备模型
interface ItemModel {
  // 图片地址
  url?: string;
  // 图片尺寸
  width?: number;
  height?: number;
  points?: SlotPoint[];
  slotsMap?: any;
}

interface Props {
  value?: ItemModel;
}

interface Emits {
  (type: 'update:value', value: ItemModel): void;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

// 预览区域图片地址
const previewRef = ref<HTMLElement>();
const imgRef = ref(Image);
// 孔
const points = ref<SlotPoint[]>([]);
const width = 200;
const height = ref(200);
const previewImage = ref('');
const currentIndex = ref(-1);
const isPanMoving = ref(false);
const isSvgPerspective = ref(false);
// 上传成功后的图片地址
const imageURL = ref('');

const slotsMap = computed(() => {
  const map: KV = {};
  points.value.forEach(({ id, x, y }) => {
    map[id] = { id, x, y };
  });
});

watch(
  () => props.value?.points,
  (_points) => {
    points.value = _points || [];
  },
  { immediate: true }
);

watch(
  () => props.value?.url,
  (url) => {
    // console.log(url);
    previewImage.value = url || '';
  },
  { immediate: true, deep: true }
);

watch(
  previewImage,
  async (previewImage) => {
    try {
      if (previewImage) {
        const img = (await loadImage(previewImage)) as HTMLImageElement;
        height.value = Math.ceil((width * img.height) / img.width);

      }
    } catch (error) {
      console.log(error);
    }
  },
  { immediate: true, deep: true }
);

function addPoint({ getOffset }: AnyTouchEvent) {
  const { x, y } = getOffset(previewRef.value!);
  const id = nanoid();
  currentIndex.value = points.value.push({ x, y, id }) - 1;
  _updateValue();
}

function onPointTap(index: number) {
  currentIndex.value = index;

  // __updatePropValue();
}

function onPointPanStart(index: number) {
  currentIndex.value = index;
  isPanMoving.value = true;
}

function onPointPanMove({ getOffset }: AnyTouchEvent) {
  const { x, y } = getOffset(previewRef.value!);
  points.value[currentIndex.value].x = clamp(x, 0, width);
  points.value[currentIndex.value].y = clamp(y, 0, height.value);
}

function onPointPanEnd() {
  isPanMoving.value = false;
}

function removePoint() {
  points.value.splice(currentIndex.value, 1);
  currentIndex.value--;
}

function onUploaded(response: { one: string }) {
  imageURL.value = response.one;
  points.value = [];
  // 只在此处加"points"就可以了,
  // 在拖拽位移变化的时候, 点会自动变化,
  // 添加点points也会自动变化
  // 实际这样不符合单项数据流,
  // 是个偷懒,
  // 但是代码简洁
  _updateValue();
}

function transformUpload(data: any) {
  return data.one;
}

function _updateValue() {
  emit('update:value', {
    url: imageURL.value || previewImage.value,
    width,
    height: height.value,
    points: toRaw(points.value),
    slotsMap: slotsMap.value,
  });
}
</script>

<template>
  <!-- {{value}} -->
  <div class="item-marker">
    <span class="d-block" :style="{ width: `${width}px` }">
      <!-- 预览 -->
      <div class="preview mt-1" ref="previewRef" v-touch :style="{ width: `${width}px`, height: `${height}px` }">
        <img
          class="item"
          :class="{ 'item--perspective': isSvgPerspective }"
          ref="imgRef"
          :src="previewImage"
          @tap.self="addPoint"
        />

        <img
          class="point"
          :class="{ 'point--current': -1 === currentIndex || currentIndex === index }"
          src="@/assets/items/crosshair.svg"
          v-for="({ x, y }, index) in points"
          :style="{ top: y + 'px', left: x + 'px' }"
          @tap.self="onPointTap(index)"
          @panstart="onPointPanStart(index)"
          @panmove="onPointPanMove"
          @panend="onPointPanEnd"
        />
      </div>
      <!-- 上传 -->
      <upload-image type="button" v-model:value="previewImage" @done="onUploaded" :transform="transformUpload" />

      <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="removePoint">
        <a-button size="small" v-show="points.length > 0" class="ml-1" danger ghost
          ><delete-outlined /> 删除"孔"</a-button
        >
      </a-popconfirm>

      <!-- <p class="mt-1" v-show="points.length > 0">
        透视:
        <a-switch v-model:checked="isSvgPerspective"></a-switch>
      </p> -->
    </span>

    <span class="flex-1 py-1 px-2">
      <a-typography-title :level="5"><info-circle-outlined /> 操作步骤</a-typography-title>
      <p>1. "<b>上传</b>"设备图</p>
      <p>2. <b>点击图</b>添加 "孔".</p>
      <p>3. "孔" 可以<b>拖拽</b>.</p>
    </span>
  </div>
  <!-- {{ points }} -->
</template>

<style lang="scss" scoped>
@mixin bgChessboard($size: 10px, $color: #aaa) {
  background-image: linear-gradient(45deg, $color 25%, transparent 25%, transparent 75%, $color 75%, $color),
    linear-gradient(45deg, $color 26%, transparent 26%, transparent 74%, $color 74%, $color);
  background-size: $size * 2 $size * 2;
  background-position: 0 0, $size $size;
}

.item-marker {
  display: flex;
  border: 1px solid #ddd;
  padding: 12px;
}

.preview {
  @include bgChessboard(20px);
  position: relative;
  display: block;
  border: 1px solid #aaa;
  * {
    box-sizing: border-box;
  }
  .item {
    cursor: copy;
    width: 100%;
    &--perspective {
      opacity: 0.7;
    }
  }

  .point {
    cursor: pointer;
    display: inline-flex;
    position: absolute;
    height: 32px;
    width: 32px;
    transform: translate(-50%, -50%);
    opacity: 0.5;
    &--current {
      opacity: 1;
      animation: zoom 1s;
    }
  }

  @keyframes zoom {
    from {
      transform: translate(-50%, -50%) rotate(0deg) scale(1.2);
    }
    to {
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
}

.ant-form-item-has-error,
.ant-form-item-with-help {
  .item-marker {
    border-color: #ff4d4f;
    border-radius: 2px;
  }
}
</style>
