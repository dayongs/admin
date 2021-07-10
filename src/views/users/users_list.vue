<template>
  <div>
    <span ref="eee"></span>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users_list '}">用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
        v-loading="loading"
        :data="listData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <!-- 用户详情-->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
<!--            <el-form-item label="头像:">-->
<!--              <span><img :src=" props.row.avatar_url " fit="contain" alt="" style="width:50px;"/> </span>-->
<!--            </el-form-item>-->
            <el-form-item label="名称:">
              <span>{{ props.row.nickname }}</span>
            </el-form-item>
            <el-form-item label="性别:">
              <span>{{ props.row.sex==='woman'?'女':'男'}}</span>
            </el-form-item>
            <el-form-item label="uuid:">
              <span>{{ props.row.uuid }}</span>
            </el-form-item>
            <el-form-item label="城   市:">
              <span>{{props.row.province_code}}</span>
            </el-form-item>

            <el-form-item label="手机:">
              <span>{{ props.row.phone_number}}</span>
            </el-form-item>
            <el-form-item label="生日:">
              <span>{{ props.row.birthday}}</span>
            </el-form-item>

            <el-form-item label="身高:">
              <span>{{ props.row.height }}</span>
            </el-form-item>
            <el-form-item label="城市:">
              <span>{{ props.row.full_address }}</span>
            </el-form-item>
            <el-form-item label="介绍:" :span="20">
              <span v-html="props.row.description"></span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
          type="selection"
          show-overflow-tooltip >
      </el-table-column>
      <el-table-column
          prop="avatar_url"
          label="头像"
          width="100">
        <template slot-scope="scope" class="block" >
          <img height="50px" :src="scope.row.avatar_url"/>
        </template>
      </el-table-column>
      <el-table-column
          prop="uuid"
          label="uuid"
          width="150">
      </el-table-column>
      <el-table-column
          prop="nickname"
          label="昵称"
          width="130">
      </el-table-column>
      <el-table-column
          prop="sex"
          label="性别">
        <template slot-scope="scope" class="block" >
          {{scope.row.sex=='woman'?'女':'男'}}
        </template>
      </el-table-column>

      <el-table-column
          prop="phone_number"
          label="注册电话">
      </el-table-column>
      <el-table-column
          prop="birthday"
          label="生日">
      </el-table-column>

      <el-table-column
          prop="height"
          label="身高">
      </el-table-column>
      <el-table-column
          prop="full_address"
          label="城市">
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope" >
<!--          <el-button @click="handleSign(scope.row)" type="text" >签到</el-button>-->
          <el-button @click="showDialog(scope.row)" type="text" >改编号</el-button>
        </template>

      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>

     </div>

<!--    修改编号弹窗-->
    <el-dialog
        title="修改编号"
        :visible.sync="dialogVisible"
        width="30%" >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="输入编号">
          <el-input v-model="form.user_num" type="number" min="1" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import numeral from 'numeral';
export default {
name: "JoinActivity",
  data(){
    return{



      activity:{},//当前活动
      listData: [],
      multipleSelection: [],//选中的
      rowId:{},
      boys:[],
      girls:[],
      dialogVisible: false,
      form: {
        user_num: 0,
      },
      loading:false,
      limitTime:5,//5分钟内提交


    }
  },
  created() {
    // this.activity.id = this.$route.query.id
    this.getList()
  },
  mounted() {
    // console.log('ddd',this.$refs.eee)
  },
  methods:{
    //1、查询用户
    async getList(){
      this.loading=true
      const url=`/users`
      const list= await this.$http.get(url,{})
      this.listData=list.data;
      console.log('查询结果',this.listData);
      this.loading=false
      return this.listData
    },




    // 5 取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },


    //选择后的一个或多个
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //6显示弹出框
    showDialog(row){
      this.rowId={}
      this.dialogVisible = true
      this.rowId=row.id
      this.form.user_num=row.user_num+1
    },

    //7弹窗 修改编号
    async onSubmit() {
      //查询是否有此编号
      const join=await this.getActivity(this.form.user_num-1)
      if(join.data.length>0){
        this.$message('该编号存在，请清空编号');
        return
      }
      //更新编号
      const url='/join_activities/'+this.rowId
      const newJoin=await  this.$http.put(url,{
        user_num:this.form.user_num-1,
        is_join_pair:1
      })
      // console.log('修改后的',newJoin.data.user_num);
      this.dialogVisible = false
      await this.getActivity()
    },





    //查看匹配结果弹窗
    openPairRes() {
      this.$confirm('已经完成匹配，是否进入匹配结果页面', '提示', {
        confirmButtonText: '查看匹配结果',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path:"/pair",
          query:{activity_id:this.activity.id }
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },

    //转换订单状态
    switchStatus(status){
      switch(status){
        case 1:return '系统管理员';
        case 2: return '商家' ;
        case 3: return '普通用户' ;

        default:return '未知';

      }
    },




  }//methods end

}
</script>

<style scoped >
.demo-table-expand {
  font-size: 0;

}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

</style>
