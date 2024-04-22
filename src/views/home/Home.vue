<!--suppress ALL -->
<template>
  <div class="common-layout">
    <el-container>

      <el-aside width="800px">
        <el-button type="pr" @click="instructionsFlag  = true"
        >查看使用说明
        </el-button
        >
        <div style="height:150px;border:1px solid gray;padding: 20px ;margin-bottom:20px">
          主页url:
          <el-input v-model="inputUrl" style="width: 240px" placeholder="请输入信息"/>
          代理：
          <el-input v-model="inputProxy" style="width: 240px;margin-right: 20px" placeholder="请输入代理"/>
          <el-button type="primary" @click="proxyTest(inputProxy)">测试</el-button>
          <br>
          <br>
          主页评论数量：
          <el-input-number v-model="inputCommentCount" :min="1" :max="100"/>
          个
          <br>
          <br>
          <el-button type="success" size="large" @click="start()" id="startId">开始运行</el-button>
          <el-button type="danger" size="large" @click="stop()" id="startId">停止</el-button>


          <el-drawer
              v-model="instructionsFlag"
              title="使用说明"
              direction="rtl"
              size="50%"
          >
            <p>1.第一步带入账号</p>
            <p>2.第二部填写"主页url"</p>
            <p>3.填写代理并测试</p>
            <p>4.自定义评论内容</p>
            <p>5.点击开始运行（右侧可以看运行日志，非实时刷新，有3秒延迟）</p>

          </el-drawer>
        </div>
        <div>
          账号信息：（拖拽上传,只支持txt文件）
          <el-button type="warning" style="margin-bottom: 10px" :disabled="showUpload" @click="showUpload=true">显示导入
          </el-button>

          <el-upload
              class="upload-demo"
              drag
              :file-list="fileList"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              :limit="1"
              v-show="showUpload"
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              拖动文件到这里<em>点击上传</em>
            </div>
          </el-upload>
        </div>

        <div class="userClass" style="height: 300px" v-show="!showUpload">
          <div class="table-container">
            <el-table :data="userData" style="width: 100%" height="250">
              <el-table-column prop="token" label="Token" width="150"/>
              <el-table-column prop="salt" label="Salt" width="120"/>
              <el-table-column prop="did" label="Did" width="120"/>
              <el-table-column prop="egid" label="Egid" width="320"/>
              <el-table-column prop="api_st" label="Api St" width="600"/>
            </el-table>
          </div>
          <div class="pagination-container">
            <el-pagination background
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 50]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="userDatatotalRows"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"/>
          </div>
        </div>
        <el-input
            v-model="comments"
            style="width: 100%"
            :autosize="{ minRows: 6.5, maxRows: 60 }"
            type="textarea"
            placeholder="评论内容,一行一个，最大支持60行"
        />

      </el-aside>
      <el-main>
        <div class="custom-table-container">
          <el-table :data="tableData" style="width: 90%; height: 700px;">
            <el-table-column fixed prop="col1" label="Date" width="150"/>
            <el-table-column prop="co2" label="Name" width="120"/>
            <el-table-column prop="col3" label="State" width="120"/>

          </el-table>
        </div>
        <div class="custom-pagination-container">
          <el-pagination background
                         :current-page="currentPage"
                         :page-sizes="[10, 20, 30, 50]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="userDatatotalRows"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {ElMessage, ElLoading} from "element-plus";

const showUpload = ref(true);

const instructionsFlag = ref(false)
const fileList = ref([]);
const commentTableData = ref('');
const userData = [
  {token: '', salt: '', did: '', egid: '', api_st: ''},
  // 可以有更多的数据对象
];
const comments = ref('');
const inputUrl = ref('');
const inputProxy = ref('');
const inputCommentCount = ref(3);

const tableData = [];
const nodeData = {userData, inputUrl, inputProxy, inputCommentCount}

const ACCEPTED_EXTENSIONS = ['txt'];
const loadingInstance = ref(null); // 加载框实例
const {proxy} = getCurrentInstance();
const currentPage = ref(1); // 当前页数
const pageSize = ref(10); // 每页条数
const userDatatotalRows = ref(userData.length); // 总条数


function beforeUpload(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    ElMessage({
      type: 'error',
      message: '仅支持txt格式的文件',
    });
    return false;
  }
  if (file != null) {
    // 使用 FileReader 进行文件读取
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      console.log('File content:', reader.result);

      // 显示加载框
      loadingInstance.value = ElLoading.service({
        text: '解析中，请稍后', // 加载框文字提示
      });
      // 模拟上传，这里用 setTimeout 模拟上传过程
      setTimeout(() => {
        try {
          readUploadedFile(fileContent).then((res) => {
            this.userData = res.data;
            //展示出表单
            showUpload.value = false;
            const dataArray = fileContent.split("\n");
            dataArray.forEach(data => {
              // 再次以 "----" 分割数据，并将分割后的值赋值给 userData 数组中的对象属性
              const parts = data.split('----');
              userData.push({
                token: parts[0],
                salt: parts[1],
                did: parts[2],
                egid: parts[3],
                api_st: parts[4],
              });
              console.log(userData)
            });
            console.log(fileContent);
          }).catch((res) => {

            const dataArray = fileContent.split("\n");
            dataArray.forEach(data => {
              // 再次以 "----" 分割数据，并将分割后的值赋值给 userData 数组中的对象属性
              const parts = data.split('----');
              userData.push({
                token: parts[0],
                salt: parts[1],
                did: parts[2],
                egid: parts[3],
                api_st: parts[4],
              });
              console.log(userData)
            });

            //展示出表单
            showUpload.value = false;
            ElMessage.error('文件上传失败');
          })
        } catch (error) {
          console.error('Error reading file:', error);
          ElMessage.error('文件上传失败');
        } finally {
          // 隐藏加载框
          loadingInstance.value?.close();
          //清空数据
          this.fileList = [];
        }
      }, 2000); // 模拟上传延迟2秒
    };
    reader.onerror = () => {
      console.error('Error reading file:', reader.error);
    };
    reader.readAsText(file);
  }
  return true;
}

function proxyTest(proxyUrl) {
  console.log(proxyUrl)
  if (proxyUrl == null || proxyUrl.length == 0 || proxyUrl == undefined) {
    ElMessage.error("代理地址不能为空")
  } else {
    ElMessage.success("代理成功")
  }
}

const startFlag = ref(false);

function start() {

  const myData = {

    "userData":userData.value,
    "inputUrl": inputUrl.value,
    "inputProxy": inputProxy.value,
    "inputCommentCount":inputCommentCount.value
  }
  console.log(`===============`)

  if (userData.value == '') {
    ElMessage.error("账号参数不正确！");
    return;
  }
  if (inputUrl.value == '') {
    ElMessage.error("主页url不正确！");
    return;
  }
  if (inputProxy.value == '') {
    ElMessage.error("代理未配置！");
    return;
  }
  const getUserData = async () => {
    let res = await proxy.$api.getData(myData);
    // console.log(res)
    // console.log(`--------`)

    this.tableData = res.data;
    console.log(this.tableData);

  };

  startFlag.value = true;
  const startId = document.getElementById("startId");
  startId.innerText = "运行中";
  startId.disabled = true; // 禁用按钮
  startId.removeEventListener("click", this.start); // 取消点击事件绑定
  startId.setAttribute('type', 'danger'); // 设置按钮类型为 "danger"
  ElMessage.warning("运行中，请勿刷新或者退出软件！");
  getUserData();


}


function stop() {
  if (startFlag.value) {
    startFlag.value = false;
  }
  const startId = document.getElementById("startId");
  startId.innerText = "开始运行";
  startId.disabled = false; // 禁用该元素
  ElMessage.success("停止成功");
}


// 分页组件大小变化时触发
function handleSizeChange(val) {
  pageSize.value = val;
}

// 分页组件当前页变化时触发
function handleCurrentChange(val) {
  currentPage.value = val;
}

/**
 * 文件选择改变时触发
 */
const handleFileUpload = (file, fileListVal) => {
  fileList.value = fileListVal;
  console.log(fileListVal)
  const uploadedFile = fileListVal[0].raw; // 获取上传的文件对象

}

async function readUploadedFile(file) {
  // await proxy.$api.uploadTxt(file);
}

function beforeRemove(file, fileListVal) {
  fileList.value = fileListVal;
}


</script>
<style scoped>
.common-layout {
  overflow: auto;
  height: 100vh; /* 可以根据需要设置容器的高度 */
}

.custom-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px; /* 调整表格容器与分页组件之间的间距 */
}

.custom-pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 10px; /* 调整分页组件与表格之间的间距 */
}

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px; /* 调整表格容器的高度 */
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 10px; /* 调整分页组件与表格之间的间距 */
}

</style>
