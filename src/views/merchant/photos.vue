<template>
  <div>
    <!--  面包屑  -->
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/photos' }">相册</el-breadcrumb-item>
      </el-breadcrumb>

    </div>

    <el-row :gutter="20" v-loading="loading">

      <el-col :span="20">
        <el-form ref="merchant"  label-width="80px">
          <el-form-item label="形象照">
        <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/merchants/'+this.merchant_id+'/avatars'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
                :on-success="photosSuccess"
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

      photos: [],//相册// fileList: [ { name: 'food.jpeg', url: '...' }  ],//模版

      imageUrl: ''//形象照
    }
  },
  created() {
    this.merchant_id = this.$route.query.merchant_id
    // console.log(this.merchant_id)
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
      // console.log(merchant.data);
      this.imageUrl = merchant.data.avatar_url

    },



    //相册
    photosSuccess(file, fileList){
      // console.log( fileList);
      this.getPhotos()//上传成功附上真实地址
    },

   async handleRemove(file, fileList) {
      // console.log(file, fileList);
      const url = '/merchants/' + this.merchant_id + '/photos/'+file.id
      let res = await this.$http.delete(url, {})
      // console.log(res)
     if(res.status==200){
       this.$message.success('删除成功')
     }


    },
    handlePreview(file) {
      console.log(file);
    },




    //头像
    handleAvatarSuccess(res, file) {
      this.$message.success('上传成功')
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }



  }
}
</script>


<style scoped  >
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

/*上传头像*/
.avatar-uploader >>> .el-upload{

  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: white;

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
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}


</style>
