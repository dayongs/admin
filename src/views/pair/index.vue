<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/pair '}">匹配</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
        v-loading="loading"
        :data="pairsTableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
<!--      <el-table-column-->
<!--          type="selection"-->
<!--          show-overflow-tooltip-->
<!--      >-->
<!--      </el-table-column>-->
      <el-table-column
          prop="id"
          label="id"
          width="150">
      </el-table-column>
      <el-table-column
          prop="user_uuid"
          label="匹配人"
          width="150">
      </el-table-column>
      <el-table-column
          prop="pair_uuid"
          label="被匹配人"
          width="100">
      </el-table-column>
      <el-table-column
          prop="status"
          label="匹配状态"
          width="130">
      </el-table-column>

      <el-table-column
          prop="activity_id"
          label="活动id">

      </el-table-column>

      <el-table-column
          prop="room_time"
          label="截止时间">
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
  name: "pairIndex",//匹配
  data(){
    return{
      pairsTableData:[],
      loading:false,
      activity_id:0,
    }
  },

  created() {
    this.activity_id = this.$route.query.activity_id
    // console.log(this.activity_id )
    this.getPairs(this.activity_id)
  },
  methods:{

    async getPairs(activity){
      this.loading=true
      const url=`/pairs?activity_id=${this.activity_id?this.activity_id:''}`
      // console.log(url);
      const pairs= await this.$http.get(url,{})
      this.pairsTableData=pairs.data;
      // console.log('查询结果',pairs);
      this.loading=false
      return pairs
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
