<template>
  <div class="user-header">
    <el-button type="primary" class="insertBtn" @click="handleAdd">
      + 新增
    </el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item>
        <el-input v-model="formInline.keyword" placeholder="请输入用户名或地址"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">

    <el-table :data="list" stripe style="width: 100%">
      <el-table-column v-for="item in tableLabel"
                       :key="item.prop"
                       :label="item.label"
                       :prop="item.prop"
                       :width="item.width"/>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)"> 编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="config.total"
        :page-size="config.limit"
        class="pager"
        @current-change="changePage"
    />
  </div>
  <el-dialog
      v-model="dialogVisible"
      width="40%"
      :before-close="handleClose"
      :title=" (action === 'add') ? '新增用户' : '编辑用户'"
  >
    <el-form :inline="true" :model="formUser" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name" :rules="[
          {required: true, message: '姓名是必填项'}
        ]">
            <el-input v-model="formUser.name" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item type="number" label="年龄" prop="age" :rules="[
          {required: true, message: '年龄是必填项'},
          {type: 'number',message: '请输入数字'},
        ]">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex" :rules="[
          {required: true, message: '性别是必填项'},
        ]">
            <el-select v-model="formUser.sex" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth" :rules="[
          {required: true, message: '出生日期是必填项'},
        ]">
            <el-date-picker
                v-model="formUser.birth"
                type="date"
                label="出生日期"
                placeholder="请输入出生日期"
                style="width: 100%"
                value-format="YYYY-MM-DD">

            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址" prop="addr" :rules="[
          {required: true, message: '地址是必填项'},
        ]">
            <el-input v-model="formUser.addr" placeholder="请输入地址"/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
  setup: function () {
    const list = ref([]);
    const tableLabel = reactive([
      {
        prop: "name",
        label: "姓名",
      },
      {
        prop: "age",
        label: "年龄",
      },
      {
        prop: "sexLabel",
        label: "性别",
      },
      {
        prop: "birth",
        label: "出生日期",
        width: 200,
      },
      {
        prop: "addr",
        label: "地址",
        width: 320,
      },

    ])
    const config = reactive({
      page: 1,
      limit: 10,
      total: 0
    });

    const {proxy} = getCurrentInstance();
    onMounted(() => {
      getUserData(config);
    });

    const getUserData = async (config) => {
      let res = await proxy.$api.getUserData(config);
      config.total = res.total;
      console.log(config.total);
      list.value = res.list.map(item => {
        item.sexLabel = item.sex === 0 ? '男' : '女'
        return item;
      });
    };
    const changePage = (page) => {
      console.log(page);
      config.page = page;
      getUserData(config);
    };
    const formInline = reactive({
      keyword: ""
    });
    const handleSearch = () => {
      config.name = formInline.keyword;
      getUserData(config);
    }
    const dialogVisible = ref(false);
    const handleClose = (done) => {
      ElMessageBox.confirm('确定关闭吗', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        proxy.$refs.userForm.resetFields();
        done()
      })
      .catch(() => {

      })
    };
    const formUser = reactive({
      name: "",
      age: "",
      sex: "",
      birth: "",
      addr: ""

    });

    const onSubmit = async () => {
      proxy.$refs.userForm.validate(async (valid) => {
        if (valid) {
          if (action.value === 'add') {
            let res = await proxy.$api.createUser(formUser);
            if (res) {
              console.log("执行新增用户方法成功");
              proxy.$refs.userForm.resetFields();
              proxy.dialogVisible = false;
              await getUserData(config);
            }
          } else {
            formUser.sex === 1 ? formUser.sex = '男' : formUser.sex = '女';
            let res = await proxy.$api.updateUser(formUser);
            if (res) {
              console.log("执行修改用户方法成功");
              proxy.$refs.userForm.resetFields();
              dialogVisible.value = false;
              await getUserData(config);
            }
          }

        } else {
          ElMessage({
            showClose: true,
            message: "请输入正确的内容",
            type: "error"
          })

        }
      });

    }
    const cancel = async () => {
      proxy.$refs.userForm.resetFields();
      dialogVisible.value = false;
      await getUserData(config);
    };
    const action = ref('add');
    const handleEdit = (row) => {

      action.value = 'edit';
      dialogVisible.value = true;
      row.sex === 1 ? row.sex = '男' : row.sex = '女';
      //将当前行数据浅拷贝到formUser里
      proxy.$nextTick(() => {
        Object.assign(formUser, row);
      })
    };
    const handleAdd = () => {
      action.value = 'add';
      dialogVisible.value = true;
    }
    const handleDelete = (row) => {
      ElMessageBox.confirm('确定删除这一条数据吗', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        let res = await proxy.$api.deleteUser({
          id: row.id
        });
        console.log(res);
        if (res) {
          ElMessage({
            showClose: true,
            message: "删除成功",
            type: "success"
          })
          await getUserData(config);
        } else {
          ElMessage({
            showClose: true,
            message: "删除失败",
            type: "error"
          })
        }

      })
      .catch(() => {
      })
    }
    return {
      list,
      tableLabel,
      config,
      changePage,
      formInline,
      handleSearch,
      dialogVisible,
      handleClose,
      formUser,
      onSubmit,
      cancel,
      action,
      handleEdit,
      handleAdd,
      handleDelete
    }
  }
})
</script>

<style lang="less" scoped>
.table {
  position: relative;
  height: 100%;

  .pager {
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }

  .insertBtn {
    margin-bottom: 25px;
  }
}

.user-header {
  display: flex;
  justify-content: space-between
}

</style>
