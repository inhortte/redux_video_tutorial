import {combineReducers} from 'redux'
import Server from 'socket.io'
import Immutable from 'immutable'

// --- reimplementing createStore

const createStore = (reducer) => {
  let state
  let listeners = []
  const getState = () => state
  const dispatch = (action, cb) => {
    state = reducer(state, action)
      listeners.forEach((listener) => listener())
      if(cb !== undefined) {
        cb()
      }
  }
  const subscribe = (listener) => {
    listeners.push(listener)
      return () => {
        listeners.filter(l => l !== listener)
      }
  }
  dispatch({})
    return { getState, dispatch, subscribe }
}

// ---

const cats = ['music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness']

// from ZERO to n - 1
const getRandomInt = (n) => {
  return Math.floor(Math.random() * n);
}

const getOneCategory = cats => {
  return [ cats[getRandomInt(cats.length)] ]
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

/*
 state: { category: [ -selected cat(s)- ], cats: -current cat list-
*/
const category = (state = {
  category: [],
  cats: cats
}, action) => {
  switch(action.type) {
    case 'SET_CATEGORIES':
      return {
        category: state.category,
        cats: action.cats
      }
    case 'GET_ONE_CATEGORY':
      return {
        category: getOneCategory(state.cats),
        cats: cats
      }
      case 'GET_TWO_CATEGORIES':
      return {
        category: getTwoCategories(state.cats),
        cats: cats
      }
    default:
      return state
  }
}

const snippet = (state = "<div>Leprosy</div>", action) => {
  switch(action.type) {
    case 'SET_SNIPPET':
      return action.snip
    default:
      return state
  }
}

const catServ = combineReducers({
  category, snippet
})

export const store = createStore(catServ)

export default function startServer() {
  const io = new Server().attach(9187)
  console.log('james is attached to port 9187')

  io.on('connect', (socket) => {
    console.log('Una conexión ha estado hecho')
    socket.emit('death', { text: 'DIE!' })

    socket.on('addCats', data => {
      let actionType = getRandomInt(3) === 0 ? 'GET_TWO_CATEGORIES' : 'GET_ONE_CATEGORY'
      store.dispatch({ type: actionType })
      let newDiv = addAttributesToFirstTag('vdnaclass="' + store.getState().category.category.join(',') + '"', data.div)
      console.log('enviando div: ' + newDiv)
      io.emit('sendDiv', { div: newDiv })
    })

    socket.on('setCats', data => {
      store.dispatch({
        type: 'SET_CATEGORIES',
        cats: data.cats
      })
      console.log('after setCats store: ' + JSON.stringify(store.getState()))
    })
  })
}

startServer()
