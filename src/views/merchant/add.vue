<template>
  <div>
    <!--  面包屑  -->
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/add_merchant' }">添加商户</el-breadcrumb-item>
      </el-breadcrumb>

    </div>

    <!-- 添加表单    -->
    <el-row :gutter="20"  v-loading="loading" >
      <el-col :span="20">
        <el-form ref="merchant" :model="merchant" label-width="80px">
          <el-form-item label="商户名">
            <el-input v-model="merchant.name" style="width:400px" autocomplete="off"></el-input>
          </el-form-item>

          <!--   城市-->
          <el-form-item label="城市选择">
            <el-cascader
                placeholder="试试搜索:重庆"
                :options="areas"
                v-model="areasValue"
                @focus="areasLoad"
                v-loading="cityloading"
                @change="cityChange"
                style="width:400px"
                filterable>
            </el-cascader>
            <el-input v-model="merchant.address" style="width:500px"></el-input>
          </el-form-item>



          <el-form-item label="联系方式">
            <el-input v-model="merchant.contact_phone" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="merchant.contact_name" style="width:200px"></el-input>
          </el-form-item>


          <el-form-item label="介绍">
<!--            <el-input v-model="merchant.introduction"></el-input>-->
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="merchant.introduction">
            </el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="postMerchant">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import moment from 'moment';
import numeral from 'numeral';


export default {
  name: "add_merchant",
  components: {},
  data() {
    return {

      user:JSON.parse(window.localStorage.getItem('user')),
      loading: false,
      cityloading: false,
      areasValue: [],//选择城市
      areas: [],//城市数据

      merchant: {
        name: '',
        address: '',
        introduction: '',
        contact_phone: '',
        contact_name: '',
        //
        // province_code: 0,
        // city_code: 0,
        district_code: 0,
      },

    }
  },
  created() {
    // console.log(this.merchant.id)
    // this.getMerchant()
    this.areas = JSON.parse(localStorage.getItem('areasData'))//转为对象//加载城市
  },
  methods: {

    getUser(){
      if(this.user){
        this.user=JSON.parse(window.sessionStorage.getItem('user'))
        // console.log(this.user)
      }

    },

    //加载城市
    async areasLoad(){
      this.cityloading=true
      this.areas=JSON.parse(localStorage.getItem('areasData'))//object //转为对象
      // console.log('areas',this.areas)
      this.cityloading=false
    },



    cityChange(value) {
      console.log(value);

    },




    //添加商户
    async postMerchant() {
      this.loading = true;
      const url = '/merchant'
      const merchant = await this.$http.post(url, {

        name: this.merchant.name,
        introduction: this.merchant.introduction,
        // poster: this.merchant.poster,
        // province_code: this.areasValue[0],
        // city_code: this.areasValue[1],
        district_code: this.areasValue[2],
        address: this.merchant.address,
        contact_phone: this.merchant.contact_phone,
        contact_name: this.merchant.contact_name,
        user_uuid:this.user.uuid
      })
      this.loading = false;
      console.log('merchant', merchant)
      this.$router.push('/merchants')

    },

    //时间处理
    momentRang: (time) => {
      time[0] = moment(time[0]).format('YYYY-MM-DD HH:mm:ss')
      time[1] = moment(time[1]).format('YYYY-MM-DD HH:mm:ss')

    }


  }
}
</script>


<style scoped>
.el-breadcrumb {
  height: 50px;
}

.el-row {

}

.avatar-uploader {
  background-color: white;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.poster_img {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
