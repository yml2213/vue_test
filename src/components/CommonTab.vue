<template>
  <div class="tags">

    <el-tag
        :key="tag.name"
        v-for="(tag,index) in tags"
        :closable="tag.name !== 'home'"
        :disable-transitions="false"
        :effect="$route.name === tag.name ? 'dark' : 'plain'"
        @click="changeMenu(tag)"
        @close="handleClose(tag,index)"
    >
      {{ tag.label }}
    </el-tag>

  </div>


</template>

<script>
import {defineComponent} from "vue";
import {useStore} from 'vuex'
import {useRouter, useRoute} from "vue-router";

export default defineComponent({
  setup() {
    let store = useStore();
    const route = useRoute();
    const router = useRouter()
    const tags = store.state.tabsList;
    const changeMenu = (item => {
      router.push(item.name);
    });
    const handleClose = (tag, index) => {
      let length = tags.length - 1;
      store.commit('closeTab', tag);

      if (tag.name !== route.name) {
        return;
      }
      if (index === length) {
        console.log(index);
        router.push({
          name: tags[index - 1].name
        });
      }else{
        router.push({
          name: tags[index].name
        });
      }
    }
    return {
      tags,
      changeMenu,
      handleClose,
    }
  },

})

</script>
<style lang="less" scoped>
.tags {
  padding: 20px;
  width: 100%;
  .el-tag {
    margin-right: 15px;
    cursor: pointer
  }
}
</style>
