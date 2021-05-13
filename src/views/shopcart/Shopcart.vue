<template>
  <div class="shopCart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ getCartLength }})</div>
    </nav-bar>

    <cart-list/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import cartList from "./childComps/CartList";

import {mapGetters} from 'vuex'

export default {
  name: "ShopCart",
  components: {
    NavBar,
    cartList,
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
