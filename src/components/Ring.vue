<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import repeat from '@any86/repeat';

interface Props {
  data?: { value: number; name: string }[];
  color?: string[][];
  title: string;
}

interface Emit {
  (type: 'update:value', value: string | string[]): void;
  (type: 'error', error: unknown): void;
}

const props = withDefaults(defineProps<Props>(), {
  color: () => [
    ['#FFC7B4', '#F0AE6F'],
    ['#20B5C2', '#75FDF6'],
    ['#D39BFF', '#645DFA'],
  ],
  data: () => [
    { value: 1048, name: '监控中'},
    { value: 735, name: '即将到期' },
    { value: 2580, name: '未检测' },
  ],
});
const emit = defineEmits<Emit>();

const elRef = ref<HTMLElement>();
onMounted(() => {
  const chart = echarts.init(elRef.value!);
  const option = {
    tooltip: {
      trigger: 'item',
    },
    title: {
      text: props.title,
      left:"center",
      top:"center",
      textStyle: { color: '#5555F9',},
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: ['60%', '75%'],
        avoidLabelOverlap: false,
        // startAngel:90,
        itemStyle: {
          borderRadius: 100,
        },
        color: repeat(props.color.length, (i) => {
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: props.color[i][0], // 0% 处的颜色
              },
              {
                offset: 1,
                color: props.color[i][1], // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          };
        }),
        label: {
          show: false,
          // position: 'inner',
        },

        labelLine: {
          show: false,
        },
        data: props.data,
      },
    ],
  };

  chart.setOption(option);
});
</script>

<template>
  <div class="ring" ref="elRef"></div>
</template>
<style scoped lang="scss">
.ring {
  width: 300px;
  height: 300px;
}
</style>
