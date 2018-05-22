import {commonParams, Params} from './config'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
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

export function getSingerDetail (singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId,
    jsonpCallback: '_callBack'
  })

  return new Promise(function (resolve, reject) {
    wx.request({
      url,
      data,
      success: function (res) {
        let ans = res.data.replace(/_callBack\((.*)/, '$1')
        ans = ans.replace(/\)$/, '')
        let last = JSON.parse(ans)
        let _data = handleSongData(last.data.list)
        getPicture(_data)
        .then((back) => {
          back.midurlinfo.forEach((item, index) => {
            last.data.list[index].musicData.url = item.purl
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
  let d1 = arr.map(item => item.musicData.songmid)
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

