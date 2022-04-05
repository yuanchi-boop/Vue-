// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import store from '../src/store/index'
import { initMenu } from './utils/menus';
import {
    getResquest
} from '../config/api.js'
import { downloadRequest } from './utils/download'
import 'font-awesome/css/font-awesome.css'




axios.defaults.baseURL = 'http: //localhost:8083'
axios.defaults.withCredentials = true

Vue.prototype.downloadequest = downloadRequest;
Vue.config.productionTip = false
Vue.use(ElementUI);




/*路由前置守卫
 */
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);

        if (!window.sessionStorage.getItem('user')) {
            return axios({
                method: 'get',
                url: 'http://localhost:8083/user/info'

            }).then(resp => {
                if (resp) {
                    window.sessionStorage.setItem('user', JSON.stringify(resp.data));
                    next();
                }
            })
        }

        next();
    } else {
        if (to.path == '/' || to.path == 'webHome') {
            next();
        } else {
            next('/?redirect=' + to.path);

        }

    }


    /*next()参数
    false
    error
    */
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})