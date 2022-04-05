


<template>

    <div>
       
        <div class="permissManaMain">
        
                   

           <el-collapse  accordion activeName @change="change">
            <el-collapse-item :title="r.announTime" :name="r.id" v-for="(r,index) in notices" :key="index">
               <el-card class="box-card">
                   
                    <div slot="header" class="clearfix">
                        <span>公告内容： {{notices[index].announWords}}</span><hr>
                        <span>公告人： {{username[index]}}</span>
                        
                    </div>
                    <div>
                    </div>
                </el-card>
            </el-collapse-item>
            
            </el-collapse>
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'
export default {
  name: "StaAll",
  data(){
      return{
        activeName: '1',
        user:JSON.parse(window.sessionStorage.getItem('user')),

        nowTime:'',

         username:[],
         notices:[],

         time:{
           date:''
         },

          allNotices:{
            id:'',
            announWords:'wer',
            announTime:'',
            uid:'',
            object:'',
            userName:''
          },


        defaultProps: {
          children: 'children',
          label: 'name'
        },
        selectMenus:[]
      }
  },
  mounted() {
      this.initAllNotice();
      //this.allNoticesToNotice();
      // this.handleEdit();
  },
  methods:{

    
change(rid){
          if(rid){
            alert(rid);
              this.allNotices.userName=this.username[rid];
              this.allNotices.announWords=this.notices[rid].announWords;
          }
      },
    //给notices赋值名字
    handleEdit(){
        for(var i=0;i<this.notices.length;i++)
        this.notices[i].userName=this.username[i];
        
          
    },

      change(rid){
          if(rid){
              this.initAllNotice();
          }
      },
      initAllNotice(){
          axios({
              method:'get',
              url:'http://localhost:8083/system/notice/'
          }).then(res=>{
            this.notices=res.data;
            for(var i=0;i<res.data.length;i++){
                
                
            
                
                axios({
                   method:'get',
                   url:'http://localhost:8083/system/user/byIdgetName?id='+this.notices[i].uid
                 }).then(resp=>{
                   if(resp){
                  
                     this.username.push(resp.data);
                   
                    
                   }
                 })

                 
                             
            }
             console.log(this.notices);
          })

         
      },
      
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
    .permissManaMain{
        margin-top:10px;
        width:650px;
        margin: auto;
    }
</style>
