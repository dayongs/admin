<template>
  <!-- 便于手机微信验票 -->
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 m-auto pt-5">
            <div class="card">
              <div class="card-header">
                <div>{{from_nickname}}和{{to_nickname}}的邀约</div>

              </div>
              <div class="card-body">
                {{ (join_status==2)?'已验':'待验'}}
                <el-button type="primary" class=" col-4 col-sm-4 col-md-3 col-lg-2 float-right"  @click="joinMeetUse" >验码</el-button>
              </div>
<!--              <div class="card-footer">-->
<!--              </div>-->

            </div>

          </div>
        </div>
      </div>

</template>

<script>
export default {
name: "check",
  data(){
    return{
      meet_id: 0,//
      join_meet_id:0,
      joinMeet:{},
      newJoinMeet:{},
      join_status:0,//邀约状态
      from_nickname:'',
      to_nickname:'',

      loading: false,//加载


    }
  },
  mounted() {
  //meet_id=108&join_meet_id=170
    this.meet_id = this.$route.query.meet_id
    this.join_meet_id = this.$route.query.join_meet_id
    // console.log(this.$route.query);
    this.findCheck()
  },
  methods:{

    //1、查询
    async findCheck(){
      if(this.meet_id){
        const url=`/meets/${this.meet_id}/joins/${this.join_meet_id}/checks`
        const Join_meet=  await this.$http.get(url,{ })
        this.joinMeet=Join_meet.data

        console.log('JoinMeet',this.joinMeet);

        this.from_nickname=this.joinMeet.meet.user.nickname
        this.to_nickname=this.joinMeet.meet.to.nickname
        this.join_status=this.joinMeet.status
        //
        // this.joinMeetCheck=[]//初始化
        // this.joinMeetCheck.push(joinMeet)//将对象转为数组
        // if(orderActivity.status!=='payed'){
        //   this.$message.error("该票不可用")
        //   return
        // }


      }
    },




    //2、检票
    async joinMeetUse(){
      await this.findCheck()
      const url=`/meets/${this.meet_id}/joins/${this.join_meet_id}/checks`
      const newJoinMeet=  await this.$http.put(url,{ })
      this.newJoinMeet=newJoinMeet.data
      console.log('joinMeet',this.newJoinMeet);
      this.join_status=this.newJoinMeet.status
      if(this.newJoinMeet){this.$message({ message: '邀约码已验',type: 'success'  }); }

    },





    //转换订单状态
    switchStatus(status){
      switch(status){
        case 'payed':return '已付款';
        case 'wait_pay': return '等待付款' ;
        case 'used': return '已使用' ;
        case 'refunded':return '已退款';
        case 'wait_refund': return '等待退款' ;
        case 'expired': return '过期' ;
        case 'cancel': return '已取消' ;
        default:return '未知';

      }
    },
  }
}
</script>

<style scoped>

</style>
