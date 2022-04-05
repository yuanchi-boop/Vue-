<template>
    <div>
      <div style="display:flex;justify-content:space-between">
      <div style="display:flex;justify-content:center;margin-top:15px">
            <el-input v-model="name" placeholder="通过用户名搜索用户..." 
            prefix-icon="el-icon-search" style="width:400px;margin-right:10px"></el-input>
            <el-button icon="el-icon-plus"  
            type="primary" @click="searchUser" > 
            搜索</el-button>
           
        </div>
        <div>
         <el-button icon="el-icon-plus" size="small" type="primary" @click="addUser" > 添加用户</el-button>
            <el-button type="success" @click="exportData"><i class="fa fa-level-up" aria-hidden="true" ></i>导出数据</el-button>
        </div>
      </div>
        
        <div class="user-container">
            <el-card class="user-card" v-for="(user,index) in users" :key="index">
            <div slot="header" class="clearfix">
                <span>{{user.name}}</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                 icon="el-icon-delete" @click="deleteUser(user)"></el-button>
            </div>
            <div class="img-container">
                <img :src="user.userFace" :alt="user.name" :title="user.name" class="userFace-img">
            </div>
            <div class="userInfo">
                <div>姓名：{{user.name}}</div>
                <div>昵称：{{user.alias}}</div>
                <div>学校：{{user.campus}}</div>
                <div>学院：{{user.academy}}</div>
                <div>专业：{{user.gradeMajor}}</div>
                <div>电话号码：{{user.phone}}</div>
            </div>
            
            </el-card>
            </div>

          
           <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="80%"
            >
            <div>
                <el-form ref="empForm" :model="emp" >
                        <el-row >
                    <el-col :span="4">
                        <el-form-item label="姓名:" prop="name">
                            <el-input size="mini" prefix-icon="el-icon-edit" v-model="emp.name" style="width:150px;" placeholder="请输入用户姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                             <el-form-item label="昵称:" prop="alias">
                            <el-input size="mini" prefix-icon="el-icon-edit" v-model="emp.alias" style="width:150px;" placeholder="请输入你的昵称"></el-input>
                            </el-form-item>
                    
                    </el-col>
                    <el-col :span="4">
                            <el-form-item label="学院:" prop="academy">
                            <el-input size="mini"  v-model="emp.academy" style="width:150px;" placeholder="请输入你的学院名称"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="专业:" prop="gradeMajor">
                                <el-input size="mini"  v-model="emp.gradeMajor" style="width:150px;" placeholder="请输入你的学院名称"></el-input>
                                </el-form-item>
                        </el-col>
                       
                        
                    </el-row>
                    <el-row>
                    <el-col :span="4">
                        <el-form-item label="电话号码:" prop="phone">
                                    <el-input size="mini"  v-model="emp.phone" style="width:150px;" placeholder="请输入你的电话号码"></el-input>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="4">
                            <el-form-item label="图像:" prop="userFace">
                                    <el-input size="mini"  v-model="emp.userFace" style="width:150px;" placeholder="请输入你的电话号码"></el-input>
                                    </el-form-item>
                            </el-col>
                    </el-row>
                    
                   
                     
                    
                </el-form>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddUser">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "PerEc",
    data(){
        return{
            users:[],
            name:'',
            dialogVisible:false,
            emp:{
              
                level: '1',
                loginId: "",
                loginPassword: "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
                name: "",
                alias: "",
                campus: "吉大",
                academy: "",
                gradeMajor: "",
                phone: "",
                userFace: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zxtf2X2EddV-g7hKyBhilAHaQB?pid=ImgDet&rs=1",
                
            }
        }
    },
    mounted() {
        this.initUsers();
    },
    methods: {
        exportData(){
            
            this.downloadequest('http://localhost:8083/system/user/export');
        },
        doAddUser(){
            axios({
                method:'post',
                url:'http://localhost:8083/system/user/add',
                data:this.emp
            }).then(res=>{
                if(res){
                    this.dialogVisible=false;
                    this.initUsers();   
                }
            })
        },
        deleteUser(user){
             this.$confirm('此操作将永久删除['+user.name+'],是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
                method:'delete',
                url:'http://localhost:8083/system/user/delete?id='+user.id
                
            }).then(res=>{
                if(res){
                    this.initUsers();   
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },

        addUser(){
                this.dialogVisible=true;
        },
        searchUser(){
            axios({
                method:'get',
                
                url:'http://localhost:8083/system/user/all/?name='+this.name
            }).then(res=>{
                if(res){
                    this.users=res.data;
                }
            })
        },
        initUsers(){
            axios({
                method:'get',
                url:'http://localhost:8083/system/user/'
            }).then(res=>{
                if(res){
                    this.users=res.data;
                }
            })
        }
    },
}
</script>


<style scoped>
    .user-card{
        width:350px;
    }
    .user-container{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        margin-top:20px;
    }

    .userFace-img{
        width: 72px;
        height:72px;
        border-radius: 72px;
    }
    .img-container{
        width:100px;
        display: flex;
        justify-content: center;
    }
    .userInfo{
        font-size: 13px;
        color: cornflowerblue
    }
</style>
