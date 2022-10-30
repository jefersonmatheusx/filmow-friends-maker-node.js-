const axios = require('axios')
const fs = require('fs')
// var logger = fs.createWriteStream('filmow_users.log.json', {
//   // flags: 'a' // 'a' means appending (old data will be preserved)
// })

const cookie = [
  'filmow_sessionid=.eJxVyzkOwjAQQNG7TI0svE0iSgquYc2MbTkCEgnbShFxdxalgPr9v0Gg3kroNT3CFOEE2nh0wwiHX2GSa5o_nKfbfVkViSx9blXtUtXlC-c9_LsL1fJeaTAxIh6FI1riRM74zMLOEGmrM-qRvRMLzxdF5TJI:1ooq0X:9bG2ogT8MMRv951UkQeygd4i2Yc',
  'lui=1256478'
]
const numberMediasWatched = 60
const path = '/ajax/usuarios/compatibilidade'
const percent = 49
const getAll = async (req, res) => {
  const opt = {
    method: 'get',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie
    }
  }
  const url = 'https://filmow.com/ajax/usuarios/compatibilidade/'
  const url2 = 'https://filmow.com/async/tooltip/user/?user_pk='
  // try {
  let users = []

  // aprox 1.535.960 usuários
  for (let i = 1; i <= 500; i++) {
    opt.url = url + i
    try {
      const response = await axios.request(opt)
      if (response.status == 200) {
        if (response.data.percent > percent) {
          opt.url = url2 + i
          const res = await axios.request(opt)
          const user = res.data.user
          const userName =
            /data-friend[-_]username=\\*[\'\"](\w+)\\*[\'\"]/g.exec(
              res.data.html
            )[1]
          const basedIn = /[bB]aseado[\D]+(\d+)/g.exec(res.data.html)[1]
          if (Number(basedIn) > numberMediasWatched) {
            const dataUser = {
              user: user.fname,
              percent: response.data.percent,
              id: i,
              statusPercent: response.data.title,
              name: user.name,
              userName,
              basedIn,
              userLink: 'https://filmow.com/usuario/' + userName
            }

            console.log('record', i)
            users.push(dataUser)
          }
        }
      }
    } catch (e) {
      console.error(i, '-!')
    }
  }

  const usersList = users.sort(comparePercent)

  res.render('usersList', { usersList })
}

function comparePercent(a, b) {
  if (Number(a.basedIn) < Number(b.basedIn)) {
    return 1
  }
  if (Number(a.basedIn) > Number(b.basedIn)) {
    return -1
  }
  return 0
}

module.exports = {
  getAll
}
