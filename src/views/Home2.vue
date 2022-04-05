<template>
    <div>
    <el-container>
  <el-header>Header</el-header>
  <el-container>
    <el-aside width="200px">
     <el-menu @select="menuClick">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>导航一</template>
        
          <el-menu-item index="/test1">选项1</el-menu-item>
          <el-menu-item index="/test1">选项2</el-menu-item>
     
      </el-submenu>
     </el-menu>
    </el-aside>
    <el-main>
        <router-view/>
    </el-main>
  </el-container>
</el-container>
</div>
</template>

<script>
export default {
    name:"Home",
    methods:{
      menuClick(index){
        this.$router.push(index);
      }
    }
    // computed:{
    //   routes(){
    //     return this.$store.state.routes;
    //   }
    // }
}
</script>

<style scoped>

</style>