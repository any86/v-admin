<script setup lang="ts">
import { ref, h, resolveComponent, watch } from 'vue';
import { http } from '@/http';
import { type TableColumnsType } from 'ant-design-vue';
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import Add from './User/Add.vue';
import Detail from './User/Detail.vue';
import Edit from './User/Edit.vue';
import HttpSelector from '@/components/HttpSelector.vue';
import { getDepartmentOptions } from '@/shared';
type Row = {
  userId: string;
  userName: string;
  age: number;
  sex: 1 | 2;
  realName: string;
  department: string;
  avatar: string;
  state: 0 | 1 | 2;
  joinDate: string;
  email: string;
  position: string;
  role: string;
};

type ResponseData = {
  list: Row[];
  total: string;
};

// 默认条件
const CONDITION_DEFAULT = {
  keywords: null,
  sex: null,
  state: null,
  department: null,
  range: null,
};

// 筛选条件
// 复制一份, 保留默认值
const formDataCondition = ref({ ...CONDITION_DEFAULT });
// 是否显示更多筛选条件
const isShowMoreCondition = ref(true);

// 列配置
const columns: TableColumnsType = [
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '账户',
    dataIndex: 'userName',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '性别',
    customRender({ record }: { record: Row }) {
      const { sex } = record;
      const map = {
        1: ['blue', '男'],
        2: ['pink', '女'],
      } as const;

      const color = map[sex][0];
      const text = map[sex][1];
      // 插槽的内容用函数性能更优
      return h(resolveComponent('a-tag'), { color }, () => text);
    },
  },

  {
    title: '年龄',
    dataIndex: 'age',
  },

  {
    title: '角色',
    dataIndex: 'role',
  },

  {
    title: '岗位',
    dataIndex: 'position',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },

  {
    title: '入职日期',
    dataIndex: 'joinDate',
  },
  {
    title: '状态',
    customRender({ record }: { record: Row }) {
      const { state } = record;
      const map = {
        0: ['#999', '锁定'],
        1: ['#009688', '正常'],
        2: ['#f00', '离职'],
      };
      const type = map[state][0];
      const text = map[state][1];
      return h(resolveComponent('a-badge'), { color: type, text });
    },
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 250,
  },
];

// 表格的选择
// 注意table组件上一定要指定rowKey属性才能生效
const selectedRowKeys = ref<string[]>([]);
function onTableSelectChange(keys: string[]) {
  selectedRowKeys.value = keys;
}

// 分页
const pageCurrent = ref(1);
const pageSize = ref(10);
const pageCount = ref(0);
const isLoading = ref(true);
const dataSouce = ref<Row[]>([]);

function onPageSizeChange(current: number, size: number) {
  pageSize.value = size;
  pageCurrent.value = 1;
}

// 重置条件
// 并加载数据
function reset() {
  formDataCondition.value = { ...CONDITION_DEFAULT };
  getList();
}

// 加载数据
function getList() {
  isLoading.value = true;
  http
    .get<ResponseData>('/user', {
      params: { page: pageCurrent.value, pageSize: pageSize.value, ...formDataCondition.value },
    })
    .then(({ data }) => {
      const { list, total } = data;
      dataSouce.value = list;
      isLoading.value = false;
      pageCount.value = ~~total;
    });
}
watch([pageCurrent, pageSize], getList, { immediate: true });

// ========= 删除 =========
async function remove(idList: string[]) {
  const { status } = await http.delete('/user', { params: { idList } });
  if (200 == status) {
    getList();
  }
}

// 新增
const addRef = ref<typeof Add | undefined>();
// 详情
const detailRef = ref<typeof Detail | undefined>();
// 编辑
const editRef = ref<typeof Edit | undefined>();
</script>

<template>
  <div class="page-user">
    <!-- 详情 -->
    <Detail ref="detailRef" />

    <!-- 编辑 -->
    <Edit ref="editRef" @success="getList" />

    <!-- 新增 -->
    <Add ref="addRef" @success="getList" />

    <a-card>
      <a-space>
        <a-button type="primary" @click="addRef?.show"><plus-outlined />添加用户</a-button>
        <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="remove(selectedRowKeys)">
          <a-button v-show="selectedRowKeys.length > 0" type="primary" danger
            >批量删除({{ selectedRowKeys.length }}条)</a-button
          >
        </a-popconfirm>
      </a-space>

      <a-form class="mt-2" layout="inline" :labelCol="{ style: { width: '80px' } }">
        <a-row :gutter="[8, 8]">
          <a-col :span="8">
            <a-form-item label="关键词">
              <a-input
                v-model:value="formDataCondition.keywords"
                placeholder="请输入账号/姓名/手机号"
                allowClear
              ></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item label="入职时间">
              <a-range-picker
                v-model:value="formDataCondition.range"
                :placeholder="['请输入开始时间', '请输入结束时间']"
                allowClear
              ></a-range-picker>
            </a-form-item>
          </a-col>

          <a-col v-show="isShowMoreCondition" :span="8">
            <a-form-item label="性别">
              <a-select v-model:value="formDataCondition.sex" placeholder="请选择性别" allowClear>
                <a-select-option key="1" value="1">男</a-select-option>
                <a-select-option key="2" value="2">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col v-show="isShowMoreCondition" :span="8">
            <a-form-item label="状态">
              <a-select v-model:value="formDataCondition.state" allowClear placeholder="请选择状态">
                <a-select-option key="1" value="1">在职</a-select-option>
                <a-select-option key="2" value="2">离职</a-select-option>
                <a-select-option key="3" value="3">冻结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col v-show="isShowMoreCondition" :span="8">
            <a-form-item label="部门">
              <http-selector
                v-model:value="formDataCondition.department"
                placeholder="请选择部门"
                :get-options="getDepartmentOptions"
              />
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item>
              <a-space>
                <a-button :loading="isLoading" @click="reset">重置</a-button>
                <a-button type="primary" :loading="isLoading" @click="getList"><search-outlined />查询</a-button>
                <a-button @click="isShowMoreCondition = !isShowMoreCondition" type="link">
                  <template v-if="isShowMoreCondition"><up-outlined/>收起</template>
                  <template v-else><down-outlined/>展开</template>
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <a-table
        class="mt-2"
        :loading="isLoading"
        :pagination="false"
        :columns="columns"
        :dataSource="dataSouce"
        :row-key="(row:{userId:string}) => row.userId"
        :row-selection="{ selectedRowKeys, onChange: onTableSelectChange }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" size="small" @click="detailRef?.show(record.userId)"><eye-outlined />详情</a-button>
            <a-button type="link" size="small" @click="editRef?.show(record.userId)"> <edit-outlined />编辑</a-button>

            <a-popconfirm title="确定要删除吗?" ok-text="确定" cancel-text="取消" @confirm="remove([record.userId])">
              <a-button type="link" size="small"><delete-outlined />删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <p class="mt-2" align="right">
        <a-pagination
          v-model:current="pageCurrent"
          :defaultPageSize="pageSize"
          :total="pageCount"
          @showSizeChange="onPageSizeChange"
        />
      </p>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
.page-user {
  min-height: 100vh;
  &__header {
    background-color: #fff;
  }
}
</style>
