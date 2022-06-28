<script setup lang="ts">
import * as echarts from 'echarts';
import type { LineSeriesOption, EChartsOption } from 'echarts';
import { onMounted, ref } from 'vue';
const chartRef = ref<HTMLElement>();

const option: LineSeriesOption & EChartsOption = {
  color: ['#FE6A00', '#F23302', '#24BBBA', '#FE6A00'],
  tooltip: {
    trigger: 'axis',
  },

  legend: {
    icon: 'circle',
    textStyle: { color: '#fff' },
    data: ['进温', '出温', '进压', '出压'],
  },

  grid: {
    top: '15%',
    right:0,
    left: 0,
    bottom:0,
    containLabel: true,
  },

  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.8)',
      },
    },
    type: 'category',
    data: [2018, 2019, 2020, 2021, 2022],
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#ccc',
      },
    },
    type: 'value',
  },
  series: [
    {
      name: '进温',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '出温',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '进压',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '出压',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
  ],
};

onMounted(() => {
  const myChart = echarts.init(chartRef.value!);
  option && myChart.setOption(option);
});
</script>

<template>
  <div class="chart" ref="chartRef"></div>
</template>

<style lang="scss">
@use 'sass:math';
@function rpx($pxNumber) {
  @return #{math.div($pxNumber, 19.2)}vh;
}
.chart {
  width: 100%;
  height: rpx(450);
}
</style>
