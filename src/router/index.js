import Vue from 'vue'
import VueRouter from "vue-router";

//1.使用插件
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('views/home/Home')
  },
  {
    path: '/category',
    component: () => import('views/category/Category')
  },
  {
    path: '/shopcart',
    component: () => import('views/shopcart/Shopcart')
  },
  {
    path: '/profile',
    component: () => import('views/profile/Profile')
  },
  {
    path: '/detail',
    component: () => import('views/detail/Detail')
  },
]

export default new VueRouter({
  routes,
  mode: 'history'
})
