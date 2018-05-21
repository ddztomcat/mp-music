import {commonParams, Params} from './config'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

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
        // console.log(res)
        let ans = res.data.replace(/_callBack\((.*)/, '$1')
        ans = ans.replace(/\)$/, '')
        // console.log(ans)
        resolve(JSON.parse(ans))
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function search (query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
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
        let last = JSON.parse(ans)
        let _data = handleSongData(last.data.song.list)
        getPicture(_data)
        .then((back) => {
          back.midurlinfo.forEach((item, index) => {
            last.data.song.list[index].url = item.purl
          })
          resolve(last)
        })
        .catch((er) => reject(er))
        // resolve()
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
