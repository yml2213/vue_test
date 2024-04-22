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
            <el-table-column fixed prop="count" label="账号" width="150"/>
            <el-table-column prop="comments" label="评论内容" width="120"/>
            <el-table-column prop="status" label="评论状态" width="120"/>

          </el-table>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive, watch} from "vue";
import {ElMessage, ElLoading} from "element-plus";

const showUpload = ref(true);

const instructionsFlag = ref(false)
const fileList = ref([]);
const commentTableData = ref('');
const userData = [
  {token: '', salt: '', did: '', egid: '', api_st: ''},
  // 可以有更多的数据对象
];
const comments = ref('2222');
const inputUrl = ref('22');
const inputProxy = ref('22');
const inputCommentCount = ref(3);
const myData = ref({});
const tableData = ref([]);

const ACCEPTED_EXTENSIONS = ['txt'];
const loadingInstance = ref(null); // 加载框实例
const {proxy} = getCurrentInstance();

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
      let flag = true;
      // 模拟上传，这里用 setTimeout 模拟上传过程
      try {
        //展示出表单
        const dataArray = fileContent.split("\n");
        for (let data of dataArray) {
          // 再次以 "----" 分割数据，并将分割后的值赋值给 userData 数组中的对象属性
          const parts = data.split('----');
          if (parts.length == 6 || parts.length == 1) {
            flag = true;
            userData.push({
              token: parts[0],
              salt: parts[1],
              did: parts[2],
              egid: parts[3],
              api_st: parts[4],
            });
            console.log(userData)
          } else {
            flag = false;
            break;
          }
        }

        if (flag) {
          showUpload.value = false;
          ElMessage.success("文件解析成功")
        } else {
          ElMessage.error('请检查格式,文件解析失败');
        }
        return flag;

      } catch (error) {
        ElMessage.error('文件解析失败');
      } finally {
        // 隐藏加载框
        loadingInstance.value?.close();
        console.log(userData.length);
        userDatatotalRows.value = userData.length - 1;
        //清空数据
        this.fileList = [];
      }
    }
    reader.onerror = () => {
      console.error('文件解析失败:', reader.error);
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

   myData.value = {
    "userData": userData.value,
    "inputUrl": inputUrl.value,
    "inputProxy": inputProxy.value,
    "inputCommentCount": inputCommentCount.value,
    "comments":comments.value
  }

  if (userData.length == 1) {
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
  if (comments.value == '') {
    ElMessage.error("评论内容为空！");
    return;
  }

  startFlag.value = true;
  const startId = document.getElementById("startId");
  startId.innerText = "运行中";
  startId.disabled = true; // 禁用按钮
  startId.removeEventListener("click", this.start); // 取消点击事件绑定
  startId.setAttribute('type', 'danger'); // 设置按钮类型为 "danger"

  //上传配置
  upSettings();
  //开启定时任务
  startTimer();

}
const upSettings = async () => {
  try {
    let data = await proxy.$api.upSettings(myData.value);
    ElMessage.success("上传配置成功,马上开始执行任务，请勿刷新或者退出软件！");

  } catch (error) {
    console.error("Error fetching data:", error);
    ElMessage.error("获取数据失败：" + error.message);
  }

};

const getUserOperLog = async () => {
  try {
    let data = await proxy.$api.doTask();
    tableData.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
    ElMessage.error("获取数据失败：" + error.message);
  }

};

let timerId = null; // Initialize timerId variable

const startTimer = () => {
  timerId = setInterval(() => {
    getUserOperLog(); // Call getUserData function every 2 seconds
  }, 10000);
};

const stopTimer = () => {
  clearInterval(timerId);
  stopTask();
  // Stop the timer
};
// 监听 tableData 的变化
watch(tableData, (newValue, oldValue) => {
  //tableData.value = newValue;
});

const stopTask = async () => {
  try {
    let data = await proxy.$api.stopTask();
    console.log(data)
  } catch (error) {
    console.error("Error fetching data:", error);
    ElMessage.error("获取数据失败：" + error.message);
  }

};

function stop() {
  if (startFlag.value) {
    startFlag.value = false;
  }
  const startId = document.getElementById("startId");
  startId.innerText = "开始运行";
  startId.disabled = false; // 禁用该元素
  ElMessage.success("停止成功");
  stopTimer()
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
