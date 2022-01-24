<script lang="ts">
import { defineComponent, ref } from "vue";
import { useChartBar } from "./SalesAmount.hook";

export default defineComponent({
  name: "SalesAndVisitAmount",

  setup() {
    const type = ref<0 | 1>(0);
    const chartRef = ref<HTMLElement>();
    const isLoading = useChartBar(chartRef, type);
    return { type, chartRef, isLoading };
  },
});
</script>

<template>
  <a-card size="small" :loading="isLoading" title="近1年销售/访问量">
    <a-radio-group v-model:value="type">
      <a-radio-button :value="0">销售额</a-radio-button>
      <a-radio-button :value="1">访问量</a-radio-button>
    </a-radio-group>
    <div class="chart-line" ref="chartRef"></div>
  </a-card>
</template>

<style lang="scss">
.chart-line {
  margin-top: 15px;
  width: 100%;
  height: 300px;
}
</style>
