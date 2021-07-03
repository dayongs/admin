<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/add_activity' }">添加活动</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 添加表单    -->
      <el-row :gutter="20"
        v-loading="loading"
      >
        <el-col :span="20">
          <el-form ref="activity" :model="activity" label-width="80px">
            <el-form-item label="用户名" >
              <el-input v-model="activity.title" autocomplete="off"></el-input>
            </el-form-item>
            <!--   海报 -->
            <el-form-item label="海报" >
              <el-upload
                  class="avatar-uploader "
                  :action="actionURL.posterPath"
                  :show-file-list="true"
                  :on-success="handlePosterSuccess"
                  :before-upload="beforePosterUpload">
                <img v-if="activity.posterView" :src="activity.posterView" class="poster_img">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="金额" >
              <el-input-number v-model="activity.price":precision="2" controls-position="right"  :min="0" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="人数" >
              <el-input-number v-model="activity.num" controls-position="right"  :min="1" :max="100"></el-input-number>
            </el-form-item>
            <!--   城市-->
            <el-form-item label="城市选择" >
              <el-cascader
                  placeholder="试试搜索:重庆"
                  :options="areas"
                  v-model="areasValue"
                  @focus="areasLoad"
                  v-loading="cityloading"
                  @change="handleChange1"
                  filterable>
              </el-cascader>
              <el-input v-model="activity.address" ></el-input>
            </el-form-item>
            <el-form-item label="现场匹配">
              <el-checkbox v-model="activity.is_pair">支持</el-checkbox>
            </el-form-item>
            <el-form-item label="展示时间" >
              <el-date-picker
                  v-model="activity.openRang"

                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动时间" >
              <el-date-picker
                  v-model="activity.showRang"

                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止时间" >
              <el-date-picker
                  v-model="activity.applyRang"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="联系方式">
              <el-input v-model="activity.contact" ></el-input>
            </el-form-item>


            <el-form-item label="简介">
              <el-input v-model="activity.summary" ></el-input>
            </el-form-item>



            <!--   用于替换编辑器base64上传         -->
            <div style="display:none;">
              <el-upload class="edit-uploader" :action="actionURL.contentImgPath"
                         :show-file-list="false"
                         :on-success="editorUploadSuccess"
                         :on-error="editorUploadError"
                         :before-upload="beforeEditorUpload" >
                <i class="el-icon-plus avatar-uploader-icon" ref="aUpload"></i>
              </el-upload>
            </div>

            <el-form-item label="活动内容" >
              <quill-editor ref="myQuillEditor"  v-model="activity.content" class="myQuillEditor" :options="editorOption" />
            </el-form-item>
            <el-form-item >
              <el-button type="primary" @click="addActivity">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//编辑器图片放大缩小
// import ImageResize from 'quill-image-resize-module'
import {ImageResize} from '../lib/mageResize'
import Quill from 'quill'
Quill.register('modules/imageResize', ImageResize);
import moment from 'moment';
import numeral from 'numeral';


export default {
  name: "Activity",
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        modules: {
          imageResize:{          //放大缩小
            displaySize: true
          },
          toolbar: {container:[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
            ],
            handlers: {
              'image': function(value) {
                if (value) {
                  document.querySelector('.edit-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
                // this.$refs.aUpload.click() //自定义图片上传回调
              }
            }
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        },
      },
      actionURL: {
        posterPath:this.$http.defaults.baseURL+'/activities/poster',//海报提交地址
        contentImgPath:this.$http.defaults.baseURL+'/activities/content',//编辑器内图片地址
      },


      loading: false,
      cityloading: false,
      areasValue:'',//选择城市
      areas: [],//城市数据

      activity:{
        title:'',
        poster: '',//七牛存储地址
        posterView:'',//当前显示图片全地址
        province_code :0,
        city_code  :0,
        district_code :0,
        address:'',
        summary :'',
        content :'',
        openRang:[],
        showRang:[],
        applyRang:[],
        price   :0,
        num:0,
        contact:'',
        is_pair : false,
        user_uuid :'',
      },


    }
  },
  created() {},
  methods:{
    //
    handleChange1(value) {
      console.log(value);

    },

    //加载城市
    async areasLoad(){
      this.cityloading=true
      this.areas=JSON.parse(localStorage.getItem('areasData'))//object //转为对象
      // console.log('areas',this.areas)
      this.cityloading=false

    },


    //海报上传
    handlePosterSuccess(res, file) {
      // this.activity.poster = URL.createObjectURL(file.raw);
      this.activity.poster=res.qi,
      this.activity.posterView=res.url
    },
    beforePosterUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    //富文本上传图片
    beforeEditorUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    },
    editorUploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },

    // 富文本图片上传失败
    editorUploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },


    //提交活动
    async addActivity(){

      this.loading=true;
      const url='/activities'
      const activity=await this.$http.post(url,{
        title:this.activity.title,
        content:this.activity.content,
        summary:this.activity.summary,
        poster:this.activity.poster,

        start_at:this.momentRang(this.activity.openRang[0]),
        end_at:this.momentRang(this.activity.openRang[1]),

        show_start_at:this.momentRang(this.activity.showRang[0]),
        show_end_at:this.momentRang(this.activity.showRang[1]),

        apply_start_at:this.momentRang(this.activity.applyRang[0]),
        apply_end_at:this.momentRang(this.activity.applyRang[1]),

        province_code:this.areasValue[0],
        city_code:this.areasValue[1],
        district_code:this.areasValue[2],

        price:this.activity.price,
        num:this.activity.num,
        contact:this.activity.contact,
        is_pair:1,
      })
      this.loading=false;
      console.log('activity',activity)
      this.$router.push('/activity_list')

    },

    //时间处理
    momentRang:(time)=>{
      moment(time).format('YYYY-MM-DD HH:mm:ss')
    }


  }
}
</script>


<style scoped>
  .el-breadcrumb{
    height: 50px;
  }
  .el-row{

  }
  .avatar-uploader{
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
