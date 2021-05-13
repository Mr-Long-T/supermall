import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from "@/store/store";
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

//添加事件总线
Vue.prototype.$bus = new Vue()  //Vue实例可以作为事件总线 (可以发送监听事件)
//安装toast插件
Vue.use(toast)
//解决移动端300ms延迟
FastClick.attach(document.body)
//使用懒加载插件 Vue.use(VueLazyLoad, 占位图)
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})


new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
