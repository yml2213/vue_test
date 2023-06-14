<!--suppress JSValidateTypes -->
<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" plain style="margin-right: 10px" @click="handleCollapse">
        <el-icon>
          <Menu/>
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{ current.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
    <span class="el-dropdown-link">
      <img class="user" :src="getImgSrc('user')" alt="">
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>

</template>

<script>
import {computed, defineComponent} from "vue";
import {useStore} from 'vuex'
import router from "../router/index.js";
import {ElMessage} from "element-plus";

export default defineComponent({
  setup() {
    let store = useStore();
    let getImgSrc = (user) => {
      return new URL(`../assets/images/${user}.jpg`, import.meta.url).href;
    };
    let handleCollapse = () => {
      store.commit('updateIsCollapse', "1234")
    };
    const logout = () =>{
      store.commit('cleanMenu');
      router.push('login');
      ElMessage.success("退出成功");
    }
    const current = computed(() => {
     return  store.state.currentMenu;

    })
    return {
      getImgSrc,
      handleCollapse,
      current,
      logout
    }
  }
})

</script>
<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #333;
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-left: 20px;
  }

  h3 {
    color: #fff;
  }
}
:deep(.bread span){
  color: #fff !important;
  cursor:  pointer !important;
}
</style>
