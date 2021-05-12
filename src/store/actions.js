import {
  ADD_COUNT,
  ADD_TO_CART
} from "@/store/mutations-types";

export default {
  addCart(context, payload) {
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
    if (oldProduct) {
      // oldProduct.count += 1
      context.commit(ADD_COUNT, oldProduct)  //注意push的是oldProduct
    } else {
      payload.count = 1
      // context.state.cartList.push(payLoad)
      context.commit(ADD_TO_CART, payload)
    }
  }
}
