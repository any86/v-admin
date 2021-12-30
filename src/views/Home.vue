<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { http } from "@/http";
import SalesAmount from './Home/SalesAmount.vue'
export default defineComponent({
  name: "Home",

  components:{SalesAmount},

  setup() {
    
  },
});
</script>

<template>
  <div class="page-home">
    <SalesAmount/>
  </div>
</template>

<style lang="scss">

</style>
