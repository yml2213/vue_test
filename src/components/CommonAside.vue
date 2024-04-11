<template>
  <el-aside :width="$store.state.isCollapse ? '180px' : 'auto'">
    <el-menu
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        :collapse-transition="false"
    >
      <h3>评论系统 </h3>
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
        label: "主程序",
        icon: 'HomeFilled',
        url: 'Home.vue'
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
