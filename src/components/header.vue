<template>
  <div style="background-color: #B3C0D1;">
    <div style="margin-right:auto;color: white;line-height: 55px">恋人管理</div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#B3C0D1" text-color="#fff" @select="handleSelect">
      <!--    <el-menu-item index="1">处理中心</el-menu-item>-->
      <el-submenu index="2" style="display: flex ;">
        <template slot="title">
          <el-avatar size="small" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"> user </el-avatar>
          {{user.nickname}}
        </template>
        <el-menu-item index="2-1">编辑信息</el-menu-item>
        <el-menu-item index="2-2" @click="loginOut">退出登陆</el-menu-item>
        <!--        <el-menu-item index="2-3">选项2</el-menu-item>-->

      </el-submenu>
    </el-menu>
  </div>

</template>

<script>

export default {
  name: "Admin2",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      user:{},
    };
  },
  created() {
    this.getUser()
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    getUser(){
      if(this.user){
        this.user=JSON.parse(window.sessionStorage.getItem('user'))
        // console.log(this.user)
      }

    },
    loginOut(){
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
      this.$router.push("/login")
    }

  }

}
</script>

<style scoped>

</style>
