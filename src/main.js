import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/top-list/main', 'pages/disc/main', 'pages/logs/main', '^pages/tab-view/main', 'pages/player/main', 'pages/user-center/main', 'pages/singer-detail/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#222',
      navigationBarTitleText: '音乐盒',
      navigationBarTextStyle: 'white'
    }
  }
}
