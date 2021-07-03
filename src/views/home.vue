<template>
  <el-container>
    <el-header style="background-color: #B3C0D1;">
      <myHeader style="display: flex;align-items: end;"></myHeader><!-- 头部-->
    </el-header>
    <el-container>
      <el-aside width="200px"><!-- 左边导航-->
        <myAside></myAside>
      </el-aside>
      <el-main><!-- main右边主要内容-->
        <router-view></router-view><!-- 路由占位符 ，主要通过路由占位符显示页面     -->
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import myAside from "@/components/myAside";
import myHeader from "@/components/header";
export default {
  name: "Home",
  components:{
    myAside,
    myHeader
  },
  data(){
    return{
    }
  },
  created() {
    this.areasLoad()
  },
  methods:{
    //加载城市存在本地
    async areasLoad(){
      const a=JSON.parse( localStorage.getItem('areasData'))//转为对象
      if(!a){
        const areas= await  this.$http.get('/nested_areas',{})
        localStorage.setItem('areasData',JSON.stringify(areas.data));//字符串存储
      }
      // console.log(a)//object

    },
  }
}
</script>

<style scoped>

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  /*text-align: center;*/
  /*line-height: 60px;*/
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
