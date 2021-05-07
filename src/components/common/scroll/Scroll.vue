<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "scroll",
  props: {
    probeType: {  //每个使用BScroll的监听位置需求不一样
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      scroll: null
    }
  },

  mounted() {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper ,{
      // mouseWheel: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    })
    //2.监听滚动位置
    this.scroll.on('scroll', (position) => {
      // console.log(position)
      //将位置信息传出去
      this.$emit('scroll', position)
    })
    //3.上拉加载更多
    this.scroll.on('pullingUp', () => {
      this.$emit('pullingUp')
    })
  },

  methods: {
    //封装scrollTo方法
    scrollTo(x, y, time=500){
      this.scroll.scrollTo(0, 0, time)
    },

    finishPullUp(){
      this.scroll.finishPullUp()
    }
  }
}
</script>

<style scoped>

</style>
