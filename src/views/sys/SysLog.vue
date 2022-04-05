<template>
<div>
   <div>
   
  <el-button icon="el-icon-plus" size="small" type="primary" @click="addItemType" > 添加</el-button>
   </div>
   <div class="tableClass">
   <el-table
        border
        stripe
        @selection-change="handleSelectionChange"
        size="s"
      :data="tableData"
      style="width: 70%">
      <el-table-column
      type="selection"
      width="55">
    </el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="announWords"
        label="公告内容"
        width="280">
      </el-table-column>
      <el-table-column
        prop="announTime"
        label="发布时间">
      </el-table-column>
      <el-table-column
        prop="uid"
        label="发布用户编号">
      </el-table-column>
  
    </el-table>
    <div style="display:flex; justify-content:flex-end;">
      <el-pagination
          background
           @current-change="currentChange"
            @size-change="sizeChange"
         :page-size="size"
          layout="prev, pager, next,jumper,->,total"
          :total="totaldata">
          </el-pagination>
    </div>
            
</div>
<el-button size="small" 
        style="margin-top:8px"  
        type="danger" 
        :disabled="this.multipleSelection.length==0"
        @click="deleteMultiple">批量删除</el-button>

        <el-dialog
  title="发布公告"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
        <el-tag>公告内容</el-tag>
        <el-input v-model="addNoticeInfo.announWords" class="updataItemType"></el-input><hr>
        
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doUpdate">确 定</el-button>
  </span>
</el-dialog>
</div>
    
</template>


<script>
import axios from 'axios'
export default {
    name: "EmpBasic",
    data(){
        return{
          totaldata:'',
            pos:{
                name:''
            },
            nowTime:'',
            user:JSON.parse(window.sessionStorage.getItem('user')),
            tableData: [],
            dialogVisible:false,
            addNoticeInfo:{
            announTime: '',
            announWords: '',
            uid:''
            

            },
           currentPage:1,
            size:8,
            updateTypeName:{
                typeName:''
            },
             multipleSelection: []
        }
    },
    mounted() {
        
       this.initTableData();
    },
    methods: {
          sizeChange(size){
this.size=size;
this.initTableData();
      },
      currentChange(currentPage){
        this.currentPage=currentPage;
       this.initTableData();

      },
    showTime(){
     this.nowTimes(); //在点击发布时条用这个函数设置时间
     alert(this.nowTime);
    },
    nowTimes(){
      this.timeFormate(new Date());
      setInterval(this.nowTimes,1000);
      //this.clear()
    },
    //显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
      let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日","一","二","三","四","五","六"];
      let getWeek = "星期" + weeks[week];
      this.nowTime = year + "年" + month + "月" + date +"日"+" "+hh+":"+mm+':'+ss+getWeek  ;
    },
      initTotaldata(){
        this.initTableData();
       
       // this.useName();
        axios({
          method:'get',
          url:'http://localhost:8083/system/notice/total'
        }).then(res=>{
          if(res){
            this.totaldata=res.data;
          }
        })
       },

        deleteMultiple(){
                this.$confirm('此操作将永久删除['+this.multipleSelection.length+']条物品类型数据,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let ids='?';
            this.multipleSelection.forEach(item=>{
                ids+='ids='+item.typeId+'&';
            });

          axios({
                method:'delete',
                url:'http://localhost:8083/system/config/itemType/'+ids,
                
            }).then(res=>{
                if(res){
                    this.initTableData();   
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        doUpdate(){
              if(this.addNoticeInfo.announWords){
                //添加其他参数
                this.addNoticeInfo.uid=this.user.id;
                this.nowTimes();
                this.addNoticeInfo.announTime=this.nowTime;
                axios({
                    method:'post',
                    url:'http://localhost:8083/system/notice/',
                    
                     data:this.addNoticeInfo
                     
                }).then(res=>{
                    if(res){
                        this.dialogVisible=false;
                        this.initTableData();
                        this.initTotaldata();
                    }
                })
            }else{
                this.$message.error('内容不能为空！');
            }
        },

        addItemType(){
            this.dialogVisible=true;
         
        },
         handleSelectionChange(val) {
        this.multipleSelection = val;
        
      },

        handleEdit(index,data){

            //this.updateTypeName=data; 存在取消漏洞 改成以下
            Object.assign(this.updateTypeName,data);
            this.updateTypeName.createDate='';
            this.dialogVisible=true;
        },
        handleDelete(index,data){

            this.$confirm('此操作将永久删除'+data.typeName+',是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
                method:'delete',
                url:'http://localhost:8083/system/config/itemType/'+data.typeId,
                
            }).then(res=>{
                if(res){
                    this.initTableData();   
                    this.initTotaldata();
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
        },
        initTableData(){
            axios({
                method:'get',
                url:'http://localhost:8083/system/notice/noticePage?currentPage='+this.currentPage+'&size='+this.size
            }).then(res=>{
                if(res.data){
                    this.tableData=res.data.data;
                    this.totaldata=res.data.total;
                }
            })
        }
    },
}
</script>

<style scoped>
.addItemType{
width:300px;
margin-right: 8px
}
.tableClass{
    margin-top:10px;
}

.updataItemType{
    width:200px;
    margin-left: 8px;
}

</style>

