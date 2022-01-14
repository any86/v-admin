<script lang="ts">
import { defineComponent } from "vue";
import Summary from "./Home/Summary.vue";
import SalesAmount from "./Home/SalesAmount.vue";
import PayAndVisitAmount from "./Home/PayAndVisitAmount.vue";
import SalesCategroy from "./Home/SalesCategroy.vue";
import { CaretUpFilled, CaretDownFilled } from "@ant-design/icons-vue";

export default defineComponent({
  name: "Home",

  components: {
    Summary,
    SalesAmount,
    PayAndVisitAmount,
    SalesCategroy,
    CaretUpFilled,
    CaretDownFilled,
  },
});
</script>

<template>
  <div class="page-home">
    <Summary/>

    <!-- 柱形图: 每月销量 -->
    <SalesAmount />

    <!-- 折线图: 支付笔数和访问量 -->
    <PayAndVisitAmount />

    <!-- 饼图: 品类销售额 -->
    <SalesCategroy />
  </div>
</template>

<style lang="scss">
@use "sass:math";
.page-home {
  padding: 8px;
}
</style>
