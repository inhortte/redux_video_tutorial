// import { createStore } from 'redux'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import expect, { createSpy, spyOn, isSpy } from 'expect'
var deepFreeze = require('deep-freeze')

const staticInterests = [ 'music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness' ]

// from ZERO to n - 1
const getRandomInt = (n) => {
  return Math.floor(Math.random() * n);
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

/*
 Simply append the first Category to the end of the passed list
 I keep forgetting these are just INDEXES to staticInterests.
*/
const addToCategoryList = (catList) => {
  return [...catList, 0]
}

const removeFromCategoryList = (index, catList) => {
  return [...catList.slice(0, index), ...catList.slice(index + 1)]
}

const incrementInCategoryList = (index, catList) => {
  let max = catList.length - 1
  return [
    ...catList.slice(0, index),
    catList[index] === max ? max : catList[index] + 1,
    ...catList.slice(index + 1)
  ]
}

const decrementInCategoryList = (index, catList) => {
  return [
    ...catList.slice(0, index),
    catList[index] === 0 ? 0 : catList[index] - 1,
    ...catList.slice(index + 1)
  ]
}

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

/* this is what this js file is SUPPOSED to do
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

expect(
  staticInterests[category(0, { type: 'NEXT_CATEGORY' })]
).toEqual('french actors')
expect(
  staticInterests[category(5, { type: 'PREVIOUS_CATEGORY' })]
).toEqual('czech film')

// ------ for a list of cats

const testAddToCategoryList = () => {
  const catsBefore = []
  const catsAfter = [0]
  deepFreeze(catsBefore)
  expect(
    addToCategoryList(catsBefore)
  ).toEqual(catsAfter)
}
testAddToCategoryList()

const testRemoveFromCategoryList = () => {
  const catsBefore = ['music', 'drama']
  const catsAfter = ['music']
  deepFreeze(catsBefore)
  expect(
    removeFromCategoryList(1, catsBefore)
  ).toEqual(catsAfter)
}
testRemoveFromCategoryList()

// I'm not testing edge cases right now (ie, when something in catsBefore is the maximum)
const testIncrementInCategoryList = () => {
  const catsBefore = [0, 1, 8, 7]
  const catsAfter = [0, 1, 9, 7]
  deepFreeze(catsBefore)
  expect(
    incrementInCategoryList(2, catsBefore)
  ).toEqual(catsAfter)
}
const testDecrementInCategoryList = () => {
  const catsBefore = [0, 1, 8, 7]
  const catsAfter = [0, 0, 8, 7]
  deepFreeze(catsBefore)
  expect(
    decrementInCategoryList(1, catsBefore)
  ).toEqual(catsAfter)
}
testIncrementInCategoryList()
testDecrementInCategoryList()

// --------------

console.log('tests passed')
