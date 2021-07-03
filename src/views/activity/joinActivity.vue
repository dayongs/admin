<template>
  <div>
    <span ref="eee"></span>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/join_activity '}">报名人员</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table
        v-loading="loading"
        :data="joinTableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          type="selection"
          show-overflow-tooltip >
      </el-table-column>
      <el-table-column
          prop="buy_name"
          label="姓名"
          width="150">
      </el-table-column>
      <el-table-column
          prop="user_uuid"
          label="uuid"
          width="100">
      </el-table-column>
      <el-table-column
          prop="buy_phone"
          label="电话"
          width="130">
      </el-table-column>
      <el-table-column
          prop="sex"
          label="性别">
        <template slot-scope="scope" class="block" >
          {{scope.row.sex==='woman'?'女':'男'}}
        </template>
      </el-table-column>
      <el-table-column
          prop="is_join_pair"
          label="是否参与匹配">
        <template slot-scope="scope" class="block" >
          {{scope.row.is_join_pair?'可参与':''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="user_num"
          label="编号">
        <template slot-scope="scope" class="block" >
          {{ (scope.row.user_num!=null)?scope.row.user_num+1:''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="pair_index"
          label="排序">
      </el-table-column>

      <el-table-column
          prop="sign_in"
          label="签到">
        <template slot-scope="scope" class="block" >
          {{scope.row.sign_in?'已签到':''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态">
        <template slot-scope="scope" class="block" >
          {{scope.row.status==='payed'?'已支付':''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="payed_at"
          label="购票时间"
          width="180">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope" >
          <el-button @click="handleSign(scope.row)" type="text" >签到</el-button>
          <el-button @click="clearNum(scope.row)" type="text" >清空编号</el-button>
          <el-button @click="showDialog(scope.row)" type="text" >改编号</el-button>
        </template>

      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="selectIndex()">编号</el-button>
      <el-button  @click="livePair">匹配</el-button>
      <el-button  @click="clearPairIndex">重置</el-button>
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
      joinTableData: [],
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
    this.activity.id = this.$route.query.id
    this.getActivity()
  },
  mounted() {
    console.log('ddd',this.$refs.eee)
  },
  methods:{
    //1、查询当前参与活动人员信息
    //&has_user_num=${1} 是否去掉null未编号的数据, 1为去掉
    // user_num 查询单个编号
    async getActivity(user_num){
      this.loading=true
      const url=`/join_activities?activity_id=${this.activity.id}&user_num=${user_num?user_num:''}`
      const joins= await this.$http.get(url,{})
      this.joinTableData=joins.data;
      // console.log('查询结果',joins);
      this.loading=false
      return joins
    },

    // 2 签到
    async handleSign(row){
      // console.log(row)
      const url='/join_activities/'+row.id
      const join= await this.$http.put(url,{
        sign_in:1,

      })
      // console.log('更新参与',join);
      if(join){
        await this.getActivity()
      }
    },


    //4 选择人员排序编号，分性别
    async selectIndex(){
      const selects= this.multipleSelection
      if(selects.length<1){
        this.$message.warning('请选择编号对象');
        return
      }

      //4.1分组
     await selects.forEach((item,index)=>{
        if(item.sex==="man"){
          this.boys.push(item)
        }else {
          this.girls.push(item)
        }
    })

      //4.2判断男女数量是否相等
      if(this.boys.length!=this.girls.length){
        this.$message.warning('请保持男女数一样');
        return
      }
      this.loading=true
      await this.girlBoyIndex(this.boys)
      await this.girlBoyIndex(this.girls)
      await this.getActivity()
      this.loading=false
      this.$message.success('已排序完成');
    },

    //4.3给男女分别编号
    async girlBoyIndex(obj){
      for(let i=0;i<obj.length;i++){//forEch不支持async
        const url='/join_activities/'+obj[i].id
        await  this.$http.put(url,{
          user_num:i,
          is_join_pair:1
        })
      }
    },




    //10 清空排序，重新匹配
    async clearPairIndex(){
      const selects= this.multipleSelection
      if(selects.length<1){
        this.$message.warning('请选择编号对象');
        return
      }
        for(let i=0;i<selects.length;i++){
          const url='/join_activities/'+selects[i].id
          await this.$http.put(url,{
            pair_index:null
          })
        }
      await this.getActivity()
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




    //8清空编号
    async clearNum(row) {
      // console.log(row)
      const url='/join_activities/'+row.id
      const newJoin=await  this.$http.put(url,{
        user_num:null,
        is_join_pair:0,
      })
      // console.log('修改后的',newJoin.data.user_num);
      await this.getActivity()
    },


    // 9 匹配
    async livePair(){
      //判断有编号的排序是否有值
      const getActivities= await this.getActivity()
      this.loading=true
      // console.log(getActivities)
      for (let activitiesKey of getActivities.data) {
        if(activitiesKey.user_num!=null){
          if(!activitiesKey.pair_index){
            this.loading=false
            this.$message.error(`uuid为${activitiesKey.user_uuid}的用户没有排序，无法匹配`)
            return
          }
        }
      }
      //查询当前登陆身份，
      const getUser=JSON.parse(window.sessionStorage.getItem('user'))
      // console.log('user',getUser)
      //提交匹配
      const url=`users/${getUser.uuid}/activities/${this.activity.id}/pairs`
      const joins= await this.$http.post(url,{ })
      // console.log('匹配返回结果',joins);
      if(joins.status===201){
        this.loading=false
        // this.$message.success('已匹配完成！')

        this.openPairRes()
        // setTimeout( ()=>{
        //   this.$router.push('/home')
        // } ,1000)
      }
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
    }



  }//methods end

}
</script>

<style scoped >


</style>
