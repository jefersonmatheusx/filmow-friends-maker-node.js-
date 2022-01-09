const axios = require('axios')
const fs = require('fs')
var logger = fs.createWriteStream('filmow_users.log.json', {
  // flags: 'a' // 'a' means appending (old data will be preserved)
})

const cookie = [
  'filmow_sessionid=.eJxVj0sLwjAQhP9LzlLbpk9vKkjxIl5UvIQ12T40NNBNRBD_uxFbxNsys_MN82RkZAdagLOt0EBWaNN0vbiAvGGv2ILVIPFizI3NWI8P65W5IwdDZ-aosYHeore-AEc4iBao9V-KRzwM45JzqBUqLMswS2Ke55xLmYYyhbpAqeA_3H0qozjNkrzwzlQuyILvWbDB7W2lKanP2T07uVzDdV0V1FSr7fV4KO__tN-KcaY0AwajSsFEDzbjsVv6aMxeb_UUXzQ:1n3ivH:c44i4xzZsbvcnz_VuaKV8VCYVEw',
  'lui=1256478'
]
const path = '/ajax/usuarios/compatibilidade'

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
  for (let i = 1; i <= 60; i++) {
    opt.url = url + i
    try {
      const response = await axios.request(opt)
      if (response.status == 200) {
        if (response.data.percent > 49) {
          opt.url = url2 + i
          const res = await axios.request(opt)
          const user = res.data.user
          const userName = /data-friend[-_]username=\\*[\'\"](\w+)\\*[\'\"]/g.exec(res.data.html)[1]
          const basedIn = /[bB]aseado[\D]+(\d+)/g.exec(res.data.html)[1]
          const dataUser = {
            user: user.fname,
            percent: response.data.percent,
            id: i,
            name: user.name,
            userName,
            basedIn
          }
          logger.write(JSON.stringify(dataUser) + ', \n', (err) => {
            if (err) {
              throw Error('Something went wrong')
            }
          })
          console.log('record', i)
          users.push(dataUser)
        }
      }
    } catch (e) {
      console.error(i, '-!')
    }
  }

  users = users.sort(comparePercent)
  res.send(users).status(200)
}

function comparePercent(a, b) {
  if (a.percent < b.percent) {
    return 1
  }
  if (a.percent > b.percent) {
    return -1
  }
  return 0
}

module.exports = {
  getAll
}
