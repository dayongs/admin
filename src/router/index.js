import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../common/config/router'

Vue.use(VueRouter)

const router = new VueRouter({  routes })
//前置守卫，判断是否登陆
router.beforeEach((to,from,next)=>{
  const token=window.sessionStorage.getItem('token')
  if(to.path==='/' && token) return  next('/dashboard');
  if(to.path==='/login') return  next();
  if(!token){
    return next('/login');
  }

  next();
})

export default router
