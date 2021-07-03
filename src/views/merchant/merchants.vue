<template>
  <div>
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/merchant '}">商户</el-breadcrumb-item>
      </el-breadcrumb>
        <el-button   type="primary"><router-link to="/add_merchant">添加</router-link></el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="merchantsTableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="id"
          width="50">
      </el-table-column>
      <el-table-column
          prop="name"
          label="商户名称"
          width="180">
      </el-table-column>

      <el-table-column
          prop="introduction"
          label="介绍"
          width="130">
      </el-table-column>

      <el-table-column
          prop="contact_phone"
          label="联系人电话">
      </el-table-column>

      <el-table-column
          prop="contact_name"
          label="联系人名称">
      </el-table-column>

      <el-table-column
          prop="user_uuid"
          label="关联用户"
          width="130">
      </el-table-column>
      <el-table-column
          label="相册"
          width="130">
        <template slot-scope="scope">
          <router-link :to="'/photos_merchant?merchant_id='+scope.row.id">相册</router-link>
        </template>

      </el-table-column>

<!--      <el-table-column-->
<!--          prop="province_code"-->
<!--          label="省份">-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--          prop="city_code"-->
<!--          label="城市"-->
<!--          width="130">-->
<!--      </el-table-column>-->

      <el-table-column
          prop="district_code"
          label="地区">
      </el-table-column>
      <el-table-column
          prop="address"
          label="地址"
          width="180">
      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
<!--          <el-button @click="handleSign(scope.row)" type="text">编辑</el-button>-->
          <el-button @click="clickEdit(scope.row)" type="text" >编辑</el-button>
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
  name: "merchant",//邀约
  data() {
    return {
      merchantsTableData: [],
      loading: false,
      // merchant_id:0,
    }
  },

  created() {
    // this.merchant_id = this.$route.query.merchant_id
    // console.log(this.activity_id )
    this.getMerchants()
  },
  methods: {

    async getMerchants() {
      this.loading = true
      const url = `/merchants`
      // console.log(url);
      const merchants = await this.$http.get(url, {})
      this.merchantsTableData = merchants.data;
      // console.log('查询结果',merchant);
      this.loading = false
      return merchants
    },

    //2、  编辑
    clickEdit(row) {
      // console.log(row);
      this.$router.push({
        // path: `/edit_activity/${row.id}`,
        path:"/edit_merchant",
        query:{id:row.id}
      })
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
