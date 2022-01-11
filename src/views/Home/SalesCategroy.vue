<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import * as echarts from "echarts";
import { http } from "@/http";
export default defineComponent({
  name: "SalesCategroy",

  setup() {
    const salesCategoryChartRef = ref<HTMLElement>();

    onMounted(async () => {
      // 请求接口
      const response = await http.get<{
        salesTypeData: { x: string; y: number }[];
        salesTypeDataOnline: { x: string; y: number }[];
        salesTypeDataOffline: { x: string; y: number }[];
      }>("/sales-category");

      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(salesCategoryChartRef.value as HTMLElement);

      // 处理数据
      const data = response.data.salesTypeData.map(({ x, y }) => {
        return { name: x, value: y };
      });

      // 绘制图表
      myChart.setOption({
        tooltip: {},

        series: [
          {
            name: "销售额",
            type: "pie",
            // 圆环的内径和外径比例
            radius: ["40%", "70%"],
            data,
          },
        ],
      });
    });
    return { salesCategoryChartRef };
  },
});
</script>

<template>

  <div class="chart-sales-category" ref="salesCategoryChartRef"></div>
</template>

<style lang="scss">
.chart-sales-category {
  width: 600px;
  height: 300px;
}
</style>
