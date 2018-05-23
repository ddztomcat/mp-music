<template>
  <scroll-view scroll-y class="suggest-list" @scrolltolower="searchMore">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="item.type ? 'icon-mine' : 'icon-music'"></i>
        </div>
        <div class="name">
          <temp-text :answer='item'></temp-text>
        </div>
      </li>
      <loading v-if="hasMore" title=""></loading>
      <div v-if="!hasMore && !result.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
  </scroll-view>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  // import NoResult from 'base/no-result/no-result'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import TempText from 'components/temp-text/index'
  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods: {
      refresh () {
        this.$refs.suggest.refresh()
      },
      search () {
        this.page = 1
        this.hasMore = true
        // this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            // console.log(this.result)
            this._checkMore(res.data)
          }
        })
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      listScroll () {
        this.$emit('listScroll')
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          wx.navigateTo({
            url: '/pages/singer-detail/main'
          })
          this.setSinger(singer)
        } else {
          // item.image = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000002xoonH2Bk7FR.jpg'
          // item.url = 'http://dl.stream.qqmusic.qq.com/C400001iX6se3K1BIM.m4a?guid=5188143135&vkey=EAA73300B84089836C679D5DCAAEC1CC448D9AAA97A6D8B03C2259F9DDFFF0FA4F0CC9F7CAA6EBCC1509ECB603D8A5F9F6013EE57A3F944E&uin=0&fromtag=38'
          this.insertSong(item)
          wx.navigateTo({
            url: '/pages/player/main'
          })
        }
        console.log(1)
        this.$emit('select', item)
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query (newQuery) {
        console.log(6)
        this.search(newQuery)
      }
    },
    components: {
      TempText,
      Loading
      // NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

    .suggest-list
      width:100%
      height: 100%
      padding: 0 30px 30px 30px
      box-sizing :border-box
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
      .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>