import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data(){  //data可以混入
    return{
      itemImgListener: null,
    }
  },
  components: {},
  methods:{},
  mounted() { //生命周期可以混入
    let refresh = debounce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
        console.log('图片加载完成');
        refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入里面的内容');
  }
}

import BackTop from "@/components/content/backTop/BackTop";
export const backTopMixIn = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    }
  }
}
