import { createStore } from 'redux'
import expect, { createSpy, spyOn, isSpy } from 'expect'

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

function addAttributesToFirstTag(attr, html) {
  let re = /^(<[\w\s]+)(>.*)$/
  let matches = re.exec(html)
    return matches[1] + ' ' + attr + matches[2]
}

// --- redux is really not needed at this point (it's only used for ADD_CATEGORY)
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

/*
 Add each category to 'categories', which is THE redux store
*/
staticInterests.forEach(function(interest) {
  let thurk = categories.dispatch({
    type: ADD_CATEGORY,
    text: interest
  })
  // console.log(thurk)
})

module.exports = {
  addCategories: function(div) {
    let categories = getRandomInt(3) === 0 ? getTwoCategories(staticInterests) : getOneCategory(staticInterests)
    return addAttributesToFirstTag('vdnaclass="' + categories.join(',') + '"', div)
  },

  sendOneCategory: function() {
    return getOneCategory(staticInterests)
  },
  sendTwoCategories: function() {
    return getTwoCategories(staticInterests)
  }
}

// ---------- test
console.log(getOneCategory(staticInterests))
console.log(getTwoCategories(staticInterests))

expect(
  store([], { type: ADD_CATEGORY, text: 'actors' })
).toInclude('actors')
