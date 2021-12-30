<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { http } from "@/http";
import SalesAmount from './Home/SalesAmount.vue'
import PayAndVisitAmount from './Home/PayAndVisitAmount.vue'

export default defineComponent({
  name: "Home",

  components:{SalesAmount,PayAndVisitAmount},

  setup() {
    
  },
});
</script>

<template>
  <div class="page-home">
    <!-- 柱形图: 每月销量 -->
    <SalesAmount/>

    <!-- 折线图: 支付笔数和访问量 -->
    <PayAndVisitAmount/>
  </div>
</template>

<style lang="scss">

</style>
