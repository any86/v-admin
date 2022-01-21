<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { http } from "@/http";
import { CaretUpFilled, CaretDownFilled } from "@ant-design/icons-vue";
// 接口返回数据
interface ResponseData {
  totalSales: {
    total: string;
    weekCompared: string;
    dayCompared: string;
    dayTotal: string;
  };
  order: {
    total: string;
    paid: string;
    dayTotal: string;
  };
  salesRanking: {
    total: string;
    list: [
      {
        title: string;
        totalSales: string;
      },
      {
        title: string;
        totalSales: string;
      },
      {
        title: string;
        totalSales: string;
      }
    ];
  };
  activityResults: {
    percent: string;
    totalOrder: string;
  };
}

export default defineComponent({
  name: "Summary",

  components: {
    CaretUpFilled,
    CaretDownFilled,
  },

  setup() {
    const isLoading = ref(true);
    const responseData = ref<ResponseData>();
    onMounted(async () => {
      const response = await http.get<ResponseData>("/summary");
      isLoading.value = false;
      responseData.value = response.data;
    });

    const totalSales = computed(() => responseData.value?.totalSales);
    const order = computed(() => responseData.value?.order);
    const salesRanking = computed(() => responseData.value?.salesRanking);
    const activityResults = computed(() => responseData.value?.activityResults);

    return { isLoading, totalSales, order, salesRanking, activityResults };
  },
});
</script>

<template>
  <a-row :gutter="16">
    <a-col :xs="24" :sm="12" :lg="6">
      <a-card class="card" size="small" :loading="isLoading">
        <template v-if="!isLoading">
          <p class="card__title">总销售额</p>
          <div class="card__content">
            <p class="number">¥ {{ totalSales.total }}</p>
            <span
              >周同比
              <a-typography-text
                :type="totalSales.weekCompared > 0 ? 'danger' : 'success'"
                >{{ totalSales.weekCompared }}%<CaretUpFilled
              /></a-typography-text>
            </span>
            <span>
              日同比
              <a-typography-text
                :type="totalSales.dayCompared > 0 ? 'danger' : 'success'"
                >{{ totalSales.dayCompared }}%<CaretDownFilled
              /></a-typography-text>
            </span>
          </div>
          <footer class="card__footer">
            日销售额:¥ {{ totalSales.dayTotal }}
          </footer>
        </template>
      </a-card>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <a-card class="card" size="small" :loading="isLoading">
          <template v-if="!isLoading">
            <p class="card__title">已支付/总订单数</p>
            <div class="card__content">
              <div class="d-flex align-items-center">
                <a-progress
                  type="dashboard"
                  :percent="Math.round((order.paid / order.total) * 100)"
                  :width="70"
                />
                <span class="ml-1">
                  <p>已支付: {{ order.paid }}</p>
                  <p>总订单: {{ order.total }}</p>
                </span>
              </div>
            </div>
            <footer class="card__footer">今日订单: {{ order.dayTotal }}</footer>
          </template></a-card
        >
      </div>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <a-card class="card" size="small" :loading="isLoading">
          <template v-if="!isLoading">
            <p class="card__title">销量排行</p>
            <div class="card__content">
              <p
                class="product"
                v-for="{ title, totalSales } in salesRanking.list"
                :key="title"
              >
                <span>{{ title }}</span>
                <span>{{ totalSales }}单</span>
              </p>
            </div>
            <footer class="card__footer">
              <span class="flex-1">总计: {{ salesRanking.total }}单</span>
              <a style="color: #1890ff">查看更多</a>
            </footer>
          </template></a-card
        >
      </div>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <a-card class="card" size="small" :loading="isLoading">
          <template v-if="!isLoading">
            <p class="card__title">活动效果</p>
            <div class="card__content">
              <h2>{{ activityResults.percent }}%</h2>
              <a-progress
                :show-info="false"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
                :percent="activityResults.percent"
              />
            </div>
            <footer class="card__footer">
              总计: {{ activityResults.totalOrder }}单
            </footer>
          </template></a-card
        >
      </div>
    </a-col>
  </a-row>
</template>

<style lang="scss">
@use "sass:math";
.card {
  overflow: hidden;
  background: #fff;
  margin-bottom: 16px;
  height: 177px;
  &__title {
    color: #789;
  }

  &__content {
    height: 100px;
    padding: 16px 0;
    .number {
      font-size: 28px;
    }

    .product {
      display: flex;
      align-items: center;
      &::before {
        $size: 10px;
        content: "";
        display: inline-block;
        width: $size;
        height: math.div($size, 2);
        color: #fff;
        border-radius: 4px;
        margin-right: 8px;
      }
      span:nth-child(1) {
        width: 100px;
      }

      &:nth-child(1) {
        &::before {
          background: #ff7418;
        }
      }

      &:nth-child(2) {
        &::before {
          background: #ffd518;
        }
      }
      &:nth-child(3) {
        &::before {
          background: #ffe818;
        }
      }
    }
  }

  &__footer {
    display: flex;
    border-top: 1px solid #eee;
    padding-top: 8px;
  }
}
</style>
