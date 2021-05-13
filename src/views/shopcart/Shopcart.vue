<template>
  <div class="shopCart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ getCartLength }})</div>
    </nav-bar>
    <cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartBottomBar from "@/views/shopcart/childComps/CartBottomBar";

import {mapGetters} from 'vuex'

export default {
  name: "ShopCart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    //两种语法
    ...mapGetters(['getCartLength'])

    // ...mapGetters({
    //   length: 'getCartLength',
    // })
  }
}
</script>

<style scoped>
.shopCart {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
