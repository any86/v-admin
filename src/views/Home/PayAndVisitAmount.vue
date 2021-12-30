<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import * as echarts from "echarts";
import { http } from "@/http";
export default defineComponent({
  name: "PayAndVisitAmount",

  setup() {
    const lineRef = ref<HTMLElement>();

    onMounted(async () => {
      const response = await http.get<
        { date: string; value: number; type: "客流量" | "支付笔数" }[]
      >("/pay-visit-amount");

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

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(lineRef.value as HTMLElement);
      // 绘制图表
      myChart.setOption({
        // 定义2个折线的颜色
        color: ["#1890ff", "#009688"], //[蓝,绿]
        // 图形顶部2个曲线的名称
        legend: {
          data: ["支付笔数", "访客量"],
        },
        tooltip: {},
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
