import axios from 'axios'

const http = axios.create({
  //通用地址请求前缀
  baseURL: "/api",
  timeout: 10000, //超时
})
axios.interceptors.request.use(function (config){
  //在请求开始前做些什么
  return config;
},function ( error){
  //对请求错误做些什么
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response){
  //对响应数据做些什么
  return response;
},function (error){
  //对响应失败做些什么
  return Promise.reject(error);
});
export  default  http;
