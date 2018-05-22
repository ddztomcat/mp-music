<template>
  <div class="loading">
    <div class="img-wrapper"></div>
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .loading
    width: 100%
    text-align: center
    .img-wrapper
      display:inline-block;
      width:24px;
      height:24px;
      background-size:100%;
      background-image:url('./loading.gif')
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
