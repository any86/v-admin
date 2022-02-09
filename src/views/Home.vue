<script lang="ts">
import { defineComponent } from "vue";
import Summary from "./Home/Summary.vue";
import SalesAndVisitAmount from "./Home/SalesAndVisitAmount.vue";
import PayAndVisitAmount from "./Home/PayAndVisitAmount.vue";
import SalesCategroy from "./Home/SalesCategroy.vue";
import { CaretUpFilled, CaretDownFilled } from "@ant-design/icons-vue";

export default defineComponent({
  name: "Home",

  components: {
    Summary,
    SalesAndVisitAmount,
    PayAndVisitAmount,
    SalesCategroy,
    CaretUpFilled,
    CaretDownFilled,
  },
});
</script>

<template>
  <div class="page-home">
    <Summary />

    <!-- 折线图: 支付笔数和访问量 -->
    <PayAndVisitAmount />

    <a-row class="mt-2" :gutter="16">
      <a-col :span="12">
        <!-- 柱形图: 每月销量 -->
        <SalesAndVisitAmount />
      </a-col>
      <a-col :span="12">
        <!-- 饼图: 品类销售额 -->
        <SalesCategroy />
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.page-home {
  min-height: 100vh;
}
</style>
