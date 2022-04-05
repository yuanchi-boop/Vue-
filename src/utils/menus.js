import axios from 'axios'

import router from '../router'


export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    axios({
        method: 'get',
        url: 'http://localhost:8083/system/cfg/menu'
    }).then(rep => {
        if (rep) {
            //格式化Router
            let fmtRoutes = formatRoutes(rep.data);
            //添加到路由
            router.addRoutes(fmtRoutes);

            //讲数据存入vuex
            store.commit('initRoutes', fmtRoutes);
        }
    });

}

export const formatRoutes = (routes) => {

    let fmtRoutes = [];

    routes.forEach(router => {


        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = router;


        if (children && children instanceof Array) {
            children = formatRoutes(children);

        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve) {
                console.log("1234");
                console.log(component);
                if (component.startsWith('Home')) {
                    require([`@/views/Home.vue`], resolve);
                } else
                if (component.startsWith('Emp')) {
                    //const path1 = '.. / views / emp / ' + component + '.vue ';
                    require([`@/views/emp/${component}.vue`], resolve);
                } else

                if (component.startsWith('Per')) {
                    require([`@/views/per/${component}.vue`], resolve);
                } else if (component.startsWith('Sal')) {
                    require([`@/views/sal/${component}.vue`], resolve);
                } else if (component.startsWith('Sta')) {
                    require([`@/views/sta/${component}.vue`], resolve);
                } else if (component.startsWith('Sys')) {
                    require([`@/views/sys/${component}.vue`], resolve);
                }

            }
        }

        fmtRoutes.push(fmRouter)
    });
    return fmtRoutes;
}