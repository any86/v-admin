import { http } from "@/http";
import arr2tree from '@any86/array-to-tree';
import { ref, reactive, computed, watch } from "vue";
import { pathToRegexp } from 'path-to-regexp';
import { useRoute } from "vue-router";

type ResponseData = [
  { name: string; menuUrl?: string; id: string; pid?: string; icon?: string },
];


export default async function () {
  const isLoading = ref(true);
  const route = useRoute();

  try {
    const { data } = await http.get<ResponseData>('/global/menu');
    // id为键, pid为值
    const menuIdAndMenuPidMap: KV<string> = {};
    // 列表
    const menuList = data;
    // 树
    const menuTree = arr2tree(data, {
      KEY_ID: 'id',
      KEY_PID: 'pid',
      transform: (node) => {
        if (node.id) {
          if (node.pid) menuIdAndMenuPidMap[node.id] = node.pid;
        }
        return node;
      },
    });

    const currentPathMenuId = computed(() => {
      const { matched } = route;
      const pathRule = matched[matched.length - 1].path;
      const regexp = pathToRegexp(pathRule);
      const menuItem = menuList.find(({ menuUrl }) => menuUrl && regexp.test(menuUrl));
      if (menuItem) {
        return menuItem.id;
      }
    })

    //   watch()

    // watch: {
    //   currentPathMenuId: {
    //     handler(currentPathMenuId: string) {
    //       // console.log(currentPathMenuId);
    //       if (currentPathMenuId) {
    //         this.selectedKeys = [currentPathMenuId];
    //         this.openKeys = [this.$store.state.menuIdAndMenuPidMap[currentPathMenuId]];
    //       }
    //     },
    //     immediate: true,
    //   },
    // },


    return [isLoading, reactive(menuTree)]
  } catch (error) {
    throw error;
  } finally {
    isLoading.value = false;
  }
}