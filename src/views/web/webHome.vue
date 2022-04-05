<template>
    <div>
      <div>
            <el-container>
        <el-header class="homeHeader">
        <div class="title">校园失物招领网站</div>
            <div class="line">
                    <el-menu 
                :default-active="activeIndex2"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#409eff"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-menu-item  index="/test2">我的消息</el-menu-item>

                <el-menu-item index="/found" >失物招领</el-menu-item>
                <el-menu-item index="/lost" >寻物启事</el-menu-item>
                <el-menu-item index="/test1">系统通知</el-menu-item>
                </el-menu>
            </div>
        
              <el-dropdown class="userInfo"  @command="handleCommand">
                <span class="el-dropdown-link">
                   {{user.name}}<i><img :src="user.userFace" style="width:50px;height:50px;border-radius:50px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                   
                    <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                    <el-dropdown-item command="loginHome" >后台系统</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
            <el-main class="bodyMain">
            
                <router-view/>
            </el-main>
            <el-footer >
            <div class="bottomFont" style="width:100%;background:#efefef;padding:0px,0,0px,0;height:85px;display:block;font-size:11px;line-height:15px;margin:0,0;font-family:Roboto-Regular,微软雅黑,宋体,Arial,sans-serif;">
            <div style="vertical-align:middle;background:transparent;padding-top:8px;text-align:center;color:#666">
                    @CopyRight2022 失物招领网 All Rights Reserved YUANCHI
            </div>
            <div style="vertical-align:middle;background:transparent;margin:10px auto;text-align:center;">
                邮箱：19179837@qq.com(请将^改为@)
            </div>
            <div style="width:300px;margin:0 auto; padding:0px 0;text-align:center;">
                致力于校园的便利，祝愿同学们有个美好的校园生活
            </div>
        </div></el-footer>
            </el-container>
      </div>

   <el-dialog
            title="公告"
            :visible.sync="dialogVisibleNotice"
            width="80%"
            >
            <div>
                
                <span>时间：{{notice.announTime}}</span>
                <hr>
                      <span>内容：{{notice.announWords}}</span>
                      
                      
                   
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleNotice = false">取 消</el-button>
                <el-button type="primary" @click="GetIt(notice.id)">确认</el-button>
            </span>
            </el-dialog>

    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "webHome",
    
    data() {
        return {
            dialogVisible:false,
            dialogVisibleNotice:false,
            user:JSON.parse(window.sessionStorage.getItem('user')),
             activeIndex2: '/found',
             tabPosition: 'left',
             userLevel:window.sessionStorage.getItem('userLevel'),
             notice:'',
             noticeUser:{
                uid:'',
                state:'已读',
                nid:'',
                id:''
             },
             nid:[],
             flagNotice:'0',
             noticeUidAndNid:{
                 uid:'',nid:''
             }
        }
    },
    mounted() {
        this.initNotice();
        this.initWeb();
    },
    methods: {
        initWeb(){
this.$router.push('/found');
        },
        initNotice(){
            //查询noticeUser中此用户id记录中state为未读的nid
             axios({
                url:"http://localhost:8083/system/noticeUser/getNidByUid?id="+this.user.id,
                method:'get'
                           
            }).then(res=>{
                if(res.data){
                    this.nid=res.data;
                    console.log(this.nid);
                    //根据查询到的nid查询到notice数组 一个一个循环确认
                    for(var i=0;i<this.nid.length;i++){
                       
                        this.flagNotice=this.nid[i];
                        axios({
                            url:"http://localhost:8083/system/notice/noticeBynid?nid="+this.nid[i],
                            method:'get'
                                    
                        }).then(res=>{
                            if(res){
                                this.notice=res.data;
                                //弹出对话框
                                  this.dialogVisibleNotice=true;
                                  
                            }
                        })
                    }
                }
            })

            
        },

        GetIt(index){
            
            
            this.noticeUidAndNid.uid=this.user.id;
            this.noticeUidAndNid.nid=this.flagNotice;

            //查询id
            axios({
                url:"http://localhost:8083/system/noticeUser/getIdByUidAndNid",
                method:'put',
                data:this.noticeUidAndNid
                           
            }).then(res=>{
                if(res){
                    this.noticeUser.id=res.data;
                    this.noticeUser.uid=this.user.id;
                    this.noticeUser.nid=this.flagNotice;
                     axios({
                        url:"http://localhost:8083/system/noticeUser/update",
                        method:'put',
                        data:this.noticeUser
                                
                    })
                }
            })
        

            this.dialogVisibleNotice=false;
        },
        loginAndRegist(){
            if(user){
                
            }else{
                alert("请先登录");
            }
        },
        set(){
            alert("adfd");
        },
         handleSelect(index) {
        
           this.$router.push(index);
        
      },
        handleCommand(command){
  
        if(command=='logout'){

           this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
     
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
        
        if(command=='userInfo'){
            
        }

        if(command=='loginHome'){
            if(this.userLevel=='0'){
                alert("您为普通用户，不能跳转到后台！！！");
            }else{
                            this.$confirm('此操作将进入后台, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {      
            //跳转到登录页面
                    this.$router.replace('/home');
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已进入后台'
                    });          
                    });
               }       
        }
       
      }
    },
}
</script>


<style scoped>
 .homeHeader{
      background: #409eff;
     display:flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      box-sizing: border-box;
  }
  .homeHeader .title{
      width:500px;
     font-size:30px;
     font-family: 华文楷体;
     color: rgb(247, 242, 242);
  }

  .homeHeader .userInfo{
    cursor: pointer;
    display:flex;
    align-items:right;
  }
 
  .bodyMain{
      
      justify-content: space-between;
      background-color:#e3eef7;
      margin-left:150px;
      margin-right:150px;
      margin-top:20px;
  }

  .bodyMain1{
      
      justify-content: space-between;
      background-color:#ffffff;
      margin-left:150px;
      margin-right:150px;
      margin-top:20px;
  }
  .line{
      width:800px;
  }
</style>
