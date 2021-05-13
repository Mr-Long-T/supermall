<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList"
                      :key="index"
                      :itemInfo="item"/>
    </scroll>
  </div>
</template>

<script>
import cartListItem from "@/views/shopcart/childComps/CartListItem";
import Scroll from "@/components/common/scroll/Scroll";

import {mapGetters} from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    cartListItem,
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {  //添加到购物车后，需要刷新可滚动区域
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px)
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>
