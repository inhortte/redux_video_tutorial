// import { createStore } from 'redux'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import expect, { createSpy, spyOn, isSpy } from 'expect'

const staticInterests = [ 'music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness' ]

// -------------- html testing helpers --- after react, this is not used

const appendDivToBody = (text) => {
  let el = document.createElement("div")
  let textEl = document.createTextNode(text)
  el.appendChild(textEl)
  document.body.appendChild(el)
}

// -----------------------------------

// from ZERO to n - 1
const getRandomInt = (n) => {
  return Math.floor(Math.random() * n);
}

const getOneCategory = (state) => {
  return [ state[getRandomInt(state.length)] ]
}

const getTwoCategories = (state) => {
  let catOne = getOneCategory(state)[0]
  let catTwo
  do {
    catTwo = state[getRandomInt(state.length)]
  } while(catOne === catTwo)
    return [ catOne, catTwo ]
}

const addAttributesToFirstTag = (attr, html) => {
  let re = /^(<[\w\s]+)(>.*)$/
  let matches = re.exec(html)
    return matches[1] + ' ' + attr + matches[2]
}

// --- reimplementing createStore

const createStore = (reducer) => {
  let state
  let listeners = []
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
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

// ------------------------------

const category = (state = 0, action) => {
  switch(action.type) {
    case 'PREVIOUS_CATEGORY':
      return state === 0 ? 0 : state - 1
    case 'NEXT_CATEGORY':
      return (state === staticInterests.length - 1) ? staticInterests.length - 1 : state + 1
    case 'RANDOM_CATEGORY':
      return getRandomInt(staticInterests.length)
    default:
      return state
  }
}

/*
 A "dumb" component contains no business logic.
 It only specifies how the current application state
 transforms into renderable output, as well as how
 callbacks (passed as props) are bound to event handlers.
*/
const Category = ({
  value, nextInterest, previousInterest, randomInterest
}) => (
  <div>
    <p>{value}</p>
    <button onClick={previousInterest}>-</button>
    <button onClick={nextInterest}>+</button>
    <button onClick={randomInterest}>?</button>
  </div>
)

// The redux store
const categories = createStore(category)

const render = () => {
  ReactDOM.render(
    <Category
      value={staticInterests[categories.getState()]}
      nextInterest={() => categories.dispatch({ type: 'NEXT_CATEGORY' })}
      previousInterest={() => categories.dispatch({ type: 'PREVIOUS_CATEGORY' })}
      randomInterest={() => categories.dispatch({ type: 'RANDOM_CATEGORY' })}
    />,
    document.getElementById("mockServer")
  )
}

categories.subscribe(render)
render()

/* the state will be the index of a single category now, not the whole array
 Add each category to 'categories', which is THE redux store
staticInterests.forEach(function(interest) {
  let thurk = categories.dispatch({
    type: ADD_CATEGORY,
    text: interest
  })
  // console.log(thurk)
})
*/

/* i'm not sure what to do with this at the moment
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
*/

// ---------- test
console.log(JSON.stringify(getOneCategory(staticInterests)))
console.log(JSON.stringify(getTwoCategories(staticInterests)))

expect(
  staticInterests[category(0, { type: 'NEXT_CATEGORY' })]
).toEqual('french actors')
expect(
  staticInterests[category(5, { type: 'PREVIOUS_CATEGORY' })]
).toEqual('czech film')
console.log('tests passed')
