import * as echarts from "echarts";
import { http } from "@/http";
import { ref, nextTick, unref, watch, type Ref } from 'vue';

/**
 * 渲染柱形图
 * @param el 元素
 * @param type getData的索引
 */
export function useChartBar(chartRef: Ref<HTMLElement | undefined>, type: Ref<0 | 1>) {
    const isLoading = ref(true);
    const colors = ["#108ee9", '#87d068']

    function renderBar(type: 0 | 1) {
        isLoading.value = true;
        [getSalesData, getVisitData][type]().then(async ([xData, yData]) => {
            isLoading.value = false;
            //  确保chartRef在dom中已生成
            await nextTick();

            // unref用来获取响应数据的真实值
            // 等价于chartRef.value
            const el = unref(chartRef);

            // 实际此时el是一定有的,
            // 但是定义类型的时候有undefined,
            // 所以为了类型推导争取加一个判断
            // 其实也可以直接断言el是HTMLElement
            if (void 0 !== el) {
                // 基于准备好的dom，初始化echarts实例
                const myChart = echarts.init(el);
                // 绘制图表
                myChart.setOption({
                    grid: {
                        top: `5%`,
                        left: `5%`,
                        bottom: "15%",
                        right: "5%",
                    },
                    color: [colors[type]],
                    tooltip: {},
                    yAxis: {
                        // 默认值是value, 表示根据数据生成连续的刻度
                        type: "value",
                    },
                    xAxis: {
                        data: xData,
                    },
                    series: [
                        {
                            name: "销量",
                            type: "bar",
                            data: yData,
                        },
                    ],
                });
            }
        });
    }

    renderBar(type.value);
    watch(type, renderBar);
    return isLoading;
}


/**
 * 获取销售数据
 */
async function getSalesData() {
    const response = await http.get<{ month: string; sales: string }[]>(
        "/sales-amount"
    );
    const monthList: string[] = [];
    const data: string[] = [];
    response.data.forEach(({ month, sales }) => {
        monthList.push(month);
        data.push(sales);
    });
    return [monthList, data];
}

/**
 * 获取访问量
 */
async function getVisitData() {
    const response = await http.get<{ month: string; visit: string }[]>(
        "/visit-amount"
    );
    const monthList: string[] = [];
    const data: string[] = [];
    response.data.forEach(({ month, visit }) => {
        monthList.push(month);
        data.push(visit);
    });
    return [monthList, data];
}

