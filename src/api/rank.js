
import {commonParams, Params} from './config'

export function getTopList () {
  const url = 'https://music.borrowfriend.xyz/api/getTopList'

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
        let ans = res.data
        if (typeof ans === 'string') {
          ans = ans.replace(/_callBack\((.*)/, '$1')
          ans = ans.replace(/\)$/, '')
          resolve(JSON.parse(ans))
        } else {
          resolve(ans)
        }
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function getMusicList (topid) {
  const url = 'https://music.borrowfriend.xyz/api/getMusicList'

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
        let ans = res.data
        if (typeof ans === 'string') {
          ans = ans.replace(/_callBack\((.*)/, '$1')
          ans = ans.replace(/\)$/, '')
          ans = JSON.parse(ans)
        }
        let last = ans
        let _data = handleSongData(last.songlist)
        getPicture(_data)
        .then((back) => {
          // console.log(back)
          back.midurlinfo.forEach((item, index) => {
            last.songlist[index].data.url = item.purl
          })
          resolve(last)
        })
        .catch((er) => reject(er))
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
function handleSongData (arr) {
  arr = arr.slice(0, 50)
  let d1 = arr.map(item => item.data.songmid)
  let d2 = arr.map(item => 0)
  return {
    songmid: d1,
    songtype: d2
  }
}
export function getPicture (ans) {
  const url = 'https://music.borrowfriend.xyz/api/getPurlUrl'
  let data = Object.assign({}, Params)
  Object.assign(data.url_mid.param, ans)
  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      method: 'POST',
      success: function (res) {
        resolve(res.data)
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
