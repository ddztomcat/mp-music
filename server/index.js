
var express = require('express')
var axios = require('axios')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.post('/getPurlUrl', function (req, res) {
  var url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
  // let data = {'comm': {'g_tk': 5381, 'inCharset': 'utf-8', 'outCharset': 'utf-8', 'notice': 0, 'format': 'json', 'platform': 'h5', 'needNewCode': 1, 'uin': 0}, 'url_mid': {'module': 'vkey.GetVkeyServer', 'method': 'CgiGetVkey', 'param': {'guid': '5188143135', 'songmid': ['003kLvu04bLGzi', '0004ieul3S0r2m', '003Lfxqy37zUo7', '001iX6se3K1BIM', '003sDIUS3EJoO7', '000Kk6AF2Z6nWt', '0030dt7o4TKNEk', '003fARo73R2Pv1'], 'songtype': [0, 0, 0, 0, 0, 0, 0, 0], 'uin': '0', 'loginflag': 0, 'platform': '23'}}}
  axios.post(url, req.body, {
    headers: {
      referer: 'http://ustbhuangyi.com/music/',
      host: 'ustbhuangyi.com'
    }
  }).then((response) => {
    res.json(response.data.url_mid.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getTopList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      ret = ret.replace(/_callBack\((.*)/, '$1')
      ret = ret.replace(/\)$/, '')
      ret = JSON.parse(ret)
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getMusicList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)/, '$1')
      ans = ans.replace(/\)$/, '')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getRecommend', function (req, res) {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)\)\s*$/, '$1')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getSongList', function (req, res) {
  const url = 'http://ustbhuangyi.com/music/api/getCdInfo'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)\)\s*$/, '$1')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getHotKey', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)/, '$1')
      ans = ans.replace(/\)$/, '')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getSearch', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)/, '$1')
      ans = ans.replace(/\)$/, '')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getSingerList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)/, '$1')
      ans = ans.replace(/\)$/, '')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/getSingerDetail', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  axios.get(url, {
    params: req.query
  }).then((response) => {
    var ans = response.data
    if (typeof ans === 'string') {
      ans = ans.replace(/_callBack\((.*)/, '$1')
      ans = ans.replace(/\)$/, '')
      ans = JSON.parse(ans)
    }
    res.json(ans)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)
app.listen(23000, function () {
  console.log('server start...')
})
