import Server from 'socket.io'
import Immutable from 'immutable'

const cats = Immutable.List.of('music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness')

// from ZERO to n - 1
const getRandomInt = (n) => {
  return Math.floor(Math.random() * n);
}

const getOneCategory = cats => {
  return [ cats.get(getRandomInt(cats.size)) ]
}

const getTwoCategories = cats => {
  let primerGato = getOneCategory(cats)[0]
  let segundoGato
  do {
    segundoGato = getOneCategory(cats)[0]
  } while(segundoGato === primerGato)
  return [ primerGato, segundoGato ]
}

const addAttributesToFirstTag = (attr, html) => {
  let re = /^(<[\w\s]+)(>.*)$/
  let matches = re.exec(html)
  return matches[1] + ' ' + attr + matches[2]
}

export default function startServer() {
  const io = new Server().attach(9187)
  console.log('james is attached to port 9187')

  io.on('connect', (socket) => {
    console.log('Una conexión ha estado hecho')
    socket.emit('death', { text: 'DIE!' })

    socket.on('addCats', data => {
      let categories = getRandomInt(3) === 0 ? getTwoCategories(cats) : getOneCategory(cats)
        let newDiv = addAttributesToFirstTag('vdnaclass="' + categories.join(',') + '"', data.div)
        console.log('enviando div: ' + newDiv)
        io.emit('sendDiv', { div: newDiv })
    })
  })
}

startServer()
