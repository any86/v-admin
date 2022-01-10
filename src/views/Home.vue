<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import SalesAmount from './Home/SalesAmount.vue'
import PayAndVisitAmount from './Home/PayAndVisitAmount.vue'
import SalesCategroy from './Home/SalesCategroy.vue'

export default defineComponent({
  name: "Home",

  components:{SalesAmount,PayAndVisitAmount,SalesCategroy},

});
</script>

<template>
  <div class="page-home">
    <!-- 柱形图: 每月销量 -->
    <SalesAmount/>

    <!-- 折线图: 支付笔数和访问量 -->
    <PayAndVisitAmount/>

    <!-- 饼图: 品类销售额 -->
    <SalesCategroy/>
  </div>
</template>

<style lang="scss">

</style>
