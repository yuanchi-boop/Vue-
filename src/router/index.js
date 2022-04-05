import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Test1 from '@/views/Test1'
import Chat from '@/views/chat/FriendChat'
import Test2 from '@/views/Test2'
import found from '@/views/web/found'
import lost from '@/views/web/lost'
import webHome from '@/views/web/webHome'

Vue.use(Router)




const routes = [{

        path: '/',
        name: 'login',
        component: login,
        hidden: true
    },
    {

        path: '/webHome',
        name: '前端首页',
        component: webHome,
        children: [{
                path: '/test1',
                name: '选项一',
                component: Test1
            }, {
                path: '/test2',
                name: '选项二',
                component: Test2
            }, {
                path: '/found',
                name: '招领',
                component: found
            }, {
                path: '/lost',
                name: '寻物',
                component: lost
            }, {
                path: '/chat',
                name: '在线聊天',
                component: Chat
            }

        ]

    }, {
        path: '/test2',
        name: '选项二',
        component: Test2
    },

    {
        path: '/home',
        name: '导航一',
        component: Home,
        children: [{
            path: '/test1',
            name: '选项一',
            component: Test1
        }, {
            path: '/test2',
            name: '选项二',
            component: Test2
        }]
    }
]

const router = new VueRouter({ routes })

export default router