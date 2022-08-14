<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from "vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";

import { http } from "@/http";
export default defineComponent({
  name: "PayAndVisitAmount",

  setup() {
    const lineRef = ref<HTMLElement | null>(null);
    const isLoading = ref(false);
    let chartLine: ECharts;

    onMounted(async () => {
      isLoading.value = true;
      const response = await http.get<
        { date: string; value: number; type: "客流量" | "支付笔数" }[]
      >("/pay-visit-amount");
      isLoading.value = false;

      // 处理数据
      const linePay: number[] = [];
      const lineVisit: number[] = [];
      const dates: string[] = [];
      response.data.forEach(({ date, value, type }) => {
        if ("客流量" === type) {
          lineVisit.push(value);
          dates.push(date);
        } else {
          linePay.push(value);
        }
      });

      // 确保dom被渲染,
      await nextTick();
      if(null === lineRef.value) return; 
      // 基于准备好的dom，初始化echarts实例
      chartLine = echarts.init(lineRef.value as HTMLElement);
      // 绘制图表
      chartLine.setOption({
        grid: {
          containLabel: true,
          left: 0,
          right: 0,
          bottom: 16,
        },
        // 定义2个折线的颜色
        color: ["#1890ff", "#009688"], //[蓝,绿]
        // 图形顶部2个曲线的名称
        legend: {
          data: ["支付笔数", "访客量"],
        },
        xAxis: {
          type: "category",
          // x轴显示时间
          data: dates,
        },
        yAxis: {
          type: "value",
        },
        // 2条折线数据,
        series: [
          {
            // 上面使用legend定义的名字,
            // 所以这里要用name标记名字
            name: "支付笔数",
            data: linePay,
            type: "line",
          },
          {
            name: "访客量",
            data: lineVisit,
            type: "line",
          },
        ],
      });
    });

    function _resize() {
      chartLine.resize();
    }

    window.addEventListener("resize", _resize);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", _resize);
      chartLine.dispose();
    });
    return { lineRef, isLoading };
  },
});
</script>

<template>
  <a-card title="24小时支付/访问" :loading="isLoading" size="small">
    <div class="chart-line" ref="lineRef"></div>
  </a-card>
</template>

<style lang="scss">
.chart-line {
  width: 100%;
  height: 300px;
}
</style>
