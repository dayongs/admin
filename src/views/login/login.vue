<template>
  <!--在 public>index.html引入 bootstrap css -->
  <div class="container">
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-5 m-auto pt-5">
        <div class="card">
          <div class="card-header text-center">登陆</div>
          <div class="card-body">
            <el-form :model="form" v-loading="loading">
              <el-form-item>
                <el-input v-model="form.username" autocomplete="off" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.password" size="medium" placeholder="密码" type="password"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="w-100" type="primary" @click="login()">登陆</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: 'admin',
        password: '111111',

      },
      avatar: '',//头像
      nickname: '',//昵称
      user: {},
      token: '',
      uuid: '',
      loading: false
    }
  },
  methods: {

    async login() {
      // const user = JSON.parse(window.sessionStorage.getItem('user'))
      //登陆
      this.loading = true
      const url = '/passport/jwt/authorize'
      await this.$http.post(url, {
        identity: this.form.username.trim(),
        credential: this.form.password,
        identity_type: 'phone'
      }).then(res => {
        // console.log(res.data)
        //存储 token 和 user
        this.uuid = res.data.user_uuid
        window.sessionStorage.setItem('token', res.data.access_token)
        this.token = window.sessionStorage.getItem('token')
        // console.log('token', this.token)
        //获取个人信息
        this.getUser()

      }).catch(error => {
        this.loading = false
        this.$message.error('用户名或密码错误')
        return
      })

      //如果有个人信息，返回原来页面
      // this.$router.go(-1);
      // return
    },

    //获取个人信息
   async getUser(){
      const user =await  this.$http.get(`/users/${this.uuid}`, {
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token,
        }
      })
     console.log(user);
     //存储 user
     window.sessionStorage.setItem('user', JSON.stringify(user.data))
     this.loading = false
     //返回原来页面
     this.$router.go(-1);
     return
    }
  }
}
</script>

<style scoped>

</style>
