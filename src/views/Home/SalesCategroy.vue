<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
} from "vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

import { http } from "@/http";
export default defineComponent({
  name: "SalesCategroy",

  setup() {
    const salesCategoryChartRef = ref<HTMLElement>();
    const type = ref<
      "salesTypeData" | "salesTypeDataOnline" | "salesTypeDataOffline"
    >("salesTypeData");
    const isLoading = ref(true);
    let chartPie: ECharts;

    onMounted(async () => {
      isLoading.value = true;
      // 请求接口
      const response = await http.get<{
        salesTypeData: { x: string; y: number }[];
        salesTypeDataOnline: { x: string; y: number }[];
        salesTypeDataOffline: { x: string; y: number }[];
      }>("/sales-category");
      isLoading.value = false;

      // 基于准备好的dom，初始化echarts实例
      await nextTick();
      chartPie = echarts.init(salesCategoryChartRef.value as HTMLElement);
      // 绘制图表
      watch(
        type,
        (type) => {
          // 切换不同类型的数据
          const data = response.data[type].map(({ x, y }) => {
            return { name: x, value: y };
          });

          chartPie.setOption({
            grid: { containLabel: true, left: 0, right: 0, bottom: 16 },

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

    function _resize() {
      chartPie.resize();
    }

    window.addEventListener("resize", _resize);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", _resize);
      chartPie?.dispose();
    });

    return { salesCategoryChartRef, type, isLoading };
  },
});
</script>

<template>
  <a-card size="small" :loading="isLoading" title="品类销量占比">
    <a-radio-group v-model:value="type">
      <a-radio-button value="salesTypeData">全部</a-radio-button>
      <a-radio-button value="salesTypeDataOnline">线上</a-radio-button>
      <a-radio-button value="salesTypeDataOffline">线下</a-radio-button>
    </a-radio-group>
    <div
      v-if="!isLoading"
      class="chart-sales-category"
      ref="salesCategoryChartRef"
    ></div
  ></a-card>
</template>

<style lang="scss">
.chart-sales-category {
  width: 100%;
  height: 300px;
}
</style>
