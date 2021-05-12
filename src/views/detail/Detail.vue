<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="scrPosition">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";
import {itemListenerMixin, backTopMixIn} from "@/common/mixin";

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex: 0,
    }
  },
  mixins: [itemListenerMixin, backTopMixIn],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()

      //调用太频繁，需要防抖
      // this.themeTopYs = []
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44)
      this.getThemeTopYs()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index])
    },
    scrPosition(position) {
      //根据滚动位置,赋值currentIndex
      const positionY = -position.y

      let length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i
          && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
            || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.detailNav.currentIndex = this.currentIndex
        }
      }

      //BackTop是否显示
      this.isShowBackTop = (-position.y) > 700
    },
    addToCart(){
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //将商品添加到购物车里面
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product) //Actions
    }
  },
  created() {
    //1.保存传入的iid
    this.iid = this.$route.params.iid

    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result
      //1.获取顶部图片轮播数据
      this.topImages = data.itemInfo.topImages

      //2.获取商品信息(通过一个类将复杂数据整合到一起)
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      //3.获取商家信息(同上)
      this.shop = new Shop(data.shopInfo)

      //4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      //5.获取商品参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //6.取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      //1.在这个位置this.$refs.comment.$el压根没有渲染

      this.$nextTick(() => { //2.根据最新的数据，对应的dom是已经被渲染出来
        //但是图片依然是没有加载完的（目前获取的offsetTop不包含其中获取的图片）
        // this.themeTopYs = []
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44)
      })
    })

    //3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    //4.给getThemeTopYs赋值
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44)
      // console.log(this.themeTopYs);
    })
  },
  mounted() {
  },
  updated() { //会多次更新 取出offsetTop的值依然不对
    // this.themeTopYs = []  //再次更新时，清空themeTopYs里面保存的offsetTop
    //
    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
  },
  destroyed() {
    this.$bus.$off('ItemImageLoad', this.itemImgListener)
  },
  deactivated() {//取消了缓存
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  background-color: #fff;
  z-index: 9;
}

.content {
  height: calc(100% - 102px);
  overflow: hidden;
}
</style>
