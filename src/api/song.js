import {commonParams} from './config'

export function getLyric (mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      success: function (res) {
        let ans = res.data.replace(/_callBack\((.*)/, '$1')
        ans = ans.replace(/\)$/, '')
        resolve(JSON.parse(ans))
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
