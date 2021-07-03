<template>
  <div class="">
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/user_roles '}">用户</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button @click="showDialog()" type="primary">添加管理用户</el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="listData"
        ref="multipleTable"
        router
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          type="selection"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="id"
          label="id">

      </el-table-column>


      <el-table-column
          prop="user_uuid"
          label="用户">
        <template slot-scope="scope">
          <router-link :to="'/user_detail?uuid='+scope.row.user_uuid">{{ scope.row.user_uuid }}</router-link>
          <!--          <el-link  href="#/user_detail?uuid="+scope.row.user_uuid type="primary" >{{scope.row.user_uuid}}</el-link>-->
        </template>
      </el-table-column>

      <el-table-column
          prop="role_id"
          label="角色">
        <template slot-scope="scope">
          {{showRole(scope.row.role_id)}}
        </template>
      </el-table-column>


      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
<!--          <el-button @click="showDialog(scope.row,is_edit)" type="text">编辑</el-button>-->
          <el-button @click="deleteOpen(scope.row)" type="text">删除</el-button>
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
        width="60%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户UUID">
          <el-input v-model="form.user_uuid" min="1" type="number" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.selectValue" placeholder="请选择">
            <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="is_edit" @click="edit">确定</el-button>
        <el-button type="primary" v-else @click="add">添加</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
// import numeral from 'numeral';
export default {
  name: "roles",
  data() {
    return {
      listData: [],
      form: {
        user_uuid: '',
        selectValue:'',//选择的角色值
      },
      roles:[],//所有角色

      is_edit: true,

      multipleSelection: [],//选中的
      rowId: {},
      dialogVisible: false,
      loading: false,

    }
  },
  created() {

  },
  mounted() {
    this.getList()
    this.getRoles()
  },
  onLoad(){

  },
  methods: {
    //1、查询用户
    async getList() {
      this.loading = true
      const url = `/user_roles`
      const list = await this.$http.get(url, {})
      this.listData = list.data;
      console.log('用户关联角色', this.listData);
      this.loading = false
      // return this.rolesTableData
    },

    showRole(user_role_id){
      for(let role of this.roles){// this.roles.forEach(role=>{ 无效
        if(user_role_id===role.id){
              return  role.name
            }
      }
    },


    //6显示弹出框
   async showDialog(row, is_edit) {
      this.rowId = {}//清空历史弹出的内容
      this.form.user_uuid =''
      this.form.selectValue =''
     // await this.getRoles()
      if (row) {
        this.rowId = row.id
        this.form.name = row.name
        this.form.description = row.description
        this.is_edit = true
      } else {
        this.is_edit = false
      }
      this.dialogVisible = true

    },


    //1、初始 加载角色列表 roles
    async getRoles() {
      this.loading = true
      const url = `/roles`
      const list = await this.$http.get(url, {})
      this.roles = list.data;
      console.log('角色',this.roles);
      this.loading = false
    },

    //编辑提交
    async edit() {
      this.loading = true
      const url = '/roles/' + this.rowId
      const roles = await this.$http.put(url, {
        name: this.form.name,
        description: this.form.description
      })
      this.dialogVisible = false
      this.loading = false
      await this.getList();
      console.log(roles);
    },

    //添加
    async add() {
      this.loading = true
      const url = `/users/${this.form.user_uuid}/roles`
      await this.$http.post(url, {
        role_id:this.form.selectValue
      }).then(role=>{
        console.log(role);
        this.dialogVisible = false

        this.getList();
      }).catch(error=>{
        this.$message({
          type: 'ifo',
          message: error.response.data.message
        });
        return
      })
      this.loading = false

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

    async deleteRole(row) {
      this.loading = true
      const url = `/user_roles/${row.id}`
      const roles = await this.$http.delete(url, {})
      this.loading = false
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
    switchStatus(status) {
      switch (status) {
        case 1:
          return '系统管理员';
        case 2:
          return '商家';
        case 3:
          return '普通用户';
        default:
          return '未知';
      }
    },


  }//methods end

}
</script>

<style scoped>


</style>
