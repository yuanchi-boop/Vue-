<template>

  <div>
        <el-form :rules="rules" 
         v-loading="loading"
    element-loading-text="正在登录..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
        ref="loginForm" 
        :model="loginForm" class="loginContainer">
        <h3 class="loginTitle">登录系统 </h3>
             <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名"> </el-input>
            </el-form-item>
             <el-form-item prop="password">
                <el-input type="password" atuo-complete="false" v-model="loginForm.password" placeholder="请输入密码"> </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" atuo-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width:250px;margin-right:5px"> </el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
               
            </el-form-item>

             <el-checkbox v-model="checked" class="loginRemeber">记住我</el-checkbox>

             
             <hr>
                <el-button type="primary" style="width:40%" @click="sibmitLogin">登录</el-button>
                <el-button type="primary" style="width:40%;margin-left:50px;" @click="register">注册</el-button>
        </el-form>


         <el-dialog
            title="注册用户"
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
                        <el-form-item label="登录名:" prop="loginId">
                            <el-input size="mini" prefix-icon="el-icon-edit" v-model="emp.loginId" style="width:150px;" placeholder="请设置登录名"></el-input>
                        </el-form-item>
                           </el-col>
                             <el-col :span="4">
                        <el-form-item label="登录密码:" prop="loginPassword">
                            <el-input size="mini" prefix-icon="el-icon-edit" v-model="emp.loginPassword" style="width:150px;" placeholder="请设置登录密码"></el-input>
                        </el-form-item>
                           </el-col>

                            <el-col :span="4">
                            <el-form-item label="图像:" prop="userFace">
                                    <el-input size="mini"  v-model="emp.userFace" style="width:150px;" placeholder="请输入你的电话号码"></el-input>
                                    </el-form-item>
                            </el-col>
                    </el-row>

                     <el-row>
                    <el-col :span="4">
                        <el-form-item label="选择注册的用户类型:" prop="roleName">
                                <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link">
                                    {{emp.roleName}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="a">超级管理员</el-dropdown-item>
                                    <el-dropdown-item command="b">管理员</el-dropdown-item>
                                    <el-dropdown-item command="c">普通用户</el-dropdown-item>
                                    
                                    
                                </el-dropdown-menu>
                                </el-dropdown>
                        </el-form-item>
                            </el-col>

                             <el-col :span="4">
                        <el-form-item label="权限码:" prop="level">
                            <el-input size="mini" prefix-icon="el-icon-edit" v-model="emp.level" style="width:150px;" placeholder="请输入权限码"></el-input>
                        </el-form-item>
                           </el-col>

                    </el-row>
                    
                   
                     
                    
                </el-form>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reSetUserType">取 消</el-button>
                <el-button type="primary" @click="ConfirmAddUser">确 定</el-button>
            </span>
            </el-dialog>
  </div>
  
  
 

</template>

<script>
import axios from 'axios'

export default {
    name:"Login",
    data() {
        return {
            code:0,
            level:'',
            emp:{
              
                level: '0',
                loginId: "",
                loginPassword: "",
                name: "",
                alias: "",
                campus: "吉大",
                academy: "",
                gradeMajor: "",
                phone: "",
                roleName:"普通用户",
                userFace: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zxtf2X2EddV-g7hKyBhilAHaQB?pid=ImgDet&rs=1",
                
            },
            dialogVisible:false,
            captchaUrl:'',
            loginForm:{
                username:"admin",
                password:"admin123",
                code:''
            },
            loading:false,
            checked:true,
            rules:{
                username:[{required:true,message:'please fill your username',trigger:'blur'}],
                password:[{required:true,message:'please fill your password',trigger:'blur'}],
                code:[{required:true,message:'please fill your code',trigger:'blur'}]
            }
        }
      
    },
    methods: {
        reSetUserType(){
             this.emp.roleName="普通用户";
                this.emp.level="3333";
                this.dialogVisible = false;
        },

        handleCommand(command){
            if(command=="a"){
                this.emp.roleName="超级管理员";
            }
            if(command=="b"){
                this.emp.roleName="管理员";
            }
            if(command=="c"){
                this.emp.roleName="普通用户";
            }
        },
        ConfirmAddUser(){
            
            
            //根据需要注册用户类型进行验证
            axios({
                url:"http://localhost:8083/system/role/role/getCode?roleName="+this.emp.roleName,
                method:'get'
                           
            }).then(response=>{
             
                if(response){
                    this.code=response.data;
                    if(this.code==this.emp.level){
                            axios({
                        url:"http://localhost:8083/system/user/add",
                        method:'post',
                        data:this.emp
                    }).then(res=>{
                        
                        if(res){
                            alert("注册成功！");
                        }else{
                            alert("信息输入不正确！");
                        }
                        
                        });
                }else{
                    alert("权限码错误!");
                }
                }
                this.reSetUserType();
    
                });

               
        },
           updateCaptcha(){
        //   this.captchaUrl="/api/captcha";
            axios({
                url:"http://localhost:8083/captcha",
                method:'get',
                responseType:'blob'                
            }).then(response=>{
                //console.log(response);
                let blob=new Blob([response.data],{type:'image/jpeg'});
                this.captchaUrl=window.URL.createObjectURL(blob);
    
                });
            },
            register(){
                this.dialogVisible=true;
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
            sibmitLogin(){
                // $refs.loginForm反射道ref=loginForm进行校验
               
               this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                axios({
                url:"http://localhost:8083/login",
                method:'post',
                data:this.loginForm,
                withCredentials: true
                                               
            }).then(response=>{
               
                if(response){
                    this.loading=true;
                    const tokenStr=response.data.obj.tokenHead+response.data.obj.token;
                    
                    window.sessionStorage.setItem('tokenStr',tokenStr);

                            axios({
                        method: 'get',
                        url: 'http://localhost:8083/user/info'

                    }).then(resp => {
                        if (resp) {
                            window.sessionStorage.setItem('user', JSON.stringify(resp.data));
                           window.sessionStorage.setItem('userLevel', resp.data.level);
                           this.level=resp.data.level;
                           alert(this.level);
                                if(this.level=='0'){
                                this.$router.replace('/webHome');
                            }else{
                                alert("111");
                                //replace 不可回退 push可回退
                                // this.$router.replace('/home');
                                //页面跳转
                        let path=this.$route.query.redirect;
                            // console.log(path);
                        this.$router.replace((path=='/'||path==undefined)?'/home':path);
                            }
                        }
                    })

                    
                
              }

                });
               
                    } else {
                        this.$message.error('error submit!!');
                        return false;
                    }
             });
            }
     },
     created() {
         this.updateCaptcha();
     },
}
</script>

<style>  
.loginContainer{
    border-radius:15px;
    background-clip:padding-box;
    margin: 180px auto;
    width:420px;
    padding:15px 35px 15px 35px;
    background:#fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cacaca;

}
.loginTitle{
    margin:0px atuo 40px auto;
    text-align: center;
}
.loginRemeber{
    text-align: left;
    margin: 0px 0px 15px 0px;
}
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