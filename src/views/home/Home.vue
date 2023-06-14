<!--suppress ALL -->
<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top:10px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.jpg" alt="用户头像">
          <div class="userInfo">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间<span>2023-06-11</span></p>
          <p>上次登录地点<span>广州</span></p>
        </div>

      </el-card>

      <el-card shadow="hover" style="margin-top:20px" height="450px">
        <el-table :data="tableData">
          <el-table-column v-for="(index,item) in tableDataLabel"
                           :key="item" :prop="item" :label="index">

          </el-table-column>

        </el-table>

      </el-card>

    </el-col>
    <el-col :span="16" style="margin-top:20px">
      <div class="num">
        <el-card
            v-for="item in countData"
            :key="item.name"
            :body-style="{display:'flex',padding:0}"
        >
          <component :is="item.icon" :style="{background: item.color}" class="icons"></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card style="height:280px" class="line">
        <div ref="echart" style="height: 280px"></div>
      </el-card>
      <div class="graph">
        <el-card style="height:260px">
          <div ref="userechart" style="height: 240px">

          </div>
        </el-card>
        <el-card style="height:260px">
          <div ref="videoechart" style="height: 240px">

          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import {defineComponent, getCurrentInstance, onMounted, ref, reactive} from "vue";
import * as echarts from 'echarts'

export default defineComponent({

  setup() {
    const {proxy} = getCurrentInstance();
    const tableDataLabel = {
      name: "课程",
      todayBuy: "今日购买",
      monthBuy: "本月购买",
      totalBuy: "总购买"
    }
    let tableData = ref([]);
    let countData = ref([]);
    const getTableList = async () => {
      tableData.value = await proxy.$api.getTableData();
    };
    const getCountData = async () => {
      countData.value = await proxy.$api.getCountData();
    };
    onMounted(async () => {
      await getTableList();
      await getCountData();
      await getChatrsData();
    })
    let xOptions = reactive({
      textStyle: {
        color: "#333",
      },
      grid: {
        left: "20%",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        }
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          }
        }
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
    });
    let pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf"
      ],
      series: [],
    })
    let orderData = reactive({
      xData: [],
      series: [],

    })
    let userData = reactive({
      xData: [],
      grid: {},
      series: [],
    });
    let videoData = reactive({
      series: [],
    });
    const getChatrsData = async () => {
      let res = await proxy.$api.getEchartsData();
      let orderRes = res.orderData;
      let userRes = res.userData;
      let videoRes = res.videoData;
      orderData.xData = orderRes.date;
      const keyArray = Object.keys(orderRes.data[0]);
      keyArray.forEach((key) => {
        orderData.series.push({
          name: key,
          data: orderRes.data.map(item => item[key]),
          type: 'line'
        });
      });
      xOptions.xAxis.data = orderData.xData;
      xOptions.series = orderData.series;
      //渲染
      let hEcharts = echarts.init(proxy.$refs['echart']);
      hEcharts.setOption(xOptions);

      //柱状图渲染
      userData.xData = userRes.map(item => item.data);
      userData.series = [
        {
          name: "新增用户",
          data: userRes.map(item => item.new),
          type: "bar"
        },
        {
          name: "活跃用户",
          data: userRes.map(item => item.active),
          type: "bar"
        }
      ];
      userData.grid = {
        left: '3%',
        right: '4%',
        bottom: '3%',
      }
      xOptions.xAxis.data = userData.xData;
      xOptions.series = userData.series;
      let pEcharts = echarts.init(proxy.$refs["userechart"]);
      pEcharts.setOption(xOptions);

      videoData.series = [
        {
          data: videoRes,
          type: "pie",
        }
      ];
      pieOptions.series = videoData.series;
      let vEcharts = echarts.init(proxy.$refs["videoechart"]);
      vEcharts.setOption(pieOptions);
    }
    return {
      tableData,
      countData,
      tableDataLabel,
    }
  }
})
</script>
<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 18px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }


}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .el-card {
    padding: 0;
    width: 29%;
    margin-bottom: 20px;

  }

  .icons {
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    height: 70px;
    width: 70px;
    line-height: 80px;
    color: #fff;
  }

  .detail {
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .num {
      display: flex;
      justify-content: center;
      font-size: 16px;
      margin-bottom: 5px;
      margin-left: 20px;
    }

    .txt {
      display: flex;
      justify-content: center;
      font-size: 14px;
      color: #999;
      margin-left: 20px;

    }
  }
}

.line {
  margin-bottom: 20px;

}

.graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .el-card {
    width: 48%;
  }
}
</style>
