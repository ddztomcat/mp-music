import Vue from 'vue'
import App from './rank'

const app = new Vue(App)
app.$mount()
export default {
  config: {
    enablePullDownRefresh: true,
    'backgroundTextStyle': 'dark'
  }
}
