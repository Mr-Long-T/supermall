module.exports = {
  configureWebpack: {
    resolve: {
      extensions: [],
      alias: {
        // '@': 'src', //脚手架内部已经配置过
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}
