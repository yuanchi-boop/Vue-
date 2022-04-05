<template>
  <div>
        <div class="top">
            <div class="title">寻物启事</div>
            <el-input class="searchClass" v-model="name" placeholder="通过物品名搜索寻物启事..." 
            prefix-icon="el-icon-search" style="width:400px;margin-right:10px"></el-input>
            <el-button  
            type="primary" @click="searchFound" > 
            搜索</el-button>

            <el-button  class="exfound"
            type="primary" @click="outFound" > 
            发布寻物启事</el-button>
        </div>
        <div class="meddle">           
                     
           <div class="jugeType" style="height:100px;margin-top:20px;">
           请选择类型筛选：<el-select v-model="posMeddle.typeId" @change="selectTrigger(posMeddle.typeId)" placeholder="请选择物品类型" >
                                <el-option 
                                v-for="item in titleLevels"
                                :key="item.typeId"
                                
                                :label="item.typeName"
                                :value="item.typeId">
                                </el-option>
                            </el-select>
                  
           </div>
           <div class="jugeTime" style="height:100px;margin-top:20px;margin-left:50px;">
           请选择时间筛选：
           
                            <el-select v-model="timeMeddle.typeId" @change="searchByTime(timeMeddle.typeId)"  placeholder="请选择拾到时间" >
                                <el-option
                                v-for="item in titleLevels1"
                                :key="item.id"
                                
                                :label="item.time"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        
           </div>
        </div>
        <div class="bottom">
            <el-row>
            <el-col :span="8" v-for="(found, index) in founds" :key="index" >
                <el-card :body-style="{ padding: '20px' }">
                <img v-if="found.picPath" :src="require('../../assets/lost/'+found.picPath)" style="width:390px;height:380px">
                <div style="padding: 14px;">
               
               
               
                    <span style="color:#ff80c0;font-size:20px;">{{found.itemName}}</span>
                    <span style="color:#8080c0;font-size:10px;">{{found.lostDescribe}}</span>
                    
                    <div class="bottom clearfix">
                    <time class="time">{{ found.lostTime }}</time>
                    <el-button type="text" class="button" @click="pickedIt(index)">我拾到了</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
            </el-row>
        </div>

        
        <el-dialog
            title="添加寻物信息"
            :visible.sync="dialogVisible"
            width="80%"
            >
            <div>
                <el-form :rules="rules" ref="empForm" :model="emp" >
                        <el-row >
                    <el-col :span="4">
                        <el-form-item label="类型:" prop="typeId">
                            <el-select v-model="pos.typeId"  placeholder="请选择物品类型" >
                                <el-option
                                v-for="item in titleLevels"
                                :key="item.typeId"
                                
                                :label="item.typeName"
                                :value="item.typeId">
                                </el-option>
                            </el-select>
                           
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="margin-left:30px;">
                             <el-form-item label="物品名称：" prop="itemName">
                            <el-input  prefix-icon="el-icon-edit" v-model="emp.itemName" style="width:150px;" placeholder="请输入物品名称："></el-input>
                            </el-form-item>
                    
                    </el-col>
                    <el-col :span="4">
                            <el-form-item label="丢失地点:" prop="pickPlace">
                            <el-input   v-model="emp.lostPlace" style="width:150px;" placeholder="请输入你的拾取位置"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="丢失时间:" prop="pickTime">
                                <div class="block">
                                    <span class="demonstration">带快捷选项</span>
                                    <el-date-picker
                                    v-model="emp.lostTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions">
                                    </el-date-picker>
                                </div>
                                </el-form-item>
                        </el-col>
                       
                        
                    </el-row>
                    <el-row>
                    <el-col :span="4">
                        <el-form-item label="详细描述:" prop="describe">
                                    <el-input   v-model="emp.lostDescribe" style="width:250px;" placeholder="请输入你的描述"></el-input>
                                    </el-form-item>
                            </el-col>
                            
                    </el-row>
                    
                   
                     
                    
                </el-form>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddFound">确 定</el-button>
            </span>
            </el-dialog>

            <el-dialog
            title="添加图片"
            :visible.sync="dialogVisiblePic"
            width="80%"
            >
            <div>
                <el-form  ref="empFormPic"  >

            <el-form-item style="margin-left:130px;" label="图像:" prop="userFace">
                                <el-upload
                                class="upload-demo"
                                :data="pictureParam"
                                
                                action="http://localhost:8083/file/file/upload/lost{id}"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :limit="1"
                                list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                                <el-button type="primary" @click="doAddPic">确 定</el-button>
                            </el-form-item>
            </el-form>
                
            </div>
            </el-dialog>
        <el-dialog
            title="详细寻物信息"
            :visible.sync="dialogVisibleRenling"
            width="80%"
            >
            <div>
                <el-form :rules="rules" ref="empForm" :model="emp" >
                        <el-row >
                    
                    <el-col :span="4" style="margin-left:30px;">
                             <el-form-item label="物品名称：" prop="itemName">
                             <span>{{emp.itemName}}</span>
                             </el-form-item>
                    
                    </el-col>
                    <el-col :span="4">
                            <el-form-item label="丢失地点:" prop="pickPlace">
                            <span>{{emp.lostPlace}}</span>
                            </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="丢失时间:" prop="pickTime">
                               <span>{{emp.lostTime}}</span>
                                </el-form-item>
                        </el-col>
                       
                        
                    </el-row>
                    <el-row>
                    <el-col :span="4">
                        <el-form-item label="详细描述:" prop="describe">
                                    <span>{{emp.lostDescribe}}</span>
                                    </el-form-item>
                            </el-col>
                            
                            <el-col :span="4">
                        <el-form-item label="图片:" prop="picPath">
                                    <img v-if="emp.picPath" :src="require('../../assets/lost/'+emp.picPath)" style="width:390px;height:380px">
                                    </el-form-item>
                            </el-col>
                    </el-row>
                    
                    <el-row>
                    <el-col :span="4">
                        <el-form-item label="招领人:" prop="describe">
                                    <span>{{foundDesover}}</span>
                                    </el-form-item>
                            </el-col>
                    
                    </el-row>
                   
                     
                    
                </el-form>
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleRenling = false">取 消</el-button>
                <el-button type="primary" @click="contactUser">联系他认领</el-button>
            </span>
            </el-dialog>

             <el-dialog
            title="联系方式"
            :visible.sync="dialogVisiblePhone"
            width="80%"
            >
            <div>
                <span>联系方式：{{phone}}</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="getContactMethod">确认</el-button>
         
            </span>
            </div>
            </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
data() {
    return {
        dialogVisiblePic:false,
        dialogVisibleRenling:false,
        dialogVisiblePhone:false,
        //fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      pictureParam:{
          id:""
      },
      headers: {
        Authorization: window.sessionStorage.getItem('tokenStr')  //从cookie里获取token，并赋值  Authorization ，而不是token
      },
      flagFound:false,
        imgs:[],
        founds:[],
        phone:'',
        currentDate: new Date(),
            rules:{
                
                itemName:[{required:true,message:'please fill itemName',trigger:'blur'}],
                typeId:[{required:true,message:'please choose type',trigger:'blur'}],
                pickTime:[{required:true,message:'please fill pickTime',trigger:'blur'}],
                pickPlace:[{required:true,message:'please fill pickPlace',trigger:'blur'}]
            },
        user:JSON.parse(window.sessionStorage.getItem('user')),
        name:'',
        images:'',
        searchTime:'',
        dialogVisible:false,
        emp:{
            lostDescribe: '', //详细描述
            typeid:'',   //列表选择
            itemName: '', //先存入 再取出对应的id
            
            lostPlace: '',
            lostTime: '',
            picPath: '', 
            lostState: '', //发布时设置为 待认领
            uid:''//获取用户的id
            
        },jl:{
                name:'',
                titleLevel:'',
                titleLevels1:''
            },
            titleLevels:[],
             titleLevels1:[{
                 id:"0",
                 time:"今天"
             },{
                 id:"7",
                 time:"一周内"
             },{
                 id:"31",
                 time:"一个月内"
             },{
                 id:"356",
                 time:"一年内"
             }
             ],
        pos:{
                itemName:'',
                typeId:''
            },
            posMeddle:{
                itemName:'',
                typeId:''
            },
            timeMeddle:{
                itemName:'',
                typeId:''
            },
            //时间
            pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
        value2: '',
        value3: '',
        foundDesover:'',
        foundIndex:''
    }
},
mounted() {
    this.initFounds();
   
    this.initSelect();
    // this.searchByTime();
},
methods: {
      getContactMethod(){
       this.dialogVisiblePhone=false;
       this.dialogVisibleRenling=false;

    },
       contactUser(){

        this.dialogVisiblePhone=true;
        axios({
                method:'get',
                url:'http://localhost:8083/system/user/byId?id='+this.emp.uid
            }).then(res=>{
                if(res.data){         
                   this.phone=res.data.phone; 
                }
            })
    },

//我拾到了
  pickedIt(index){
      this.dialogVisibleRenling=true;
      
      this.foundIndex=index;
      //this.foundDesover
      this.emp=this.founds[index];

       axios({
                method:'get',
                url:'http://localhost:8083/system/user/byIdgetName?id='+this.founds[index].uid
            }).then(res=>{
                if(res.data){         
                   this.foundDesover=res.data; 
                }
            })
  },
    searchByTime(index){
            var tempDate = new Date() // 获取今天的日期
            tempDate.setDate(tempDate.getDate() - index) // 今天的前N天的日期，N自定义
            this.searchTime = tempDate.getFullYear() + '-'+ (tempDate.getMonth() + 1) + '-' + tempDate.getDate()
            // alert(index);

            
            axios({
                method:'get',
                url:'http://localhost:8083/system/lost/searchFoundByPicTime?picTime='+this.searchTime
            }).then(res=>{
                if(res.data){         
                    this.founds=res.data; 
                }
            })

    },

    //根据类型搜索
    selectTrigger(index){
          axios({
                method:'get',
                url:'http://localhost:8083/system/lost/searchFoundByType?typeId='+index
            }).then(res=>{
                if(res.data){         
                    this.founds=res.data; 
                }
            })
    },
    doAddPic(){
        if(this.flagFound==true){
            alert("发布成功");
            this.initFounds();

        }else{
            alert("发布失败");
        }
        this.dialogVisiblePic=false;
                        
    },
    
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    initFounds(){
        axios({
                method:'get',
                url:'http://localhost:8083/system/lost/'
            }).then(res=>{
                if(res.data){         
                    this.founds=res.data; 
                  
                }
            })
    },
    doAddFound(){

        
        if(this.pos.typeId&&this.emp.itemName&&this.emp.lostTime&&this.emp.lostPlace){
      alert(this.emp.lostTime);
            this.emp.typeid=this.pos.typeId;
          
            this.emp.lostState="已丢失";
            this.emp.uid=this.user.id;
          this.emp.lostPlace;
            //存入
             axios({
                method:'post',
                url:'http://localhost:8083/system/lost/',
                data:this.emp
            }).then(res=>{
                if(res){

                        this.dialogVisible=false;
                        this.pictureParam.id=res.data;
                         this.dialogVisiblePic=true;
                       this.flagFound=true;
                       alert(this.pictureParam.id);                              
                   
                }
            })
             
        }else{
            alert("请输入完整的数据");
        }
        
    
    },
    //通过物品名搜索物品
    searchFound(){
         axios({
                method:'get',
                url:'http://localhost:8083/system/lost/searchFound?itemName='+this.name,
                
            }).then(res=>{
                if(res){
                 this.founds=res.data;
                   
                   
                }
            })

    },
    outFound(){
        this.dialogVisible=true;
    },
    initSelect(){
            axios({
                method:'get',
                url:'http://localhost:8083/system/config/itemType/'
            }).then(res=>{
                if(res.data){             
                   this.titleLevels=res.data;                  
                    
                }
            })

           
        },
},
}
</script>

<style>
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