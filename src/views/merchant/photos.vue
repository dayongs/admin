<template>
  <div>
    <!--  面包屑  -->
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/photos' }">相册</el-breadcrumb-item>
      </el-breadcrumb>

    </div>

    <el-row :gutter="20" v-loading="loading">

      <!--      <el-col :span="8" v-for="(photo, index) in photos" :key="index" >-->
      <!--        <el-card >-->
      <!--          <img :src="photo.full_url" class="image">-->
      <!--          <div >-->
      <!--            <div class="bottom clearfix">-->
      <!--              <el-button type="text" class="button">删除</el-button>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </el-card>-->
      <!--      </el-col>-->
<!--形象照-->
      <el-col :span="20">
        <el-form ref="merchant"  label-width="80px">
          <el-form-item label="形象照">
            <el-upload
                class="upload-demo"
                :action="$http.defaults.baseURL + '/merchants/'+this.merchant_id+'/avatars'"
                :on-preview="avatarPreview"
                :on-remove="avatarRemove"
                :file-list="merchant"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

        </el-form>
      </el-col>


<!--  相册-->
      <el-col :span="20">
        <el-form ref="merchant"  label-width="80px">
          <el-form-item label="相册">
            <el-upload
                class="upload-demo"
                :action="$http.defaults.baseURL + '/merchants/'+this.merchant_id+'/photos'"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="photos"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
  name: "merchant_photos",
  components: {},
  data() {
    return {
      domain: domain.qiNiuUrl + '/',//七牛储存地址

      merchant_id: 0,

      user: JSON.parse(window.sessionStorage.getItem('user')),
      loading: false,

      merchant: [],

      photos: [],
      fileList: [
        //     {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],

    }
  },
  created() {
    this.merchant_id = this.$route.query.merchant_id
    console.log(this.merchant_id)
    this.getPhotos()
    this.getMerchant()

  },
  methods: {

    async getPhotos() {
      const url = '/merchants/' + this.merchant_id + '/photos'
      let photos = await this.$http.get(url, {})
      this.photos = photos.data

      for (let photo of photos.data) {
        photo.url = photo.file.full_url
      }

      this.fileList = photos.data
      // console.log(this.photos);
    },


    async getMerchant() {
      const url = '/merchants/' + this.merchant_id
      let merchant = await this.$http.get(url, {})
      console.log(merchant.data.avatar_url);
      this.merchant[0].url = merchant.data.avatar_url

      console.log(this.merchant);
      // this.merchant.url = merchant.avatar_url

      //
      // this.fileList = photos.data

    },



    //相册
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    //头像
    avatarRemove(file, fileList) {
      console.log(file, fileList);
    },
    avatarPreview(file) {
      console.log(file);
    },



  }
}
</script>


<style scoped>
.el-breadcrumb {
  height: 50px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 300px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}


</style>
