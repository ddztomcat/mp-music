import {commonParams, Params} from './config'

export function getSingerList () {
  const url = 'https://www.borrowfriend.xyz/api/getSingerList'

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
        resolve(res.data)
      },
      fail: function (err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function getSingerDetail (singerId) {
  const url = 'https://www.borrowfriend.xyz/api/getSingerDetail'

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
        let last = res.data
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
  const url = 'https://www.borrowfriend.xyz/api/getPurlUrl'
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

