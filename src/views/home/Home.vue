<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control :titles="['流行','新款','精选']"
                 class="tab-control"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabFixed"/>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <home-feature-view/>

      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2" />
      <good-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

import HomeSwiper from "./childComps/HomeSwiper";
import HomeRecommendView from "./childComps/HomeRecommendView";
import HomeFeatureView from "./childComps/HomeFeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";

import {getHomeMultidata, getHomeGoods} from "network/home";
import {debounce} from "@/common/utils";
import {itemListenerMixin} from "@/common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,

    NavBar,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      // itemImgListener: null,
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  destroyed() {  //组件销毁时 <keep-alive>可以保持不被销毁
  },
  activated() {  //进入组件，跳到离开前的位置
    // 回来的时候最好刷新一次，否则会出现滚动到顶部的情况
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated() {
    //1.离开组件时，记录位置
    this.saveY = this.$refs.scroll.getScrollY()

    //2.取消对全局事件的监听(后面封装在混入里)
    // this.$bus.$off('itemImageLoad', this.itemImgListener)
  },

  //组件创建好了，就赶紧发送网络请求
  created() {
    //1.请求多个数据
    this.getHomeMultidata()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {//重复代码 --->>>使用混入
    //这个地方img标签确实被挂载，但是图片还没占据高度
    //防抖 refresh调用太频繁(将refresh函数传入到debounce函数中，生成一个新的函数)
    // const refresh = debounce(this.$refs.scroll.refresh, 100)

    //1.监听item中图片加载完成
    //对监听的事件进行保存(是为了在离开组件时候 取消对图片加载完成的监听)
    // this.itemImgListener = () => {refresh()}
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  methods: {
    /**
     * 事件监听相关方法
     *
     */

    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
      }
      //tabControl1与tabControl2中选中要最新点击保持一致
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      //1.BackTop是否显示
      this.isShowBackTop = (-position.y) > 700

      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
      // this.$refs.scroll.refresh()
    },
    swiperImageLoad(){
      //.获取tabControl2的offsetTop
      //所有组件都有一个属性$el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /**
     * 网络请求相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1  //需要取出下一页的数据
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        //取出res中的data并保存在list中
        this.goods[type].list.push(...res.data.list)
        //页码需要加一
        this.goods[type].page++

        //完成一次上拉加载后必须主动调用一次finishPullUp方法,才能进行下一次
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);

  /*在使用浏览器原生滚动时，为了让导航条不跟随一起滚动，在局部滚动范围确定 下面的属性就不需要了*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.tab-control {
  /*position: sticky;*/
  /*top: 44px;*/
  /*z-index: 9;*/

  position: relative;
  z-index: 9;
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/*.fixed {*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 44px;*/
/*}*/
/*.content{*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/

</style>
