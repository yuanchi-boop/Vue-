import axios from 'axios'

const service = axios.create({
    responseType: 'arraybyffer'
})

service.interceptors.request.use(config => {

    //如果存在token,请求携带token
    if (window.sessionStorage.getItem('tokenStr')) {

        config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');

    }
    return config;
}, error => {
    console.log(error);
    return;
})

service.interceptors.response.use(resp => {
    //获取响应头 
    const headers = resp.headers;

    let reg = RegExp(/application\/json/);
    if (headers['content-type'].match(reg)) {
        resp.data = unitToString(resp.data);
    } else {
        let fileDownload = require('js-file-download');

        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType = headers['content-type'];
        fileName = decodeURIComponent(fileName);
        alert(fileName);
        fileDownload(resp.data, fileName, contentType);


    }
}, error => {
    console.log(error);
})

function unitToString(unitArray) {
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray));
    let decodedString = decodeURIComponent(escape(encodedString));
    return JSON.parse(decodedString);
}

let base = ''
export const downloadRequest = (url, params) => {
    return service({
        method: 'get',
        url: `${base}${url}`,
        data: params,
        responseType: 'blob'
    })
}

export default service;