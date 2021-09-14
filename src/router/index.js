import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')
  },
  {
    path: '/main',
    name: 'index',
    component: () => import(/* webpackChunkName: "about" */ '../views/main/index.vue'),
    children: [
      {
        path: 'index',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ `../views/index/index.vue`)
      },
      {
        path: 'brand',
        name: 'brand',
        component: () => import(/* webpackChunkName: "about" */ '../views/brand/index.vue')
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/index.vue')
      },
      {
        path: 'role',
        name: 'role',
        component: () => import(/* webpackChunkName: "about" */ '../views/role/index.vue')
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "about" */ '../views/menu/index.vue')
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import(/* webpackChunkName: "about" */ '../views/schedule/index.vue')
      },
    ]
  },

]

const router = new VueRouter({
  //去除请求路径中的#号
  mode: 'history',
  routes
})
/*导航守卫*/
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  //如果没登录,都导向登录页
  if (!token) {
    //判断是否有token，如果没有token则跳转登录界面
    if (to.path !== '/login') {
      next({ path: '/login' })
    }
    else {
      next();
    }
  }
  else {
    next();
  }
})
/**
 * 跳转登陆页面强制刷新，相当于F5
 */
router.afterEach((to,from)=>{
  if(from.path != '/login' && from.path != '/' && to.path == '/login'){
    window.location.reload();
  }
})
export default router
