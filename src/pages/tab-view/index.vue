<template>
 <div>
  <m-header></m-header>
  <view class="stv-container">
    <view class="tab-bar">
      <view v-for="(item,index) in tabs" :key="index" :data-index=
      "index" @click="handlerTabTap" class="tab" :class="activeTab === index ? 'tab-active':''" :style="{width:stv.windowWidth/tabs.length + 'px'}">
        <text>{{item}}</text>
      </view>
      <view :style="{width: stv.lineWidth/2 + 'px', left: stv.offset/tabs.length + stv.lineWidth/4 + 'px'}" class="under-line" :class="!stv.tStart? 'withAnimate': ''"></view>
    </view>
    <view class="scroll-view">
      <view class="scroll-view-wrapper" :class="!stv.tStart ? 'withAnimate': ''" :style="{left: '-' + stv.offset + 'px'}">
        <view :style="{width: stv.windowWidth+ 'px'}" class="one-scene">
            <recommend></recommend>
        </view>
        <view :style="{width: stv.windowWidth+ 'px'}" class="one-scene">
            <singer></singer>
        </view>
        <view :style="{width: stv.windowWidth+ 'px'}" class="one-scene">
            <rank></rank>
        </view>
        <view :style="{width: stv.windowWidth+ 'px'}" class="one-scene">
            <search></search>
        </view>
      </view>
    </view>
  </view>
 </div>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer-list/index'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
export default {
  data () {
    return {tabs: ['推荐', '歌手', '排行', '搜索'],
      stv: {
        windowWidth: 0,
        lineWidth: 0,
        offset: 0,
        tStart: false
      },
      activeTab: 0,
      windowWidth: 0,
      tabsCount: 4,
      tapStartTime: 0,
      tapStartX: 0,
      tapStartY: 0,
      startX: 0
    }
  },
  onLoad: function (options) {
    try {
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth
      this.stv.lineWidth = res.windowWidth / this.tabs.length
      this.stv.windowWidth = res.windowWidth
      this.tabsCount = this.tabs.length
    } catch (e) {
    }
  },
  methods: {
    handlerStart (e) {
      let {clientX, clientY} = e.touches[0]
      this.startX = clientX
      this.tapStartX = clientX
      this.tapStartY = clientY
      this.stv.tStart = true
      this.tapStartTime = e.timeStamp
    },
    handlerMove (e) {
      let {clientX} = e.touches[0]
      let offsetX = this.startX - clientX
      this.startX = clientX
      this.stv.offset += offsetX
      if (this.stv.offset <= 0) {
        this.stv.offset = 0
      } else if (this.stv.offset >= this.stv.windowWidth * (this.tabsCount - 1)) {
        this.stv.offset = this.stv.windowWidth * (this.tabsCount - 1)
      }
    },
    handlerCancel (e) {

    },
    handlerEnd (e) {
      let {clientX, clientY} = e.mp.changedTouches[0]
      let endTime = e.timeStamp
      let {offset, windowWidth} = this.stv
      // 快速滑动
      if (endTime - this.tapStartTime <= 300) {
        // 向左
        if (Math.abs(this.tapStartY - clientY) < 50) {
          if (this.tapStartX - clientX > 5) {
            if (this.activeTab < this.tabsCount - 1) {
              this.activeTab++
            }
          } else {
            if (this.activeTab > 0) {
              this.activeTab--
            }
          }
          this.stv.offset = this.stv.windowWidth * this.activeTab
        } else {
          // 快速滑动 但是Y距离大于50 所以用户是左右滚动
          let page = Math.round(offset / windowWidth)
          if (this.activeTab !== page) {
            this.activeTab = page
          }
          this.stv.offset = this.stv.windowWidth * page
        }
      } else {
        let page = Math.round(offset / windowWidth)
        if (this.activeTab !== page) {
          this.activeTab = page
        }
        this.stv.offset = this.stv.windowWidth * page
      }
      this.stv.tStart = false
    },
    _updateSelectedPage (page) {
      this.activeTab = page
      this.stv.offset = this.windowWidth * page
    },
    handlerTabTap (e) {
      this._updateSelectedPage(e.currentTarget.dataset.index)
    }
  },
  components: {
    MHeader,
    Recommend,
    Singer,
    Rank,
    Search
  }
}
</script>
<style lang="stylus">
.stv-container {
  position: fixed;
  width: 100%;
  top: 44px;
  bottom: 0;
}
.withAnimate {
  transition: all 100ms ease;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -ms-perspective: 1000;
  perspective: 1000;
}
.stv-container .tab-bar {
  position: relative;
  display: flex;
  font-size: 30rpx;
  color: #666666;
}
.stv-container .tab-bar .tab-active {
  color: #ffcd32;
}
.stv-container .tab-bar .tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 16rpx;
  padding-bottom: 20rpx;
}
.stv-container .tab-bar .under-line {
  position: absolute;
  bottom: 0;
  height: 2px;
  background-color: #ffcd32;
}
.stv-container .scroll-view {
  position: relative;
  width: 100%;
  height: 100%;
}
.stv-container .scroll-view .scroll-view-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
}
.stv-container .scroll-view .scroll-view-wrapper .one-scene {
  height: 100%;
  box-sizing:border-box;
  padding-bottom:20px;
}
.one-scene text {
  // display: flex;
  // justify-content: center;
  // padding-top: 200rpx;
}
</style>

