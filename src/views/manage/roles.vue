<template>
  <div class="">
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/users_list '}">角色</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button @click="showDialog()" type="primary" >添加</el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="listData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          type="selection"
          show-overflow-tooltip >
      </el-table-column>
      <el-table-column
          prop="id"
          label="id">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述">
      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope" >
          <el-button @click="showDialog(scope.row,is_edit)" type="text" >编辑</el-button>
          <el-button @click="deleteOpen(scope.row)" type="text" >删除</el-button>
        </template>

      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>

<!--    修改编号弹窗-->
    <el-dialog
        :title="is_edit?'修改':'添加'"
        :visible.sync="dialogVisible"
        width="30%" >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"  min="1" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"  min="1" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="is_edit" @click="editOnSubmit">确定</el-button>
        <el-button type="primary" v-else @click="add">添加</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
// import numeral from 'numeral';
export default {
name: "roles",
  data(){
    return{
      listData: [],
      form: {
        name: '',
        description:'',
      },
      is_edit:true,

      multipleSelection: [],//选中的
      rowId:{},
      dialogVisible: false,
      loading:false,

    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods:{
    //1、查询用户
    async getList(){
      this.loading=true
      const url=`/roles`
      const list= await this.$http.get(url,{})
      this.listData=list.data;
      console.log('查询结果',this.listData);
      this.loading=false
      // return this.rolesTableData
    },

    //6显示弹出框
    showDialog(row,is_edit){
      this.rowId={}//清空历史弹出的内容
      this.form.name=''
      this.form.description=''
      if(row){
        this.rowId=row.id
        this.form.name=row.name
        this.form.description=row.description
       this.is_edit=true
      }else {
        this.is_edit=false
      }
      this.dialogVisible = true

    },

    //编辑提交
    async editOnSubmit(){
      this.loading=true
      const url='/roles/'+this.rowId
      const roles= await this.$http.put(url,{
        name:this.form.name,
        description:this.form.description
      })
      this.dialogVisible=false
      this.loading=false
      await this.getList();
      console.log(roles);
    },

    //添加
    async add(){
      this.loading=true
      const url='/roles/'
      const roles= await this.$http.post(url,{
        name:this.form.name,
        description:this.form.description
      })
      this.dialogVisible=false
      this.loading=false
      await this.getList();
      console.log(roles);
    },



    //删除
    async deleteOpen(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    async deleteRole(row){
      this.loading=true
      const url='/roles/'+row.id
      const roles= await this.$http.delete(url,{ })
      this.loading=false
      await this.getList();
      console.log(roles);
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






    //转换订单状态
    switchStatus(status){
      switch(status){
        case 1:return '系统管理员';
        case 2: return '商家' ;
        case 3: return '普通用户' ;
        default:return '未知';
      }
    },



  }//methods end

}
</script>

<style scoped >


</style>
