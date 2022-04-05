<template>
    <div>
    <div style="display:flex;justify-content:space-between;">
            <div>
        <el-input size="small" class="addItemType" placeholder="添加物品" suffix-icon="el-icon-plus" v-model="pos.itemName" @keydown.enter.native="addItemType">
        </el-input>
        <el-select v-model="pos.typeId" placeholder="请选择物品类型" >
            <el-option
            v-for="item in titleLevels"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId">
            </el-option>
        </el-select>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="addItemType" > 添加</el-button>
        </div>
        <div>
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
        prop="id"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="typeId"
        label="类型编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="itemName"
        label="物品名称">
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
  title="编辑职位"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
        <el-tag>物品名</el-tag>
        <el-input v-model="updateItemName.itemName" class="updataItemType"></el-input>
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
    name: "EmpAdv",
    data(){
        return{
           currentPage:'1',
         
            totaldata:'',
            currentPage:1,
            size:8,
            jl:{
                name:'',
                titleLevel:''
            },
            titleLevels:[
               
            ],
   
            pos:{
                itemName:'',
                typeId:''
            },
            tableData: [],
            dialogVisible:false,
            updateItemName:{
                itemName:''
            },
             multipleSelection: []
        }
    },
    mounted() {
        
        this.initSelect();
        this.initTableData();
    },
    methods: {
         exportData(){
            
            this.downloadequest('http://localhost:8083/system/sitem/export');
        },
           sizeChange(size){
this.size=size;
this.initTableData();
      },
      currentChange(currentPage){
        this.currentPage=currentPage;
       this.initTableData();

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

        deleteMultiple(){
                this.$confirm('此操作将永久删除['+this.multipleSelection.length+']条物品类型数据,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let ids='?';
            this.multipleSelection.forEach(item=>{
                ids+='ids='+item.id+'&';
            });

          axios({
                method:'delete',
                url:'http://localhost:8083/system/sitem/'+ids,
                
            }).then(res=>{
                if(res){
                    this.initTableData();  
                    this.inittotaldata(); 
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
                    url:'http://localhost:8083/system/sitem/',
                    
                     data:this.updateItemName
                     
                }).then(res=>{
                    if(res){
                        this.initTableData();
                        this.dialogVisible=false;
                    }
                })
        },

        addItemType(){

            
            // var b="itemName";
            // var c=this.pos.itemName;
            
            // var a={};
            // a[b]=c;
            console.log(this.pos);
            if(this.pos.itemName&&this.pos.typeId){
                axios({
                    method:'post',
                    url:'http://localhost:8083/system/sitem/',
                    
                     data:this.pos
                     
                }).then(res=>{
                    if(res){
                        this.initTableData();
                        this.initTotaldata();
                        this.pos.itemName='';
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
            Object.assign(this.updateItemName,data);
            this.updateItemName.createDate='';
            this.dialogVisible=true;
        },
        handleDelete(index,data){

            this.$confirm('此操作将永久删除'+data.itemName+',是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios({
                method:'delete',
                url:'http://localhost:8083/system/sitem/'+data.id,
                
            }).then(res=>{
                if(res){
                    this.initTableData(); 
                    this.inittotaldata();  
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
                url:'http://localhost:8083/system/sitem/sitemPage?currentPage='+this.currentPage+'&size='+this.size
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
