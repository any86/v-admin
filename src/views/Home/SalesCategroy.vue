<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { http } from "@/http";
export default defineComponent({
  name: "SalesCategroy",

  setup() {
    const salesCategoryChartRef = ref<HTMLElement>();
    const type = ref<
      "salesTypeData" | "salesTypeDataOnline" | "salesTypeDataOffline"
    >("salesTypeData");

    onMounted(async () => {
      // 请求接口
      const response = await http.get<{
        salesTypeData: { x: string; y: number }[];
        salesTypeDataOnline: { x: string; y: number }[];
        salesTypeDataOffline: { x: string; y: number }[];
      }>("/sales-category");

      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(salesCategoryChartRef.value as HTMLElement);

      // 绘制图表
      watch(
        type,
        (type) => {
          // 切换不同类型的数据
          const data = response.data[type].map(({ x, y }) => {
            return { name: x, value: y };
          });

          myChart.setOption({
            tooltip: {},

            series: [
              {
                type: "pie",
                // 圆环的内径和外径比例
                radius: ["40%", "70%"],
                data,
              },
            ],
          });
        },
        { immediate: true }
      );
    });

    return { salesCategoryChartRef, type };
  },
});
</script>

<template>
  <a-radio-group v-model:value="type">
    <a-radio-button value="salesTypeData">全部</a-radio-button>
    <a-radio-button value="salesTypeDataOnline">线上</a-radio-button>
    <a-radio-button value="salesTypeDataOffline">线下</a-radio-button>
  </a-radio-group>
  <div class="chart-sales-category" ref="salesCategoryChartRef"></div>
</template>

<style lang="scss">
.chart-sales-category {
  width: 600px;
  height: 300px;
}
</style>
