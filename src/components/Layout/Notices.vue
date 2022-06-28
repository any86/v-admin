<script lang="ts">
import { defineComponent } from 'vue';
import { BellOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

type Row = {
  id: string;
  avatar: string;
  title: string;
  datetime: string;
  type: 'notification' | 'event' | 'message';
  description: string;
  extra: string;
  status: string;
  read: boolean;
};

export default defineComponent({
  name: 'Notices',

  components: { BellOutlined },

  props: {
    containorEl: {
      type: Object,
    },
  },

  data() {
    return {
      activeKey: 0,
      tabsData: [
        { title: '通知', unreadCount: 0, children: [] as Row[] },
        { title: '消息', unreadCount: 0, children: [] as Row[] },
        { title: '代办', unreadCount: 0, children: [] as Row[] },
      ],
    };
  },

  computed: {
    unreadCount() {
      let count = 0;
      this.tabsData.forEach(({ unreadCount }) => {
        count += unreadCount;
      });
      return count;
    },
  },

  async mounted() {
    return;
    const TYPE_MAP = {
      notification: 0,
      event: 1,
      message: 2,
    };

    const { data } = await this.$http.get<Row[]>('/notices');

    for (const item of data) {
      const { type, read } = item;
      const index = TYPE_MAP[type];
      this.tabsData[index].children.push(item);

      if (!read) {
        this.tabsData[index].unreadCount++;
      }
    }
  },

  methods: {
    /**
     * 防止滚动时, dropmenu跟随滚动条移动
     */
    getPopupContainer() {
      return document.querySelector('.ant-layout-header');
    },

    /**
     * 标记已读
     */
    markRead(index: number, item: Row) {
      if (item.read) return;
      item.read = true;
      this.tabsData[index].unreadCount--;
    },

    /**
     * 标记全部已读
     */
    markAllRead(index: number) {
      this.tabsData[index].children.forEach((item) => {
        item.read = true;
      });
      this.tabsData[index].unreadCount = 0;
    },

    /**
     * 查看更多
     */
    showMore() {
      message.success('点击了"查看更多"');
    },
  },
});
</script>

<template>
  <a-dropdown trigger="click" :getPopupContainer="getPopupContainer">
    <a class="btn-bell" title="消息"
      ><a-badge :count="unreadCount"> <BellOutlined class="icon-lg" /> </a-badge
    ></a>
    <template #overlay>
      <a-menu>
        <a-tabs v-model:activeKey="activeKey" centered :tabBarStyle="{ padding: '0 16px', width: '320px' }">
          <a-tab-pane
            v-for="(data, index) in tabsData"
            :key="index"
            :tab="data.title + (0 === data.unreadCount ? '' : `(${data.unreadCount})`)"
          >
            <a-list>
              <a-list-item
                class="list-item"
                :class="{ 'list-item--read': item.read }"
                v-for="item in data.children"
                :key="item.id"
                @click="markRead(index, item)"
              >
                <a-list-item-meta>
                  <template #title>
                    {{ item.title }}
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.avatar" />
                  </template>

                  <template #description>
                    {{ item.description }}
                    <p align="right">
                      {{ item.datetime }}
                    </p>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
        <div class="buttons">
          <a @click="markAllRead(activeKey)">清空未读</a>
          <a @click="showMore">查看更多</a>
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style lang="scss" scope>
.list-item {
  padding:8px 16px;
  &:hover {
    cursor: pointer;
  }

  &--read {
    opacity: 0.3;
  }
}

.buttons {
  display: flex;
  border-top: 1px solid #efefef;
  > a {
    flex: 1;
    line-height: 50px;
    text-align: center;
    & + a {
      border-left: 1px solid #efefef;
    }
  }
}
</style>
