import axios from 'axios'
import { Message } from 'element-ui';
import router from '../src/router'


//请求拦截器

axios.interceptors.request.use(config => {
    console.log(config);
    //如果存在token,请求携带token
    if (window.sessionStorage.getItem('tokenStr')) {
        // console.log((window.sessionStorage.getItem('tokenStr')));
        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
        //console.log(config.headers);
        //console.log(config);
    }
    return config;
}, error => {
    console.log(error);
    return;
})

//响应拦截器

//success成功得调用一个接口  要判断两个是否成功 若不成功则返回相应
//响应拦截器 方便错误提示
axios.interceptors.response.use(success => {

    // // http协议调到接口就是200
    if (success.status && success.status == 200) {
        //判断业务逻辑是不是错误
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            Message.error({ message: success.data.message });
            return;
        }

        if (success.data.message) {
            Message.success({ message: success.data.message });

        }


    }
    //拦截后发现都对则将数据返回 data以json格式返回

    return success;
    //连接口都访问失败
}, error => {
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({ message: '服务器被吃了' });
    } else
    if (error.response.code == 403) {
        Message.error({ message: '权限不足，请联系管理员！' });
    } else
    if (error.response.code == 401) {
        Message.error({ message: '尚未登录，请登录！' });
        router.replace('/');
    } else {
        if (error.response.data.message) {
            Message.error({
                message: error.response.data.message
            });
        } else {
            Message.error({ message: '未知错误！' });
        }
    }
    return;
});

//在url中可以加前置路径方便以后修改路径
let base = '';


//url post request path and params means is request param 传送json格式的post请求
export const postResquest = (url, params) => {
    return axios({
        method: 'post',
        url: '${base}${url}',
        data: params
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: '${base}${url}',
        data: params
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: '${base}${url}',
        data: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: '${base}${url}',
        data: params
    })
}