<template>
  <scroll-view class="rank" scroll-y>
    <div class="toplist">
        <li @click="selectItem(item)" class="item" v-for="(item,index) in topList" :key="index">
          <div class="icon">
            <img :src="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,ind) in item.songList" :key="ind">
              <span>{{ind + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      <!-- <div class="loading-container" v-if="!topList.length">
        <loading></loading>
      </div> -->
    </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  // import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    // mixins: [playlistMixin],
    onLoad () {
      this._getTopList()
    },
    data () {
      return {
        topList: []
      }
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selectItem (item) {
        this.setTopList(item)
        wx.navigateTo({
          url: '/pages/top-list/main'
        })
      },
      _getTopList () {
        getTopList().then((res) => {
          // console.log(res)
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    watch: {
      topList () {
        // setTimeout(() => {
        //   this.$Lazyload.lazyLoadHandler()
        // }, 20)
      }
    },
    components: {
      // Scroll,
      // Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    // position: fixed
    height: 100%
    // top: 88px
    // bottom: 0
    .toplist
      height: 100%
      // overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
          img
            width:100%
            height:100%
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>