<template>
  <!-- 便于手机微信验票 -->
      <div class="container">
        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 m-auto pt-5">
            <div class="card">
              <div class="card-header">
                <el-form :model="orderForm" >
                  <el-form-item >
                    <el-col  class="col-8 col-sm-10 col-md-8 col-lg-4">
                      <el-input  :span="11" v-model="orderForm.order_number" placeholder="票单号" autocomplete="off"></el-input>
                    </el-col>
                    <el-button class="col-4 col-sm-2 col-md-4 col-lg-2 " type="primary" @click="ticketCheck">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="card-body">
                <el-table :data="orderActivityCheck">
                  <el-table-column property="activity_id" label="id" ></el-table-column>
                  <el-table-column property="title" label="标题" ></el-table-column>
                  <el-table-column property="buy_phone" label="电话" ></el-table-column>
                  <el-table-column property="buy_name" label="名称" ></el-table-column>
                  <el-table-column property="sex" label="性别" ></el-table-column>
                  <el-table-column  label="状态" >
                    <template slot-scope="scope">
                      {{ switchStatus(scope.row.status) }}
                    </template>
                  </el-table-column>
                  <el-table-column  property="used_time" label="使用时间" width="200"></el-table-column>
<!--                  <el-table-column   label="操作" width="200"><el-button  ref="ticketUse" @click="ticketUse" :disabled="disabled">使用</el-button></el-table-column>-->

                </el-table >
              </div>
              <div class="card-footer">
                <el-button type="primary" class=" col-4 col-sm-4 col-md-3 col-lg-2 float-right" :disabled="disabled"  @click="ticketUse" >使用</el-button>


              </div>

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
      orderForm: {order_number: ''},//验票输入表单的票号
      orderActivityCheck:[],//当前验票信息
      loading: false,//加载
      disabled:true,

    }
  },
  mounted() {
    this.orderForm.order_number = this.$route.query.order_number
  },
  methods:{

    //6、提交验票
    async ticketCheck(){
      if(this.orderForm.order_number){
        const url=`/orders/${this.orderForm.order_number}/checks`
        const orderActivities=  await this.$http.get(url,{ })
        const orderActivity=orderActivities.data[0]
        this.orderActivityCheck=[]//初始化
        this.orderActivityCheck.push(orderActivity)//将对象转为数组
        if(orderActivity.status!=='payed'){
          this.disabled=true
          this.$message.error("该票不可用")
          return
        }
        this.disabled=false
        console.log(this.orderActivityCheck)
      }
    },
    //7、提交使用票
    async ticketUse(){
      await this.ticketCheck()
      const url=`/orders/${this.orderForm.order_number}/checks/${this.orderActivityCheck[0].id}`
      const orderActivity=  await this.$http.put(url,{ })
      if(orderActivity){this.$message({ message: '该订单已经成功使用',type: 'success'  }); }
      this.orderActivityCheck=[]
      this.orderActivityCheck.push(orderActivity.data)//将对象转为数组
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
