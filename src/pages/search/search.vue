<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-if="!query">
      <scroll-view scroll-y class="shortcut">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-if="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
      </scroll-view>
    </div>
    <div class="search-result"  ref="searchResult" :style="{display:query ? 'block' : 'none'}">
      <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'

  export default {
    mixins: [searchMixin],
    data () {
      return {
        hotKey: []
      }
    },
    computed: {
      shortcut () {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      showConfirm () {
        this.$refs.confirm.show()
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'clearSearchHistory',
        'saveSearchHistory'
      ])
    },
    watch: {
      query (newQuery) {
        console.log(newQuery)
        if (newQuery) {
          this.saveSearchHistory(newQuery)
        }
        // console.log(this.$refs.suggest)
        // console.log(34435435)
        // if (!newQuery) {
        //   setTimeout(() => {
        //     this.$refs.shortcut.refresh()
        //   }, 20)
        // }
      }
    },
    components: {
      SearchBox,
      SearchList,
      // Scroll,
      Confirm,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    position :fixed
    width:100%
    height:100%
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      height:100%
      // position: fixed
      // top: 178px
      // bottom: 0
      // width: 100%
      .shortcut
        height: 100%
        // overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position:absolute
      width: 100%
      height:100%;
      box-sizing:border-box
      padding-top:80px
      transform:translateY(-80px)

</style>