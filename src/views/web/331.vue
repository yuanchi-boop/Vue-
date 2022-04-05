<template>
  <div>
        <div class="top">
            <div class="title">失物招领</div>
            <el-input class="searchClass" v-model="name" placeholder="通过物品名搜索招领..." 
            prefix-icon="el-icon-search" style="width:400px;margin-right:10px"></el-input>
            <el-button  
            type="primary" @click="searchFound" > 
            搜索</el-button>

            <el-button  class="exfound"
            type="primary" @click="outFound" > 
            发布失物招领</el-button>
        </div>
        <div class="meddle">           
                     
           <div class="jugeType" style="height:100px;margin-top:20px;">
           请选择类型筛选：<el-select v-model="posMeddle.typeId"  placeholder="请选择物品类型" >
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
           
                            <el-select v-model="timeMeddle.typeId"  placeholder="请选择拾到时间" >
                                <el-option
                                v-for="item in titleLevels1"
                                :key="item"
                                
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        
           </div>
        </div>
        <div class="bottom">
            <el-row>
            <el-col :span="8" v-for="(found, index) in founds" :key="index" >
                <el-card :body-style="{ padding: '20px' }">
                <img :src="require('../../assets/found/WeChat Image_20210929105554.jpg')" style="width:100%;height:100%">
                <div style="padding: 14px;">
                    <span style="color:#ff80c0;font-size:20px;">{{found.itemName}}</span>
                    <span style="color:#8080c0;font-size:10px;">{{found.foundDescribe}}</span>
                    
                    <div class="bottom clearfix">
                    <time class="time">{{ found.pickTime }}</time>
                    <el-button type="text" class="button">认领</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
            </el-row>
        </div>

        
        <el-dialog
            title="添加用户"
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
                            <el-form-item label="拾取地点:" prop="pickPlace">
                            <el-input   v-model="emp.pickPlace" style="width:150px;" placeholder="请输入你的拾取位置"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="拾取时间:" prop="pickTime">
                                <div class="block">
                                    <span class="demonstration">带快捷选项</span>
                                    <el-date-picker
                                    v-model="emp.pickTime"
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
                                    <el-input   v-model="emp.foundDescribe" style="width:250px;" placeholder="请输入你的描述"></el-input>
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
                                
                                action="http://localhost:8083/file/file/upload"
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
        
  </div>
</template>

<script>
import axios from 'axios'
export default {
data() {
    return {
        dialogVisiblePic:false,
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      pictureParam:{
          id:""
      },
      flagFound:false,
        imgs:[],
        founds:[],
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
        dialogVisible:false,
        emp:{
            foundDescribe: '', //详细描述
            typeid:'',   //列表选择
            itemName: '', //先存入 再取出对应的id
            
            pickPlace: '',
            pickTime: '',
            picPath: '', 
            state: '', //发布时设置为 待认领
            uid:''//获取用户的id
            
        },jl:{
                name:'',
                titleLevel:'',
                titleLevels1:''
            },
            titleLevels:[],
             titleLevels1:[
                "今天","一周内","一个月内","一年内","一年以上"
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
    }
},
mounted() {
    this.initFounds();
    this.picture();
    this.initSelect();
},
methods: {
    doAddPic(){
        if(this.flagFound==true){
            alert("发布成功");
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
                url:'http://localhost:8083/system/item/found/'
            }).then(res=>{
                if(res.data){         
                    this.founds=res.data; 
                    for(var i=0;i<this.founds.length;i++){
                        this.imgs[i]=this.founds[i].picPath;
                    }
                                    
                    
                }
            })
    },
    doAddFound(){

        
        if(this.pos.typeId&&this.emp.itemName&&this.emp.pickTime&&this.emp.pickPlace){
      alert(this.emp.pickTime);
            this.emp.typeid=this.pos.typeId;
          
            this.emp.state="待认领";
            this.emp.uid=this.user.id;
          this.emp.pickPlace;
            //存入
             axios({
                method:'post',
                url:'http://localhost:8083/system/item/found/',
                data:this.emp
            }).then(res=>{
                if(res){
                   if(res){
                      
                       
                        this.dialogVisible=false;
                       
                       
                       axios({
                method:'get',
                url:'http://localhost:8083/system/item/found/getFound/?pickTime='+this.emp.pickTime
                
                }).then(resp=>{
                    if(resp){
                        
                        this.pictureParam.id=resp.data.id;
                        this.dialogVisiblePic=true;
                       this.flagFound=true;
                    }

                })

                        

                   }
                   
                   
                }
            })
             
        }else{
            alert("请输入完整的数据");
        }
        
    
    },
    picture(){
         //图片
            axios({
                method:'get',
                url:'http://localhost:8083/system/item/found/found/image?id='+1,
                 responseType:'blob'
            }).then(res=>{
                if(res){
                  let blob=new Blob([res.data],{type:'image/jpeg'});
                this.images=window.URL.createObjectURL(blob);
                   
                   
                }
            })
    },
    searchFound(){

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