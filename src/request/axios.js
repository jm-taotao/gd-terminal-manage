import Qs from 'qs';
import axios from 'axios';
import store from "@/store";
import {ElMessage} from "element-plus";
import router from "@/router";

// axios.defaults.baseURL = 'http://www.jsjz.top:8090';
// axios.defaults.baseURL = 'http://localhost:8090/api';
// axios.defaults.headers.common['token'] = store.state.token;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const myAxios = axios.create({
    // baseURL: 'http://localhost:8090/api',
    baseURL: 'http://localhost:8090',
    timeout: 20000,
    headers: {'X-Custom-Header': 'Jyt','Access-Control-Allow-Origin': '*'},
    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
    },
    // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
    // auth: {
    //     username: 'Jyt',
    //     password: '7410'
    // },
    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: 'json', // default
    // `responseEncoding` indicates encoding to use for decoding responses
    // Note: Ignored for `responseType` of 'stream' or client-side requests
    responseEncoding: 'utf8', // default
});
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    const token = store.state.token;
    if (config.url.indexOf("login")<0){
        if (!token){
            ElMessage({
                message: '登录失效,请重新登录',
                type: 'success',
                center:true,
                duration:1500
            })
            router.push("/login")
            return false;
        }
    }
    config.headers.token=store.state.token;
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if ("10010" === response.data.code){
        router.push("/login")
    }
    if (response.status === 200){
        return Promise.resolve(response);
    }else {
        Promise.reject(response);
    }
}, function (error) {
    // console.log("response = " + error)
    // 对响应错误做点什么
    // if (error.response.status) {
    //     switch (error.response.status) {
    //         // 401: 未登录
    //         // 未登录则跳转登录页面，并携带当前页面的路径
    //         // 在登录成功后返回当前页面，这一步需要在登录页操作。
    //         case 401:
    //             router.push('/login').then(v=>{
    //                 console.log(v)
    //             });
    //             break;
    //         // 403 token过期 1.登录过期对用户进行提示 2.清除本地token和清空vuex中token对象 3.跳转登录页面
    //         case 403:
    //             sessionStorage.removeItem("token");
    //             store.commit('initLoginUser',null);
    //             ElMessage({
    //                 message: '登录已过期',
    //                 type: 'warning',
    //                 center:true,
    //                 duration:2000
    //             })
    //             setTimeout(() => {
    //                 router.push('/login');
    //             }, 1000);
    //             break;
    //         default:
    //     }
    // }
    return Promise.reject(error);
});

export default myAxios;