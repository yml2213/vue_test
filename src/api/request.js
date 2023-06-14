import axios from 'axios'
import config from '../config'
import {ElMessage} from "element-plus";

const NETWORK_ERROR = "网络请求错误,请稍后重试.....";
const service = axios.create({
  baseURL: config.baseApi
})

//请求前
service.interceptors.request.use((req) => {
  return req;
})

//请求后
service.interceptors.response.use((res) => {
  const {code, data} = res.data;
  console.log(res.data);
  if (code === 200) {
    return data;
  } else {
    ElMessage.error(data.message || NETWORK_ERROR);
    return Promise.reject(data.message || NETWORK_ERROR);
  }
})

function request(options) {
  options.method = options.method || 'get'
  //如果是get的情况去，则携带data数据到参数中
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data;
  }
  ////保存mock
  let isMock = config.mock;
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock;
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  return service(options);
}
export  default  request;
