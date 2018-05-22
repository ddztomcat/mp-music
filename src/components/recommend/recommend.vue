<template>
    <scroll-view scroll-y class="recommend">
      <div class="recommend-content" >
          <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" >
              <block v-for="(item,index) in recommends" :key="index">
                <swiper-item>
                  <image :src="item.picUrl" class="slide-image"/>
                </swiper-item>
              </block>
          </swiper>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <!-- <scroll-view scroll-y style="height: 200px;" :scrolltoupper="upper" :scrolltolower="lower" :scroll="scroll"> -->
              <view @click="selectItem(item)" v-for="(item,index) in discList" :key="index" class="item">
                <div class="icon">
                  <img :src="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </view>
            <!-- </scroll-view> -->
          </div>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <!-- <loading></loading> -->
      </div>
    </scroll-view>
</template>

<script type="text/ecmascript-6">
// import Loading from 'base/loading/loading'
// import { getDiscList} from 'api/recommend';
// import {playlistMixin} from 'common/js/mixin'
import {ERR_OK} from 'api/config'
import { mapMutations } from 'vuex'
import { getDiscList, getRecommend } from 'api/recom'

export default {
  data () {
    return {
      recommends: [],
      discList: [],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000
    }
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    loadImage () {
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    selectItem (item) {
      console.log(item)
      this.setDisc(item)
      wx.navigateTo({
        url: '/pages/disc/main'
      })
    },
    _getRecommend () {
      getRecommend()
      .then(res => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    _getDiscList () {
      getDiscList()
      .then((res) => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    // Loading,
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  // position: fixed;
  width: 100%;
  height:100%;
  // top: 88px;
  // bottom: 0;

  .recommend-content {
    height: 100%;
    // overflow: hidden;

    .slide-image {
      width: 100%;
      height: 100%;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
          img {
            width:60px;
            height:60px;
          }
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>