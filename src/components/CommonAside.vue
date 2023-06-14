<template>
  <el-aside :width="$store.state.isCollapse ? '180px' : 'auto'">
    <el-menu
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :collapse="!$store.state.isCollapse"
        :collapse-transition="false"
    >
      <h3 v-show="$store.state.isCollapse">后台管理系统 </h3>
      <h3 v-show="!$store.state.isCollapse">后台 </h3>
      <el-menu-item :index="item.path" v-for="item in noChildren()"
                    :key="item.path"
                    @click="clickMenu(item)">
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu :index="item.path" v-for="item in hasChildren()"
                   :key="item.path">
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="subItem.index"
                        v-for="(subItem,subIndex) in item.children"
                        :key="subIndex"
                        @click="clickMenu(subItem)">
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>

        </el-menu-item-group>

      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
import {useRouter} from 'vue-router'
import {useStore} from "vuex";

export default {
  name: "CommonAside",
  setup() {
    const store = useStore();
    const list = [
      {
        path: '/',
        name: 'home',
        label: "首页",
        icon: 'HomeFilled',
        url: 'Home.vue'
      },
      {
        path: '/mall',
        name: 'mall',
        label: "商品管理",
        icon: 'video-play',
        url: 'Mall.vue'
      },
      {
        path: '/user',
        name: 'user',
        label: "用户管理",
        icon: 'user',
        url: 'User.vue'
      },
      {
        label: '其他',
        icon: 'QuestionFilled',
        path: '/other',
        children: [
          {
            path: "/page1",
            name: "page1",
            label: "页面1",
            icon: "setting",
            url: "PageOne.vue"
          },
          {
            path: "/page2",
            name: "page2",
            label: "页面2",
            icon: "setting",
            url: "PageTwo.vue"
          },
        ]
      }
    ];
    const router = useRouter();
    const asyncList = store.state.menu;
    const noChildren = () => {
      return asyncList.filter((item) => !item.children);
    };
    const hasChildren = () => {
      return asyncList.filter((item) => item.children);
    };
    let clickMenu = (item) => {
      console.log(item.name)
      if (item.name === '/home') {
        item.name = '/';
      }
      router.push({
        name: item.name,
      });


      store.commit('selectMenu', item)
    }
    return {
      hasChildren,
      noChildren,
      clickMenu
    }
  }
}
</script>

<style lang="less" scoped>

.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.el-menu {
  border-right: none;
}

h3 {
  line-height: 48px;
  color: #fff;
  text-align: center;
}

</style>
