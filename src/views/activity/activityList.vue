<template>
  <div class="app-container">
    <!--  面包屑  -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/activity_list' }">活动管理</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 条件查询   -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form   label-width="80px">
          <el-form-item label="标题搜索">
            <el-input :span="6"
                      placeholder="请输入标题"
                      @change="getActivities"
                      v-model="keyword"
                      clearable>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
        border
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
      <!-- 箭头 展开活动详情-->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="标题:">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="海   报:">
<!--              <span><img :src="domain + props.row.poster " fit="contain" alt="" style="width:50px;"/> </span>-->
              <span><img :src="props.row.poster_url " fit="contain" alt="" style="width:50px;"/> </span>
            </el-form-item>
            <el-form-item label="费   用:">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="人   数:">
              <span>{{ props.row.plan_num }}</span>
            </el-form-item>
            <el-form-item label="城   市:">
              <span>{{ props.row.full_address }}</span>
            </el-form-item>
            <el-form-item label="现场匹配:">
              <span>{{ props.row.is_pair? '支持':"不" }}</span>
            </el-form-item>
            <el-form-item label="活动时间:">
              <span>{{ props.row.start_at +'～ '+ props.row.end_at}}</span>
            </el-form-item>
            <el-form-item label="展示时间:">
              <span>{{ props.row.show_start_at +'～ '+ props.row.show_end_at}}</span>
            </el-form-item>
            <el-form-item label="截止时间:">
              <span>{{ props.row.apply_start_at +'～ '+ props.row.apply_end_at }}</span>
            </el-form-item>
            <el-form-item label="联系方式:">
              <span>{{ props.row.contact }}</span>
            </el-form-item>
            <el-form-item label="简   介:">
              <span>{{ props.row.summary }}</span>
            </el-form-item>
            <el-form-item label="活动内容:" :span="20">
              <span v-html="props.row.content"></span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
<!--列表-->
      <el-table-column
          prop="id"
          label="id"
          width="50">
      </el-table-column>
      <el-table-column
          prop="poster"
          width="70">
        <template slot-scope="scope" class="block" >
          <img :src="scope.row.poster_url"  fit="contain" alt="" style="width: 50px;">
        </template>
      </el-table-column>
      <el-table-column
          prop="title"
          label="标题"
          width="280">
      </el-table-column>
      <el-table-column
          prop="full_address"
          label="地址"
          width="280">
      </el-table-column>
      <el-table-column
          prop="range_time"
          label="起止时间"
          width="200">
      </el-table-column>
      <el-table-column
          label="线下活动"
          width="100">
        <template slot-scope="scope" >
          {{scope.row.is_pair?'支持':''}}
        </template>
      </el-table-column>

      <el-table-column
          prop="price"
          label="票价"
          width="100" >
      </el-table-column>
      <el-table-column
          prop="summary"
          label="摘要"
          width="100" >
      </el-table-column>
      <el-table-column
          prop="plan_num"
          label="人数"
          width="100" >
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope" >
<!--          <el-button @click="handleClickRead(scope.row)" type="text" >查看</el-button>-->
          <el-button  @click="handleClickEdit(scope.row)"  type="text" >编辑</el-button>
          <el-dropdown   size="small" @command="handleClickDropdown">
            <span class="el-dropdown-link" size="small" > 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown"  >
              <el-dropdown-item  :command="[scope.row,1]" >删除</el-dropdown-item>
              <el-dropdown-item :command="[scope.row,2]" >订单</el-dropdown-item>
              <el-dropdown-item :command="[scope.row,3]" >查票</el-dropdown-item>
              <el-dropdown-item :command="[scope.row,4]" >报名人员</el-dropdown-item>
              <el-dropdown-item :command="[scope.row,5]">现场匹配</el-dropdown-item>

              <!-- <el-dropdown-item command="b">狮子头</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </el-table>
    <!--查看订单-->
    <el-dialog title="活动订单" :visible.sync="dialogTableVisible">
      <el-table :data="orderActivitiesData">
        <el-table-column property="buy_name" label="姓名" width="100"></el-table-column>
        <el-table-column property="sex" label="性别" width="100"></el-table-column>
        <el-table-column property="user_uuid" label="UUID" width="100"></el-table-column>
        <el-table-column property="buy_phone" label="电话" width="120"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ switchStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column  property="used_time" label="使用时间" width="200"></el-table-column>

      </el-table>
    </el-dialog>

    <!-- 验票 -->
    <el-dialog title="验票" :visible.sync="dialogFormVisible">
      <el-form :model="orderForm" label-width="80px">
        <el-form-item label="票单号" >
          <el-col :span="11">
            <el-input  :span="11" v-model="orderForm.order_number" autocomplete="off"></el-input>
          </el-col>
          <el-button type="primary" @click="ticketCheck">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="orderActivityCheck">
        <el-table-column property="title" label="活动标题" width="120"></el-table-column>
        <el-table-column property="buy_phone" label="电话" width="120"></el-table-column>
        <el-table-column property="buy_name" label="名称" width="100"></el-table-column>
        <el-table-column property="sex" label="性别" width="100"></el-table-column>
        <el-table-column  label="状态" width="100">
          <template slot-scope="scope">
            {{ switchStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column  property="used_time" label="使用时间" width="200"></el-table-column>
        <el-table-column   label="操作" width="200"><el-button  ref="ticketUse" @click="ticketUse" :disabled="disabled">使用</el-button></el-table-column>

      </el-table >
      <div slot="footer" class="dialog-footer">

      </div>
    </el-dialog>

<!--    分页-->
    <template>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[50, 100, 150, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </template>
  </div>

</template>

<script>
export default {
  name: "Activity",
  data() {
    return {

      tableData: [],//所有活动数据
      pageSize:50,//每页显示5条
      pageNum:1,//当前显示第1页
      total:0,//总页数
      keyword:'',//搜索关键词

      addDialogVisible:false,//是否显示cd /mnt/docker/project/

      loading: false,//加载

      //订单相关
      formLabelWidth:'120px',
      dialogTableVisible: false,
      dialogFormVisible: false,
      disabled:true,
      orderActivitiesData: [],//该活动的所以的订单详情
      orderForm: {order_number: ''},//验票输入表单的票号

      orderActivityCheck:[],//当前验票信息
      activity:[],//当前选择的活动对象
    }
  },
  created() {
    this.getActivities()

  },
  mounted() {
  },
  methods:{



    //1、活动列表
    async getActivities(){
      this.loading=true
      const url='/activities'
      const activities= await this.$http.get(url,{
        params:{
          pageSize:this.pageSize,//每页显示5条
          pageNum:this.pageNum,//当前显示第1页
          keyword:this.keyword,//搜索
        }
      })

      this.loading=false
      this.tableData=activities.data
      // console.log('222',this.tableData);
      // this.total=this.tableData.length
    },





    //2、  编辑活动
    handleClickEdit(row) {
      // console.log(row);
      this.$router.push({
        // path: `/edit_activity/${row.id}`,
        path:"/edit_activity",
        query:{id:row.id}
      })
    },

    //下拉菜单
    async handleClickDropdown(row){
      if(row[1]===1){//3  删除活动
        const url='/activities/'+row[0].order_nuber
        await this.$http.put(url,{
          is_deleted:1
        })
        this.$message({ message: '已删除',  type: 'success' });
        this.getActivities()
      }
      if(row[1]===2){//4、查看订单
        const url='/order_activities?activity_id='+row[0].id
        const order_activities=  await this.$http.get(url,{ })
        this.orderActivitiesData=order_activities.data
        this.dialogTableVisible = true
      }
      if(row[1]===4){//5、报名人员
        await this.$router.push({
          path:"/join_activity",
          query:{id:row[0].id}
        })
      }
      if(row[1]===3){//6、打开验票对话框
        this.dialogFormVisible = true
        this.activity=row[0]
        this.orderActivityCheck=[]//初始化
        this.orderForm={}
      }
      if(row[1]===5){//7、进入现场匹配

      }
    },

    //6、提交验票
    async ticketCheck(){
      if(this.orderForm.order_number){
        const url=`/orders/${this.orderForm.order_number}/checks`
        const orderActivities=  await this.$http.get(url,{ })
        const orderActivity=orderActivities.data[0]
        this.orderActivityCheck=[]//初始化
        this.orderActivityCheck.push(orderActivity)//将对象转为数组
        if(this.activity.id!==orderActivity.activity_id || orderActivity.status!=='payed'){
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
      // orders.activities.checks POST
      const url=`/orders/${this.orderForm.order_number}/checks/${this.orderActivityCheck[0].id}`
      const orderActivity=  await this.$http.put(url,{ })
      if(orderActivity){this.$message({ message: '该订单已经成功使用',type: 'success'  }); }
      this.orderActivityCheck=[]
      this.orderActivityCheck.push(orderActivity.data)//将对象转为数组
    },




    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize=val
      this.getActivities()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum=val
      this.getActivities()
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


<style scoped  >


/*  内部展开样式*/
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px ;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

.el-dropdown-link{
  /*font-size: smaller;*/
}

</style>
