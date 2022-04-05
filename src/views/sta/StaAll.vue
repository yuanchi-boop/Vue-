<template>

    <div>
        <div class="permissMana">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.roleName">
            <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input v-model="role.roleDesc" size="small" placeholder="请输入角色中文名"></el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addItemType" > 添加角色</el-button>
        </div>
        <div class="permissManaMain">
            <el-collapse  accordion @change="change">
            <el-collapse-item :title="r.roleDesc" :name="r.id" v-for="(r,index) in roles" :key="index">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>可访问资源</span>
                        <el-button style="float: right; padding: 3px 0;color: #ff0000;"
                         type="text" icon="el-icon-delete"></el-button>
                    </div>
                    <div>
                        <el-tree show-checkbox 
                                :data="allMenus" 
                                :props="defaultProps"
                                :default-checked-keys="selectMenus"
                                node-key="id"
                        ></el-tree>

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
          role:{
              roleCode:'',
              roleDesc:'',
              roleName:''
          },
       
          roles:[],
          allMenus:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        selectMenus:[]
      }
  },
  mounted() {
      this.initRoles();
  },
  methods:{
      change(rid){
          if(rid){
              this.initAllMenus();
          }
      },
      initAllMenus(){
          axios({
              method:'get',
              url:'http://localhost:8083/system/cfg/menu'
          }).then(res=>{
              this.allMenus=res.data;
              console.log(this.allMenus);
          })
      },
      initRoles(){
          axios({
              method:'get',
              url:'http://localhost:8083/system/role/'
          }).then(res=>{
              if(res){
                  this.roles=res.data;
              }
          })
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
    .permissManaMain{
        margin-top:10px;
        width:650px;
    }
</style>
