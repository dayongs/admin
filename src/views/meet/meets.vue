<template>
  <div>
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/meet '}">邀约</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="text-right">
      <el-button  type="primary"><router-link to="/meet_check">邀约验码</router-link></el-button>
    </div>


    <el-table
        v-loading="loading"
        :data="meetsTableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="id"
          width="50">
      </el-table-column>
      <el-table-column
          prop="meet_time"
          label="时间"
          width="180">
      </el-table-column>
      <el-table-column
          prop="meet_location"
          label="地址"
          width="180">
      </el-table-column>
<!--      <el-table-column-->
<!--          prop="meet_message"-->
<!--          label="最新消息"-->
<!--          width="130">-->
<!--      </el-table-column>-->

      <el-table-column
          prop="from_uuid"
          label="发起人">
      </el-table-column>

      <el-table-column
          prop="to_uuid"
          label="接收人">
      </el-table-column>


      <el-table-column
          prop="status"
          label="进度"
          width="130">
      </el-table-column>

      <el-table-column
          prop="merchant_id"
          label="商户">
      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope" >
          <!--          <el-button @click="handleSign(scope.row)" type="text" >签到</el-button>-->

        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <!--      <el-button @click="toggleSelection()">取消选择</el-button>-->


    </div>

    <!--    修改编号弹窗-->
    <!--    <el-dialog-->
    <!--        title="修改编号"-->
    <!--        :visible.sync="dialogVisible"-->
    <!--        width="30%" >-->
    <!--      <el-form ref="form" :model="form" label-width="80px">-->
    <!--        <el-form-item label="输入编号">-->
    <!--          <el-input v-model="form.user_num" type="number" min="1" style="width:200px"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="onSubmit">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

  </div>

</template>

<script>
export default {
  name: "meet",//邀约
  data(){
    return{
      meetsTableData:[],
      loading:false,
      // meet_id:0,
    }
  },

  created() {
    // this.meet_id = this.$route.query.meet_id
    // console.log(this.activity_id )
    this.getMeets()
  },
  methods:{

    async getMeets(){
      this.loading=true
      const url=`/meets`
      // console.log(url);
      const meets= await this.$http.get(url,{})
      this.meetsTableData=meets.data;
      // console.log('查询结果',meets);
      this.loading=false
      return meets
    },




    //选择后的一个或多个
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
}
</script>

<style scoped>

</style>
