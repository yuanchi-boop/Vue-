<template>
<div>
  <div>
      <div >
      <el-input size="small" class="addItemType" placeholder="添加物品类型" suffix-icon="el-icon-plus" v-model="pos.name" @keydown.enter.native="addItemType">
      </el-input>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addItemType" > 添加</el-button>
      <el-button type="success" @click="exportData"><i class="fa fa-level-up" aria-hidden="true" ></i>导出数据</el-button>
      </div>
     
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
        prop="typeId"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="类型名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <div style="display:flex; justify-content:flex-end;">
      <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          :page-size="size"
          layout="prev, pager, next,jumper,->,total"
          :total="total">
          </el-pagination>
    </div>
            
</div>
<el-button size="small" 
        style="margin-top:8px"  
        type="danger" 
        :disabled="this.multipleSelection.length==0"
        @click="deleteMultiple">批量删除</el-button>

        <el-dialog
  title="编辑职位"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
        <el-tag>物品类型名</el-tag>
        <el-input v-model="updateTypeName.typeName" class="updataItemType"></el-input>
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
          total:'',
            pos:{
                name:''
            },
            currentPage:1,
            size:6,
            tableData: [],
            dialogVisible:false,
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
      exportData(){
            
            this.downloadequest('http://localhost:8083/system/config/itemType/export');
        },

      sizeChange(size){
this.size=size;
this.initTableData();
      },
      currentChange(currentPage){
        this.currentPage=currentPage;
       this.initTableData();

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
        doUpdate(){
            axios({
                    method:'put',
                    url:'http://localhost:8083/system/config/itemType/',
                    
                     data:this.updateTypeName
                     
                }).then(res=>{
                    if(res){
                        this.initTableData();
                        this.dialogVisible=false;
                    }
                })
        },

        addItemType(){
            var b="typeName";
            var c=this.pos.name;
            
            var a={};
            a[b]=c;
            //console.log(JSON.stringify(a));
            if(this.pos.name){
                axios({
                    method:'post',
                    url:'http://localhost:8083/system/config/itemType/',
                    
                     data:a
                     
                }).then(res=>{
                    if(res){
                        this.initTableData();
                        this.initTotaldata();
                        this.pos.name='';
                    }
                })
            }else{
                this.$message.error('名称不能为空！');
            }
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
                url:'http://localhost:8083/system/config/itemType/fitemPage?currentPage='+this.currentPage+'&size='+this.size
            }).then(res=>{
                if(res.data){
                    this.tableData=res.data.data;
                    this.total=res.data.total;
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

