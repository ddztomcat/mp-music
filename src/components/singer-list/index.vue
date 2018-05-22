<template>
<div class="singer">
    <scroll-view scroll-y :style="{height: '100%'}" :scroll-into-view="alpha">
        <view class="alphabet">
            <view class="alphabet-list">
                <view v-for="(item,index) in list" :key="index" :id="item.alphabet" class="section-item">
                    <view class="section-item-header">
                        {{item.alphabet}}
                    </view>
                    <view v-for="(cell,cellIndex) in item.datas" :key="cellIndex"  class="section-item-cells" @click="selectSinger(cell)">
                        <view class="section-item-cell" >
                            <img class="avatar" :src="cell.avatar"/>
                            <span class="name">{{cell.name}}</span>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
    <view data-id="selector" @touchstart="handlerAlphaTap" @touchmove="handlerMove" class="alphanet-selector">
        <view :data-ap="item.alphabet" v-for="(item,index) in list" :key="index" class="selector-one" :class="alpha === item.alphabet ? 'selected': ''">
            {{item.alphabet}}
        </view>
    </view>
</div>
</template>
<script>
import {mapMutations} from 'vuex'
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
  data () {
    return {
      list: [],
      alpha: 'Top',
      windowHeight: '',
      apHeight: 0,
      offsetTop: 0
    }
  },
  onLoad (options) {
    try {
      var res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio
      // this.apHeight = 32 / this.pixelRatio;
      // this.offsetTop = 160 / this.pixelRatio;
      this.apHeight = 16
      this.offsetTop = 80
      this.windowHeight = res.windowHeight + 'px'
    } catch (e) {

    }
  },
  mounted () {
    getSingerList()
    .then((res) => {
      if (res.code === ERR_OK) {
        this.list = this._normalizeSinger(res.data.list)
        // console.log(this.list)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  },
  methods: {
    selectSinger (singer) {
      this.setSinger(singer)
      wx.navigateTo({
        url: '/pages/singer-detail/main'
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          alphabet: HOT_NAME,
          datas: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.datas.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            alphabet: key,
            datas: []
          }
        }
        map[key].datas.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
        // 为了得到有序列表，我们需要处理 map
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.alphabet.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.alphabet === HOT_NAME) {
          val.alphabet = 'Top'
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.alphabet.charCodeAt(0) - b.alphabet.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    handlerAlphaTap (e) {
      let {ap} = e.target.dataset
      this.alpha = ap
    },
    handlerMove (e) {
      let moveY = e.touches[0].clientY
      let rY = moveY - this.offsetTop
      if (rY >= 0) {
        let index = Math.ceil((rY - this.apHeight) / this.apHeight)
        if (index >= 0 < this.list.length) {
          let nonwAp = this.list[index]
          if (nonwAp) {
            this.alpha = nonwAp.alphabet
          }
        }
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"

.singer {
  position:relative;
  height:100%;
}
.alphabet{
    height:100%;
}

.alphabet-list {

}
.alphabet-list .section-item {
    padding-bottom: 30px
}
.alphabet-list .section-item .section-item-header {
    display: flex;
    align-items: center;
    height: 30px
    line-height: 30px
    padding-left: 20px
    font-size: $font-size-small
    color: $color-text-l
    background: $color-highlight-background
}

.alphabet-list .section-item .section-item-cells {
//   padding-bottom: 30px
//   padding-left: 20rpx;
}
.alphabet-list .section-item .section-item-cells .section-item-cell{
    display: flex
    align-items: center
    padding: 20px 0 0 30px
    .avatar{
        width: 50px
        height: 50px
        border-radius: 50%
    }
    .name{
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
    }
}
.border-bottom {
  border-bottom: 1rpx solid #dbdbdb;
}
.alphanet-selector {
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
//   position: absolute;
//   top: 80px;
//   right: 0;
//   height: 432px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   z-index: 100;
//   box-sizing: border-box;
    .selector-one {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: $color-text-l;
    padding: 3px 3px;
    height: 12px;
    }
    .selected{
        color:$color-theme
    }
}

</style>


