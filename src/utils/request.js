// request.js
import axios from "axios";
import { useUserStore } from "../stores/userStore.js";

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 50000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    config.headers["Content-Type"] = "application/json;charset=utf-8";
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求拦截器错误：", error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    let res = response.data;
    if (response.status === 200) {
      //如果返回的是文件
      if (response.config.responseType === "blob") {
        return res;
      }
      //兼容返回的字符串数据
      if (typeof res === "string") {
        res = res ? JSON.parse(res) : res;
      }
      return res;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    // 处理响应错误
    console.error("响应拦截器错误：", error);
    return Promise.reject(error);
  }
);

export default service;
