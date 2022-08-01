import { http } from "@/http";
import arr2tree from '@any86/array-to-tree';
import { ref, reactive, computed, watch } from "vue";
import { pathToRegexp } from 'path-to-regexp';
import { useRoute } from "vue-router";

type ResponseData = [
  { name: string; menuUrl?: string; id: string; pid?: string; icon?: string },
];


export default function () {
  const isLoading = ref(true);
  const route = useRoute();
  // id为键, pid为值
  const menuIdAndMenuPidMap = reactive<KV<string>>({});

  const selectedKeys = ref<string[]>([]);
  const openKeys = ref<string[]>([]);
  const menuList = ref<ResponseData>()
  // 树
  const menuTree = computed(() => {
    if (menuList.value) {
      return arr2tree(menuList.value, {
        KEY_ID: 'id',
        KEY_PID: 'pid',
        transform: (node) => {
          if (node.id) {
            if (node.pid) menuIdAndMenuPidMap[node.id] = node.pid;
          }
          return node;
        },
      });
    }
  });

  const currentPathMenuId = computed(() => {
    const { matched } = route;
    const pathRule = matched[matched.length - 1].path;
    const regexp = pathToRegexp(pathRule);
    if (menuList.value) {
      const menuItem = menuList.value.find(({ menuUrl }) => menuUrl && regexp.test(menuUrl));
      if (menuItem) {
        return menuItem.id;
      }
    }
  })

  watch([currentPathMenuId,menuIdAndMenuPidMap], ([currentPathMenuId,menuIdAndMenuPidMap]) => {
    if (currentPathMenuId) {
      selectedKeys.value = [currentPathMenuId];
      const pid = menuIdAndMenuPidMap[currentPathMenuId];
      console.log(menuIdAndMenuPidMap, currentPathMenuId, menuIdAndMenuPidMap[currentPathMenuId]);
      if (pid) {
        openKeys.value = [menuIdAndMenuPidMap[currentPathMenuId]];
      }
    }
  }, { immediate: true })


  http.get<ResponseData>('/global/menu').then(({ data }) => {
    menuList.value = data;
    isLoading.value = false;
  });

  return [isLoading, reactive(menuTree), selectedKeys, openKeys] as const

}