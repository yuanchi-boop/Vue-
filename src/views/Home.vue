<template>

    <div>
    <el-container>
  <el-header class="homeHeader">
    <div class="title">校园失物招领系统</div>
     
    <el-dropdown class="userInfo"  @command="handleCommand">
  <span class="el-dropdown-link">
    {{user.name}}<i><img :src="user.userFace" style="width:50px;height:50px;border-radius:50px"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>

    <el-dropdown-item command="logout">注销登录</el-dropdown-item>
    <el-dropdown-item command="webhome">网站首页</el-dropdown-item>
   
  </el-dropdown-menu>
</el-dropdown>
  </el-header>
  <el-container>
    <el-aside width="200px">
     <el-menu router>
      <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index" v-if="!item.hidden">
        <template slot="title">
          <i :class="item.iconCls" style="color:#1accff;margin-right:5px"></i> 
          <span>{{item.name}}</span>
        </template>

          <el-menu-item :index="children.path"
                        v-for="(children,indexj) in item.children" :key="indexj">{{children.name}}</el-menu-item>
         
      
      </el-submenu>
     </el-menu>
    </el-aside>
    <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">{{this.$router.currentRoute.name}}</a></el-breadcrumb-item>

        </el-breadcrumb>

        <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎来到校园失物招领系统！
        </div>
        <router-view class="homeRouterView"/>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
//import api from '../utils/api.js'
import axios from 'axios';
export default {
  
    name:"Home",
    data(){
      return{
        user:JSON.parse(window.sessionStorage.getItem('user'))
      }
    },
    computed:{
      routes(){
        return this.$store.state.routes;
      }
    },
    methods: {
      handleCommand(command){
        if(command=='webhome'){
          //跳转到前端页面
           this.$router.replace('/webHome');
        }

        if(command=='logout'){

           this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         //注销登录
          axios({
                url:"http://localhost:8083/logout",
                method:'post'
           });
           
           //清空用户信息
           window.sessionStorage.removeItem('tokenStr');
           window.sessionStorage.removeItem('user');
           window.sessionStorage.removeItem('userLevel');

//跳转到登录页面
           this.$router.replace('/');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销'
          });          
        });

        
        }
       
      }
    }
}
</script>

<style>
  .homeHeader{
      background: #409eff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      box-sizing: border-box;
  }
  .homeHeader .title{
     font-size:30px;
     font-family: 华文楷体;
     color: rgb(247, 242, 242);
  }

  .homeHeader .userInfo{
    cursor: pointer;
  }

  .homeWelcome{
    text-align: center;
    font-size: 30px;
    font-family: 华文楷体;
    color: rgb(144, 185, 204);
    padding-top:50px;
  }

  .homeRouterView{
    margin-top:10px;
  }
</style>