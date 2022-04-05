import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router'

//请求拦截器
axios.interceptors.request.use(function(config) {
    //console.log(1);
    //如果存在token,请求携带token
    if (window.sessionStorage.getItem('tokenStr')) {
        //console.log((window.sessionStorage.getItem('tokenStr')));
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    }
    return config;
}, error => {
    console.log(error);
    return;
})