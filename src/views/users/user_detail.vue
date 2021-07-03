<template>
  <div class="container">

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users_list '}">用户详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="1">
<!--        <div class="grid-content  text-center">头像</div>-->
      </el-col>
      <el-col :span="6">
        <div class=" "><img height="50px" :src="listData.avatar_url"/></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="  ">昵称</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.nickname }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="1">
        <div class="  ">uuid</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.uuid }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="1">
        <div class="  ">性别</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.sex }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="1">
        <div class="  ">身高</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.height }}</div>
      </el-col>
    </el-row>



    <el-row>
      <el-col :span="1">
        <div class="  ">年龄</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.birthday }}</div>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="  ">号码</div>
      </el-col>
      <el-col :span="6">
        <div class=" ">{{ listData.phone_number }}</div>
      </el-col>
    </el-row>


    <!--    修改编号弹窗-->
    <el-dialog
        title="修改编号"
        :visible.sync="dialogVisible"
        width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="输入编号">
          <el-input v-model="form.user_num" type="number" min="1" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!--        <el-button type="primary" @click="onSubmit">确 定</el-button>-->
      </span>
    </el-dialog>


  </div>
</template>

<script>
import numeral from 'numeral';

export default {
  name: "JoinActivity",
  data() {
    return {

      listData: [],

      dialogVisible: false,
      form: {
        user_num: 0,
      },
      loading: false,


    }
  },
  created() {
    this.uuid = this.$route.query.uuid
    console.log(this.uuid);
    this.getList()
  },
  mounted() {
    // console.log('ddd',this.$refs.eee)
  },
  methods: {
    //1、查询用户
    async getList() {
      this.loading = true
      const url = `/users/${this.uuid}`
      const list = await this.$http.get(url, {})
      this.listData = list.data;
      console.log('查询结果', this.listData);
      this.loading = false
      return this.listData
    },


    //6显示弹出框
    showDialog(row) {
      this.dialogVisible = true
      // this.form.user_num=row.user_num+1
    },


  }//methods end

}
</script>

<style scoped>

.el-row {
  margin-bottom: 20px;

}

.el-row .last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>
