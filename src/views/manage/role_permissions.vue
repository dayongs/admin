<template>
  <div class="">
    <div class="" style="display: flex;justify-content: space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/user_roles '}">角色权限</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="text-right">
      <el-button @click="showDialog()" type="primary">添加角色</el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="roles"
        ref="multipleTable"
        style="width: 100%">

      <el-table-column
          prop="id"
          label="id">
      </el-table-column>

      <el-table-column
          prop="name"
          label="角色名称">
      </el-table-column>

      <el-table-column
          prop="description"
          label="描述">
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
          width="200">
        <template slot-scope="scope">
          <el-button @click="showDialog(scope.row,is_edit)" type="text">操作</el-button>
        </template>

      </el-table-column>
    </el-table>


    <!--    添加/修改弹窗-->
    <el-dialog
        :title="is_edit?'修改':'添加'"
        :visible.sync="dialogVisible"
        width="60%">

      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="名称">
          <el-input v-model="form.name" min="1" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" min="1" style="width:200px"></el-input>
        </el-form-item>

        <!-- 权限    -->
        <el-form-item label="选择权限">
          <el-scrollbar>
            <el-checkbox-group v-model="checkedPermissions" class="check-group">
              <el-checkbox v-for="per in allPermission" :key="per.id" :label="per.id" @change="checkList">
                {{ per.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-scrollbar>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-button v-if="is_edit" @click="deleteOpen">删除</el-button>
        </el-row>
        <el-row>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="is_edit" @click="edit">确定</el-button>
          <el-button type="primary" v-else @click="add">添加</el-button>
        </el-row>


      </span>
    </el-dialog>


  </div>
</template>

<script>


export default {
  name: "roles",
  data() {
    return {
      roles: [],//所有角色
      //编辑 添加
      allPermission: [],//全部显示权限

      rolePermissions: [],//固定 角色的 权限

      checkedPermissions: [],//选中后的权限

      is_edit: true,//true 编辑  false 添加

      //角色
      form: {
        name: '',
        description: '',
      },

      rowId: {},//当前角色id
      dialogVisible: false,//显示弹窗
      loading: false,
    }
  },
  created() {
    this.getRoles()
  },
  mounted() { },
  methods: {

    //1、初始 加载角色列表 roles
    async getRoles() {
      this.loading = true
      const url = `/roles`
      const list = await this.$http.get(url, {})
      this.roles = list.data;
      // console.log('查询结果',this.roles);
      this.loading = false
    },


    //2    编辑  添加 显示弹出框
    async showDialog(row, is_edit) {
      //清空历史弹出的内容
      this.rowId = {}
      this.form.name = ''
      this.form.description = ''

      //获取全部权限
      await this.getPermissions()
      // console.log('全部权限', this.allPermission);
      //清空上次的选择
      this.checkedPermissions = [];

      //编辑
      if (row) {
        this.rowId = row.id
        this.form.name = row.name
        this.form.description = row.description
        this.is_edit = true

        //当前的关联的权限
        await this.getRolePermissions(this.rowId)
        //将已经关联的添加到选择范围
        if(this.rolePermissions){
          this.rolePermissions.forEach(val => {
            this.checkedPermissions.push(val.id)
          })
        }
        // console.log('当前的关联的权限', this.rolePermissions);

      } else {
        this.is_edit = false//添加
      }
      this.dialogVisible = true

    },


    //3、固定role 角色 查询权限
    async getRolePermissions() {
      console.log('查询getRolePermissions');
      this.loading = true
      const url = `/roles/${this.rowId}/permissions`
      const list = await this.$http.get(url, {})
      this.rolePermissions = list.data;
      console.log('查询结果', this.rolePermissions);
      this.loading = false

    },

    //4、所有权限
    async getPermissions() {
      this.loading = true
      const url = `/permissions`
      const list = await this.$http.get(url, {})
      this.allPermission = list.data;
      // console.log('查询结果', this.allPermission);
      this.loading = false

    },


    //新增 一个角色和角色的权限
    async add() {
      this.loading = true
      //1新增角色
      const url = `/roles`
      const newRole = await this.$http.post(url, {
        name: this.form.name,
        description: this.form.description
      })
      // console.log('newRole', newRole);
      this.rowId = newRole.data.id

      //2再更加这个角色的权限
      for (let item of this.checkedPermissions) {
        console.log('--', item);
        const roles = await this.postRolePermission(item)
        // console.log(roles);
      }
      this.dialogVisible = false
      this.loading = false
      await this.getRoles()
    },


    //编辑提交
    async edit() {
      //过滤掉 已经该关联的。。

      this.loading = true
      console.log('选择后的权限', this.checkedPermissions);
      for (let item of this.checkedPermissions) {
        console.log('--', item);
        const roles = await this.postRolePermission(item)
        console.log(roles);
      }

      this.dialogVisible = false
      this.loading = false
      // await this.getRolePermissions();
    },

    async postRolePermission(item) {
      const url = `/roles/${this.rowId}/permissions`
      return await this.$http.post(url, {
        permission_id: item
      })
    },


    //4 、删除 角色 以及关联的权限
    async deleteOpen(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRole(this.rowId)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.dialogVisible = false

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //4.1  删除role 角色
    async deleteRole(role_id) {
      this.loading = true
      //删权限
      console.log('删role_permission关联表');
      for (let item of this.rolePermissions) {
        console.log('--', item);
        await this.deleteRolePermission(item.id)
      }
      console.log('删role表');
      const url = '/roles/' +role_id
      const roles = await this.$http.delete(url, {})

      // console.log(roles);
      this.loading = false
     await this.getRoles()
    },
    //4.2 删除关联权限
    async deleteRolePermission(permission_id) {
      const url = `/roles/${this.rowId}/permissions/${permission_id}`
      const roles = await this.$http.delete(url, {})
      console.log(roles);
    },



    //弹窗选择权限
    checkList() {
      console.log(this.checkedPermissions);
    },


  }//methods end

}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
}

.check-group {
  display: flex;
  flex-direction: column
}
</style>
