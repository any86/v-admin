<script lang="ts">
import { defineComponent, onMounted } from "vue";
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
    onMounted(async () => {
      const response = await http.get<ResponseData>("/summary");
      response.data;
    });
  },
});
</script>

<template>
  <a-row :gutter="16">
    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <p class="card__title">总销售额</p>
        <div class="card__content">
          <p class="number">¥ 98430</p>
          <span>周同比12% <CaretUpFilled /></span>
          <span>日同比11% <CaretDownFilled /></span>
        </div>
        <footer>日销售额:¥ 1231</footer>
      </div>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <p class="card__title">已支付/总订单数</p>
        <div class="card__content">
          <div class="d-flex align-items-center">
            <a-progress type="dashboard" :percent="70" :width="70" />
            <span class="ml-1">
              <p>已支付: 7111</p>
              <p>总订单: 12223</p>
            </span>
          </div>
        </div>
        <footer>日销售额:¥ 232</footer>
      </div>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <p class="card__title">销量排行</p>
        <div class="card__content">
          <p class="product">
            <span>小米手机</span>
            <span>12334单</span>
          </p>
          <p class="product"><span>华为手机</span> <span>3634单</span></p>
          <p class="product"><span>诺基亚手机</span> <span>1233单</span></p>
        </div>
        <footer class="d-flex">
          <span class="flex-1">总计: 12313123单</span>
          <a style="color: #1890ff">查看更多</a>
        </footer>
      </div>
    </a-col>

    <a-col :xs="24" :sm="12" :lg="6">
      <div class="card">
        <p class="card__title">活动效果</p>
        <div class="card__content">
          <h2>85%</h2>
          <a-progress
            :show-info="false"
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#87d068',
            }"
            :percent="85"
          />
        </div>
        <footer class="d-flex">总计: 12313123单</footer>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="scss">
@use "sass:math";
.card {
  overflow: hidden;
  padding: 8px 16px;
  box-shadow: 0 0 8px 1px rgba(#000, 0.1);
  margin-bottom: 16px;
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

  > footer {
    border-top: 1px solid #eee;
    padding-top: 8px;
  }
}
</style>
