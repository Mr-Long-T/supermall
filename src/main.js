import Vue from 'vue'
import App from './App.vue'
import router from "./router"

import store from "@/store/store";
import toast from 'components/common/toast'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()  //Vue实例可以作为事件总线 (可以发送监听事件)
//安装toast插件
Vue.use(toast)

new Vue({
  render: h => h(App),
  router,
  store,
  toast
}).$mount('#app')
