
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  let searches = []
  try {
    searches = wx.getStorageSync(SEARCH_KEY) || []
    // console.log(searches)
    insertArray(searches, query, (item) => {
      return item === query
    }, SEARCH_MAX_LEN)
    wx.setStorageSync(SEARCH_KEY, searches)
  } catch (err) {
    console.log(err)
  }
  return searches
}

export function deleteSearch (query) {
  let searches = []
  try {
    searches = wx.getStorageSync(SEARCH_KEY) || []
    deleteFromArray(searches, (item) => {
      return item === query
    })
    wx.setStorageSync(SEARCH_KEY, searches)
  } catch (err) {
    console.log(err)
  }
  return searches
}

export function clearSearch () {
  try {
    wx.removeStorageSync(SEARCH_KEY)
  } catch (err) {

  }
  return []
}

export function loadSearch () {
  let searches = []
  try {
    searches = wx.getStorageSync(SEARCH_KEY) || []
    // console.log(searches)
  } catch (err) {

  }
  return searches
}

export function savePlay (song) {
  let songs = []
  try {
    songs = wx.getStorageSync(PLAY_KEY) || []
    insertArray(songs, song, (item) => {
      return song.id === item.id
    }, PLAY_MAX_LEN)
    wx.setStorageSync(PLAY_KEY, songs)
  } catch (err) {
    console.log(err)
  }

  return songs
}

export function loadPlay () {
  let songs = []
  try {
    songs = wx.getStorageSync(PLAY_KEY)
    // console.log(songs)
  } catch (err) {

  }
  return songs || []
}

export function saveFavorite (song) {
  let songs = []
  try {
    songs = wx.getStorageSync(FAVORITE_KEY) || []
    insertArray(songs, song, (item) => {
      return song.id === item.id
    }, FAVORITE_MAX_LEN)
    wx.setStorageSync(FAVORITE_KEY, songs)
  } catch (err) {
    console.log(err)
  }

  return songs
}

export function deleteFavorite (song) {
  let songs = []
  try {
    songs = wx.getStorageSync(FAVORITE_KEY) || []
    deleteFromArray(songs, (item) => {
      return item.id === song.id
    })
    wx.setStorageSync(FAVORITE_KEY, songs)
  } catch (err) {
    console.log(err)
  }

  return songs
}

export function loadFavorite () {
  let songs = []
  try {
    songs = wx.getStorageSync(FAVORITE_KEY) || []
  } catch (err) {
    console.log(err)
  }
  return songs
}

