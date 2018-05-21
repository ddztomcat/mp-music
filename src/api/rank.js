
import {commonParams} from './config'

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    jsonpCallback: '_callBack'
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

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5',
    jsonpCallback: '_callBack'
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
