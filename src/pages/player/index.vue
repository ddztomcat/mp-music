<template>
<div class="player">
    <div class="normal-player">
        <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
            <!-- <div class="back" @click="back">
            <i class="icon-back"></i>
            </div> -->
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
                @touchstart="middleTouchStart"
                @touchmove="middleTouchMove"
                @touchend="middleTouchEnd"
        >
            <div class="middle-l" ref="middleL" :style="{'transition-duration':'300ms',opacity:showLeft ? '1' : '0'}">
              <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdCls">
                  <img class="image" :src="currentSong.image">
                  </div>
              </div>
              <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
            <scroll-view class="middle-r"  :scroll-into-view="toView" scroll-y ref="lyricList" v-if="currentLyric" :style="{'transition-duration':'300ms',transform:showLeft ? 'translateX(0)' : 'translateX(' + pWith + ')'}">
              <div class="lyric-wrapper">
                    <p ref="lyricLine"
                        class="text"
                        :class="{'current': currentLineNum ===index}"
                        v-for="(line,index) in currentLyric.lines" :key="index" :id="'text' + index">{{line.txt}}</p>
              </div>
            </scroll-view>
        </div>
        <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{'active':currentShow==='cd'}"></span>
              <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentSong.duration)}}</span>
              </div>
                  <div class="operators">
                  <div class="icon i-left" @click="changeMode">
                      <i :class="iconMode"></i>
                  </div>
                  <div class="icon i-left">
                      <i @click="prev" class="icon-prev"></i>
                  </div>
                  <div class="icon i-center">
                      <i @click="togglePlaying" :class="playIcon"></i>
                  </div>
                  <div class="icon i-right">
                      <i @click="next" class="icon-next"></i>
                  </div>
                  <div class="icon i-right">
                      <i @click="toggleFavorite(currentSong)" class="icon" :class="iconType"></i>
                  </div>
              </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
// import ProgressBar from 'base/progress-bar/progress-bar'
// import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import Lyric from 'lyric-parser'
import {playerMixin} from 'common/js/mixin'
// import Playlist from 'components/playlist/playlist'
export default {
  mixins: [playerMixin],
  props: {
    myAudio: {
      type: Object
    }
  },
  data () {
    return {
      toView: '',
      pWith: 0,
      showLeft: true,
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    iconType () {
      return this.getFavoriteIcon(this.currentSong)
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'currentIndex',
      'fullScreen',
      'playing'
    ])
  },
  created () {
    try {
      var res = wx.getSystemInfoSync()
      this.pWith = '-' + res.windowWidth + 'px'
      console.log(this.pWith)
    } catch (e) {
  // Do something when catch error
    }
    this.myAudio = wx.createInnerAudioContext()
    this.myAudio.onPlay(() => {
      console.log('kaishi bofang')
    })
    this.myAudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.myAudio.onEnded(() => {
      console.log('bofang jieshu')
      this.setPlayingState(false)
      this.end()
    })
    this.touch = {}
  },
  onUnload () {
    this.setPlayingState(false)
    this.myAudio.stop()
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    togglePlaying () {
    //   console.log(34)
    //   if (!this.songReady) {
    //     return
    //   }
      console.log('toggglePlaying')
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      // this.$refs.audio.currentTime = 0
      // this.$refs.audio.play()
      this.myAudio.seek(0)
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    next () {
      // if (!this.songReady) {
      //   return
      // }
      console.log('next')
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // this.songReady = false
    },
    prev () {
      // if (!this.songReady) {
      //   return
      // }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // this.songReady = false
    },
    ready () {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        console.log(this.currentLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        this.toView = 'text' + (lineNum - 5)
      }
      this.playingLyric = txt
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    middleTouchStart (e) {
      this.touch.initiated = true
        // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      console.log('start')
    },
    middleTouchMove (e) {

    },
    middleTouchEnd () {
      this.showLeft = !this.showLeft
      this.currentShow = this.currentShow === 'cd' ? 'lyric' : 'cd'
      console.log('end')
    },
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  destroyed () {
    this.myAudio.destroy()
  },
  watch: {
    currentSong (newSong, oldSong) {
      console.log('newSong')
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      console.log(newSong, '45645656546546')
      this.myAudio.src = newSong.url
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.myAudio.play()
        this.getLyric()
      }, 1000)
      this.savePlayHistory(newSong)
    },
    playing (newPlaying) {
      console.log('3334', newPlaying)
      if (newPlaying) {
        this.myAudio.play()
      } else {
        this.myAudio.pause()
      }
    },
    fullScreen (newVal) {
      if (newVal) {
        // setTimeout(() => {
        //   this.$refs.lyricList.refresh()
        // }, 20)
      }
    }
  },
  components: {
    // ProgressBar,
    // ProgressCircle
    // Playlist
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
vendors = official
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
