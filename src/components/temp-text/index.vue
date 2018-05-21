<template>
    <p class="text">{{text}}</p>
</template>
<script>
 const TYPE_SINGER = 'singer'
export default {
   props: {
     answer: {
       type: Object,
       default: {
         type: 'singer',
         singer: '',
         singername: ''
       }
     }
   },
   computed: {
     text () {
      //  console.log(this.answer)
       return this.answer.type === TYPE_SINGER ? this.answer.singername : this.answer.name + '-' + this.answer.singer
     }
   }
}
</script>
<style lang="stylus">
 @import "~common/stylus/mixin"
   .text {
     no-wrap()
   }
</style>
