import axios from 'axios';
import store from '@/store/index'
import router from 'vue-router'
import QS from 'qs';
import { Toast } from 'vant'


if (process.env.NODE_ENV == 'development'){
  axios.defaults.baseURL = 'http://localhost:10000';
}
if (process.env.NODE_ENV == 'production'){
  axios.defaults.baseURL = 'https://www.jsjz.top';
}
var axiosInstance = axios.create({
  timeout: 1000,
});
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


//请求拦截器
axios.interceptors.request.use(
  config => {
    const token = store.state.token;
    token && (config.headers.Authorization == token);
    return config;
  },
  error => {
    return Promise.reject(error)
  }
);
//响应拦截器
axios.interceptors.response.use(
    response => {
      if (response.status === 200){
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
  error => {
      if (error.response.status){
        switch (error.response.status) {
          case 401:
            router.replace({
              //未登录
              path:'/login',
              query : {
                redirect : router.currentRout.fullPath
              }
            });
          break;
          case 404:
            Toast({
              message: '网络请求不存在',
              duration: 1500,
              forbidClick: true
            });
            break;
          default:
            Toast({
              message: error.response.data.message,
              duration: 1500,
              forbidClick: true
            });
        }
      }
      return Promise.reject(error.response);
  }
);

//封装get方法
export function get(url,params) {
  return new Promise((resolve,reject)=>{
    axios.get(url,{
      params:params
    }).then(res => {
      resolve(res.data)
    }).catch(err=>{
      reject(err.data)
    })
  })
}

//封装post方法
export function post(url,params) {
  return new Promise((resolve,reject)=>{
    axios.post(url,QS.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export default axiosInstance;
