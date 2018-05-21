
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

app.use('/api', apiRoutes)
app.listen(3000, function () {
  console.log('server start...')
})
