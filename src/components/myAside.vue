<template>
  <el-menu
      default-active="1"
      router
      class="el-menu-vertical-demo">

    <el-menu-item default-active index="1" route="/dashboard">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item index="/users_list">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">用户</span>
    </el-menu-item>

    <el-menu-item index="2" route="/activity_list">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">活动列表</span>
    </el-menu-item>


    <el-menu-item index="3" route="/add_activity">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">添加活动</span>
    </el-menu-item>

    <el-menu-item index="4" route="/check">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">验票</span>
    </el-menu-item>

    <el-menu-item index="5" route="/pair">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">匹配</span>
    </el-menu-item>

    <el-menu-item index="/meets">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">邀约</span>
    </el-menu-item>

    <el-menu-item index="/merchants">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">商户</span>
    </el-menu-item>


    <el-menu-item index="7" route="/">
      <i class="el-icon-arrow-right"></i>
      <span slot="title">统计</span>
    </el-menu-item>


    <el-submenu index="8">
      <template slot="title">
        <i class="el-icon-arrow-right"></i>
        <span slot="title">权限管理</span>
      </template>
      <!--        <el-menu-item index="/roles" >-->
      <!--          <i class="el-icon-menu"></i>角色管理-->
      <!--        </el-menu-item>-->
      <el-menu-item index="/permissions">
        <i class="el-icon-menu"></i>权限
      </el-menu-item>
      <el-menu-item index="/user_roles">
        <i class="el-icon-menu"></i>用户
      </el-menu-item>
      <el-menu-item index="/role_permissions">
        <i class="el-icon-menu"></i>角色
      </el-menu-item>


    </el-submenu>


    <el-submenu index="9">
      <template slot="title">
        <i class="el-icon-arrow-right"></i>
        <span slot="title">其他</span>
      </template>

      <el-submenu index="9-4">
        <template slot="title">基础设置</template>
        <el-menu-item index="9-4-1" route="/">
          <i class="el-icon-menu"></i>版本
        </el-menu-item>
        <el-menu-item index="9-4-1" route="/">
          <i class="el-icon-menu"></i>协议
        </el-menu-item>
      </el-submenu>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "myAside"
}
</script>

<style scoped>
.el-menu-vertical-demo {
  text-align: left;
}
</style>
