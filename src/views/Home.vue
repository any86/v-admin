<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import * as echarts from "echarts";
export default defineComponent({
  name: "Home",

  setup() {
    const lineRef = ref<HTMLElement>();
    onMounted(() => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(lineRef.value as HTMLElement);
      // 绘制图表
      myChart.setOption({
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        xAxis: {
          // 默认值是value, 表示根据数据生成连续的刻度
          type: "value",
        },
        yAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    });
    return { lineRef };
  },
});
</script>

<template>
  <div class="page-home">
    <div class="chart-line" ref="lineRef"></div>
  </div>
</template>

<style lang="scss">
.chart-line {
  width: 600px;
  height: 300px;
}
</style>
