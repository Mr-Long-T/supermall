import Vue from 'vue'
import Vuex from "vuex";

import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from "@/store/getters";

//1.使用插件
Vue.use(Vuex)

//2.创建Store对象
const state = {
  // cartList: [商品1，商品2，商品3]
  cartList: []
}
const store = new Vuex.Store({
  state,
  mutations,  //mutations唯一的目的就是修改state中状态
  //mutations中的每个方法尽可能完成的事件比较单一 （此处做了count=+1 或count=1）
  actions,
  getters,
})

//3.挂载Vue实例上
export default store
