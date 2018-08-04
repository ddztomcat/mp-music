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
    pages: ['pages/singer-list/main', 'pages/rank/main', 'pages/search/main', '^pages/recommend/main', 'pages/top-list/main', 'pages/disc/main', 'pages/logs/main', 'pages/tab-view/main', 'pages/player/main', 'pages/user-center/main', 'pages/singer-detail/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#222',
      navigationBarTitleText: '微音乐',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      'backgroundColor': '#222',
      'color': '#666',
      borderStyle: 'white',
      selectedColor: '#ffcd32',
      'list': [
        {
          'pagePath': 'pages/recommend/main',
          'text': '推荐',
          'iconPath': 'static/images/home.png',
          'selectedIconPath': 'static/images/home-y.png'
        }, {
          'pagePath': 'pages/search/main',
          'text': '搜索',
          'iconPath': 'static/images/search.png',
          'selectedIconPath': 'static/images/search-y.png'
        }, {
          'pagePath': 'pages/singer-list/main',
          'text': '歌手',
          'iconPath': 'static/images/singer.png',
          'selectedIconPath': 'static/images/singer-y.png'
        }, {
          'pagePath': 'pages/rank/main',
          'text': '排行',
          'iconPath': 'static/images/rank.png',
          'selectedIconPath': 'static/images/rank-y.png'
        }, {
          'pagePath': 'pages/user-center/main',
          'text': '我的',
          'iconPath': 'static/images/user.png',
          'selectedIconPath': 'static/images/user-y.png'
        }
      ]
    }
  }
}
