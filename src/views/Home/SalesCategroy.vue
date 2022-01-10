<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import * as echarts from "echarts";
import { http } from "@/http";
export default defineComponent({
  name: "SalesCategroy",

  setup() {
    const lineRef = ref<HTMLElement>();

    onMounted(async () => {
      const response = await http.get("/sales-amount");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(lineRef.value as HTMLElement);
      // 绘制图表
      myChart.setOption({
        color:['#673ab7'],
        tooltip: {},
        yAxis: {
          // 默认值是value, 表示根据数据生成连续的刻度
          type: "value",
        },
        xAxis: {
          data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        },
        series: [
          {
            name: "销量",
            type: "bar",
            data: response.data,
          },
        ],
      });
    });
    return { lineRef };
  },
});
</script>

<template>
    <div class="chart-line" ref="lineRef"></div>
</template>

<style lang="scss">
.chart-line {
  width: 600px;
  height: 300px;
}
</style>
