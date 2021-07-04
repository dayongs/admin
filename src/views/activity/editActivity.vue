<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/edit_activity' }">编辑活动</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 添加表单    -->
      <el-row :gutter="20"
        v-loading="loading"
      >
        <el-col :span="20">
          <el-form ref="activity" :model="activity" label-width="80px">
            <el-form-item label="标题" >
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
            <el-form-item label="费用" >
              <el-input-number v-model="activity.price":precision="2" controls-position="right"  :min="0" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="人数" >
              <el-input-number v-model="activity.plan_num" controls-position="right"  :min="1" :max="100"></el-input-number>
            </el-form-item>
            <!--   城市-->
            <el-form-item label="城市选择" >
              <el-cascader
                  placeholder="试试搜索:重庆"
                  :options="areas"
                  v-model="areasValue"
                  v-loading="cityloading"
                  @change="handleChange1"
                  style="width:400px"
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
                  @change="momentRang(activity.openRang)"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动时间" >
              <el-date-picker
                  v-model="activity.showRang"
                  @change="momentRang(activity.showRang)"
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
                  @change="momentRang(activity.applyRang)"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="联系方式">
              <el-input v-model="activity.contact" style="width:200px"></el-input>
            </el-form-item>


            <el-form-item label="简介">
              <el-input v-model="activity.summary" ></el-input>
            </el-form-item>



            <!--   用于替换编辑器base64上传         -->
            <div style="display:none;">
              <el-upload class="edit-uploader" :action="actionURL.contentsImgPath"
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
              <el-button type="primary" @click="editActivity">提交</el-button>
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
      // actionURL: {
      //   posterPath:this.$http.defaults.baseURL+'/activities/poster',//海报提交地址
      //   contentImgPath:this.$http.defaults.baseURL+'/activities/content',//编辑器内图片地址
      // },
      actionURL: {
        posterPath:'',//海报提交地址
        contentsImgPath:'',//编辑器内图片地址
      },


      loading: false,
      cityloading: false,
      areasValue:[],//选择城市
      areas: [],//城市数据

      activity:{
        id:0,
        title:'',
        // poster: '',//七牛存储地址
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
        plan_num:0,
        contact:'',
        is_pair : false,
        user_uuid :'',
      },


    }
  },
  created() {
    this.activity.id=this.$route.query.id
    // console.log(this.activity.id)
    this.actionURL.posterPath=this.$http.defaults.baseURL+'/activities/'+this.activity.id+'/poster';//海报提交地址
    this.actionURL.contentsImgPath=this.$http.defaults.baseURL+'/activities/'+this.activity.id+'/contents';//编辑器内图片地址
    this.getActivity()
    this.areas=JSON.parse( localStorage.getItem('areasData'))//转为对象//加载城市
  },
  methods:{

    //查询当前1条活动
    async getActivity(){
      this.loading=true
      const url='/activities/'+this.activity.id
      const activity= await this.$http.get(url,{})
      let a=activity.data
      console.log(a)
      this.activity.title=a.title
      // this.activity.poster=a.poster
      this.activity.posterView=a.poster_url
      this.areasValue=[a.province_code,a.city_code,a.district_code]
      this.activity.address=a.address
      this.activity.summary=a.summary
      this.activity.content=a.content

      this.activity.openRang=[a.start_at,a.end_at]
      this.activity.showRang=[a.show_start_at,a.show_end_at]
      this.activity.applyRang=[a.apply_start_at,a.apply_end_at]

      this.activity.price=a.price
      this.activity.plan_num=a.plan_num
      this.activity.contact=a.contact
      this.activity.is_pair=a.is_pair?true:false

      this.loading=false
      // console.log(this.activity)

    },


    handleChange1(value) {
      console.log(value);

    },




    //海报上传成功返回
    handlePosterSuccess(res, file) {
      // console.log(res)//url
      // this.activity.poster = URL.createObjectURL(file.raw);
      // this.activity.poster=res.qi,
      // this.activity.posterView=res.url
      this.activity.posterView=res
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
        // console.log('aaa',res)//res> url
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        // quill.insertEmbed(length, 'image', res.url)
        quill.insertEmbed(length, 'image', res)
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
    async editActivity(){
      this.loading=true;
      const url='/activities/'+this.activity.id
      const activity=await this.$http.put(url,{

        title:this.activity.title,
        content:this.activity.content,
        summary:this.activity.summary,
        poster:this.activity.poster,

        start_at:this.activity.openRang[0],
        end_at:this.activity.openRang[1],

        show_start_at:this.activity.showRang[0],
        show_end_at:this.activity.showRang[1],

        apply_start_at:this.activity.applyRang[0],
        apply_end_at:this.activity.applyRang[1],

        province_code:this.areasValue[0],
        city_code:this.areasValue[1],
        district_code:this.areasValue[2],
        address:this.activity.address,

        price:this.activity.price,
        plan_num:this.activity.plan_num,
        contact:this.activity.contact,
        is_pair:this.activity.is_pair,
      })
      this.loading=false;
      console.log('activity',activity)
      this.$router.push('/activity_list')

    },

    //时间处理
    momentRang:(time)=>{
      time[0]=moment(time[0]).format('YYYY-MM-DD HH:mm:ss')
      time[1]=moment(time[1]).format('YYYY-MM-DD HH:mm:ss')

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
  .poster_img {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
