let proxyObj = {}


proxyObj['/'] = {
    //websocket
    ws: false,
    //目标地址
    target: 'http://localhost:8083',
    //发送请求头host会被设置成target
    changeOrigin: true,
    pathReWrite: {
        '^/': '/'
    }
}
console.log('132');

model.exports = {

    devServer: {
        open: true,
        '/': {
            host: localhost,
            port: 8080,
            hot: true,
            https: false,
            proxy: {
                ws: false,
                target: 'http://localhost:8083',
                //发送请求头host会被设置成target
                changeOrigin: true,
                secure: false,
                pathReWrite: {
                    '^/': '/'
                }
            }
        }
    }
}