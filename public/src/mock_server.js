import { createStore } from 'redux'

const ADD_CATEGORY          = 'ADD_CATEGORY'
const SELECT_ONE_CATEGORY   = 'SELECT_ONE_CATEGORY'
const SELECT_TWO_CATEGORIES = 'SELECT_TWO_CATEGORIES'

let staticInterests = [ 'music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness' ]

// from ZERO to n - 1
function getRandomInt(n) {
  return Math.floor(Math.random() * 10);
}

function getOneCategory(state) {
  return [ state[getRandomInt(state.length)] ]
}

function getTwoCategories(state) {
  let catOne = getOneCategory(state)[0]
  let catTwo
  do {
    catTwo = state[getRandomInt(state.length)]
  } while(catOne === catTwo)
  return [ catOne, catTwo ]
}

// --- redux is really not needed at this point
function store(state = [], action) {
  switch(action.type) {
    case ADD_CATEGORY:
      return state.concat(action.text.trim())
    case SELECT_ONE_CATEGORY:
      return [ state[getRandomInt(state.length)] ]
    default:
      return state
  }
}

let categories = createStore(store, [])

staticInterests.forEach(function(interest) {
  categories.dispatch({
    type: ADD_CATEGORY,
    text: interest
  })
})

// ---------- test
console.log(getOneCategory(staticInterests))
console.log(getTwoCategories(staticInterests))
