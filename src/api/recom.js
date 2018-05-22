import {commonParams, Params} from './config'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    jsonpCallback: '_callBack'
  })

  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      success: function (res) {
        let ans = res.data.replace(/_callBack\((.*)\)\s*$/, '$1')
        resolve(JSON.parse(ans))
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function getDiscList () {
  const url = 'http://39.106.145.55:23000/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
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
export function getSongList (disstid) {
  const url = 'http://ustbhuangyi.com/music/api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      success: function (res) {
        let last = res.data
        let _data = handleSongData(last.cdlist[0].songlist)
        getPicture(_data)
        .then((back) => {
          back.midurlinfo.forEach((item, index) => {
            last.cdlist[0].songlist[index].url = item.purl
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
  let d1 = arr.map(item => item.songmid)
  let d2 = arr.map(item => 0)
  return {
    songmid: d1,
    songtype: d2
  }
}
export function getPicture (ans) {
  const url = 'http://39.106.145.55:23000/api/getPurlUrl'
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
