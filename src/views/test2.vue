<template>

    <div>
        <div class="permissMana">
            <div class="title">我的招领</div>
        </div>
        <div class="permissManaMain">
            <div class="bottom">
            <el-row>
            <el-col :span="8" v-for="(found, index) in founds" :key="index" >
                <el-card :body-style="{ padding: '20px' }">
                <img :src="require('../assets/found/'+found.picPath)" style="width:390px;height:380px">
                <div style="padding: 14px;">
               
               
               
                    <span style="color:#ff80c0;font-size:20px;">{{found.itemName}}</span>
                    <span style="color:#8080c0;font-size:10px;">{{found.foundDescribe}}</span>
                    
                    <div class="bottom clearfix">
                    <time class="time">{{ found.pickTime }}</time>
                    <el-button type="text" class="button" @click="returnItem(index)">归还</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
            </el-row>
        </div>
        </div>
        <div class="permissMana">
            <div class="title">我的寻物</div>
            
        </div>
         <div class="permissManaMain">
            <div class="bottom">
            <el-row>
            <el-col :span="8" v-for="(found, index) in losts" :key="index" >
                <el-card :body-style="{ padding: '20px' }">
                <img :src="require('../assets/lost/'+found.picPath)" style="width:390px;height:380px">
                <div style="padding: 14px;">
               
               
               
                    <span style="color:#ff80c0;font-size:20px;">{{found.itemName}}</span>
                    <span style="color:#8080c0;font-size:10px;">{{found.lostDescribe}}</span>
                    
                    <div class="bottom clearfix">
                    <time class="time">{{ found.lostTime }}</time>
                    <el-button type="text" class="button" @click="getIt(index)">找到了</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
            </el-row>
        </div>
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'
export default {
  name: "StaAll",
  data(){
      return{
       founds:[],
       losts:[],
        user:JSON.parse(window.sessionStorage.getItem('user'))
      }
  },
  mounted() {
      //this.initRoles();
    //   this.initAllNotice();
    this.initFounds();
    this.initLosts();
  },
  methods:{
      initLosts(){
          axios({
                method:'get',
                url:'http://localhost:8083/system/lost/searchFoundByUid?uid='+this.user.id
            }).then(res=>{
                if(res.data){         
                    this.losts=res.data; 
                  
                }
            })
      },
      initFounds(){
            axios({
                method:'get',
                url:'http://localhost:8083/system/item/found/searchFoundByUid?uid='+this.user.id
            }).then(res=>{
                if(res.data){         
                    this.founds=res.data; 
                  
                }
            })
      },
      getIt(index){
          this.$confirm('您是否已经找到此物品?', '提示', {
          confirmButtonText: '找到了',
          cancelButtonText: '点错了',
          type: 'warning'
        }).then(() => {
           this.losts[index].lostState="已找到";
         //更新寻物启事信息
          axios({
                url:"http://localhost:8083/system/lost/",
                method:'put',
                data:this.losts[index]
           })        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });          
        });

        this.initLosts();
      },
      returnItem(index){
          this.$confirm('您是否已经归还了此物品！', '提示', {
          confirmButtonText: '是的',
          cancelButtonText: '还没有',
          type: 'warning'
        }).then(() => {
           this.founds[index].state="已认领";
         //更新招领信息
          axios({
                url:"http://localhost:8083/system/item/found/",
                method:'put',
                data:this.founds[index]
           })
            this.initFounds();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });          
        });

       
      }
  }
};
</script>


<style scoped>
    .permissMana{
        display: flex;
    }
    .permissMana .el-input{
        width:380px;
        margin-right:6px;
    }

    .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
.meddle{
    
    display:flex;
    margin-left:50px;
}
.title{
     font-size:30px;
     font-family: 华文楷体;
     color: blue;
  }
  .top{
      display:flex;
  }
  .searchClass{
      margin-left:100px;
  }
  .exfound{
      margin-left:300px;
  }
  .showavatar {
  border: 1px dashed #f50505;
  border-radius: 50%;
  width: 160px;
  height: 160px;

  background-size: 60px;
}
</style>