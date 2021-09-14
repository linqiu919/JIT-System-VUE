import axios from "axios";

import {Notification} from "element-ui";

import router from "@/router";
//创建axios实例
const newaxios = axios.create({
    baseURL: 'http://localhost:19001',
    timeout: 100000,
});

// Add a request interceptor
newaxios.interceptors.request.use(function (config) {

    //请求时设置请求头携带token
    config.headers.Authetication = "Bearer " +localStorage.getItem("token");

    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
newaxios.interceptors.response.use(function (response) {
        let {status,message,data} = response.data;
        if(status==20000){
            return data;
        }else if(status==444449){
            router.push("/login");
            return Promise.reject(new Error(message));
        }
        else{
            Notification.error(message);
            //出现错误，阻止代码向下执行
            return Promise.reject(new Error(message));
        }
}, function (error) {

    // Do something with response error
    return Promise.reject(error);
});

export default newaxios;