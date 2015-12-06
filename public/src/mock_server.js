// import { createStore } from 'redux'
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import expect, { createSpy, spyOn, isSpy } from 'expect'

const cats = Immutable.List.of('music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness')

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

// ------------------------------ most of this is from the video tutorial

/*
 Simply append the first Category to the end of the passed list
 I keep forgetting these are just INDEXES to cats.
*/
const addToCategoryList = (catList) => {
  return catList.push(0)
}

const removeFromCategoryList = (index, catList) => {
  return catList.splice(index, 1)
}

const incrementInCategoryList = (index, catList) => {
  let max = catList.size - 1
  return catList.update(index, (value) => {
    return value === max ? max : value + 1
  })
}

const decrementInCategoryList = (index, catList) => {
  return catList.update(index, (value) => {
    return value === 0 ? 0 : value - 1
  })
}

/*
 Toggle todo takes a todo object and flips its 'completed' field
*/
const toggleTodo = (todo) => {
  return todo.update('complete', (value) => !value)
}

const todos = (state = Immutable.List.of(), action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return state.push(Immutable.Map({ text: action.text }).merge({
        id: state.size,
        complete: false
      }))
    default:
      return state
  }
}

// ---------------------------------------------------------------------

/*
 The state is a list of indexes into cats
*/
const category = (state = Immutable.List(), action) => {
  switch(action.type) {
    case 'ADD_CATEGORY':
      return state.push(0)
    case 'PREVIOUS_CATEGORY':
      return state === 0 ? 0 : state - 1
    case 'NEXT_CATEGORY':
      return (state === cats.size - 1) ? cats.size - 1 : state + 1
    case 'RANDOM_CATEGORY':
      return getRandomInt(cats.size)
    default:
      return state
  }
}

// The redux store - obviously none of this is working.
const categories = createStore(category)

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

const catList = categories.getState().map((catIndex) => {
  return (
    <Category
      value={cats.get(categories.getState().get(catIndex))}
      nextInterest={() => categories.dispatch({ type: 'NEXT_CATEGORY', index: catIndex })}
      previousInterest={() => categories.dispatch({ type: 'PREVIOUS_CATEGORY', index: catIndex })}
      randomInterest={() => categories.dispatch({ type: 'RANDOM_CATEGORY', index: catIndex })}
    />
  )
}).join("\n")

console.log(catList)

const CategoryList = () => (
  <div>
    {catList}
  </div>
)

const render = () => {
  let catIndex = 0
  ReactDOM.render(
    <Category
      value={cats.get(categories.getState().get(catIndex))}
      nextInterest={() => categories.dispatch({ type: 'NEXT_CATEGORY', index: catIndex })}
      previousInterest={() => categories.dispatch({ type: 'PREVIOUS_CATEGORY', index: catIndex })}
      randomInterest={() => categories.dispatch({ type: 'RANDOM_CATEGORY', index: catIndex })}
    />,
    document.getElementById("mockServer")
  )
}

categories.subscribe(render)
render()

/* the state will be the index of a single category now, not the whole array
 Add each category to 'categories', which is THE redux store
cats.forEach(function(interest) {
  return categories.dispatch({
    type: ADD_CATEGORY,
    text: interest
  })
})
*/

/* this is what this js file is SUPPOSED to do (move to socket.io)
module.exports = {
  addCategories: function(div) {
    let categories = getRandomInt(3) === 0 ? getTwoCategories(cats) : getOneCategory(cats)
    return addAttributesToFirstTag('vdnaclass="' + categories.join(',') + '"', div)
  },

  sendOneCategory: function() {
    return getOneCategory(cats)
  },
  sendTwoCategories: function() {
    return getTwoCategories(cats)
  }
}
*/

// ---------- test

expect(
  cats.get(category(0, { type: 'NEXT_CATEGORY' }))
).toEqual('french actors')
expect(
  cats.get(category(5, { type: 'PREVIOUS_CATEGORY' }))
).toEqual('czech film')
console.log('Next/Prev category tests passed')

// ------ for a list of cats

const testAddToCategoryList = () => {
  const catsBefore = Immutable.List.of()
  const catsAfter = Immutable.List.of(0)
  expect(
    addToCategoryList(catsBefore).toArray()
  ).toEqual(catsAfter.toArray())
}
testAddToCategoryList()

const testRemoveFromCategoryList = () => {
  const catsBefore = Immutable.List.of(0, 5)
  const catsAfter = Immutable.List.of(5)
  expect(
    removeFromCategoryList(0, catsBefore).toArray()
  ).toEqual(catsAfter.toArray())
}
testRemoveFromCategoryList()
console.log('add / remove tests passed')

// I'm not testing edge cases right now (ie, when something in catsBefore is the maximum)
const testIncrementInCategoryList = () => {
  const catsBefore = Immutable.List.of(0, 1, 8, 7)
  const catsAfter = Immutable.List.of(0, 1, 9, 7)
  expect(
    incrementInCategoryList(2, catsBefore).toArray()
  ).toEqual(catsAfter.toArray())
}
const testDecrementInCategoryList = () => {
  const catsBefore = Immutable.List.of(0, 1, 8, 7)
  const catsAfter = Immutable.List.of(0, 0, 8, 7)
  expect(
    decrementInCategoryList(1, catsBefore).toArray()
  ).toEqual(catsAfter.toArray())
}
testIncrementInCategoryList()
testDecrementInCategoryList()
console.log('increment / decrement tests passed')

// -------------- video tutorial todo hovno

const testToggleTodo = () => {
  const todoBefore = Immutable.Map({
    id: 0, text: 'Brush a pine marten', complete: false
  })
  const todoAfter = Immutable.Map({
    id: 0, text: 'Brush a pine marten', complete: true
  })
  expect(
    toggleTodo(todoBefore).toObject()
  ).toEqual(todoAfter.toObject())
}
testToggleTodo()

const testAddTodo = () => {
  const todo = Immutable.Map({
    text: 'Brush a pine marten'
  })
  const stateBefore = Immutable.List.of()
  const action = {
    type: 'ADD_TODO',
    text: todo.get('text')
  }
  const stateAfter = Immutable.List.of(Immutable.Map(todo).merge({
    id: 0,
    complete: false
  }))
  expect(
    Immutable.is(todos(stateBefore, action), stateAfter)
  ).toEqual(true)
}
testAddTodo()

const testAddAnotherTodo = () => {
  const todo = Immutable.Map({
    text: 'Kill Christián'
  })
  const stateBefore = Immutable.List.of(Immutable.Map({
    id: 0,
    text: 'Brush a pine marten',
    complete: false
  }))
  const action = {
    type: 'ADD_TODO',
    text: todo.get('text')
  }
  const stateAfter = Immutable.List.of(Immutable.Map({
    id: 0,
    text: 'Brush a pine marten',
    complete: false
  }), Immutable.Map(todo).merge({
    id: 1,
    complete: false
  }))
  expect(
    Immutable.is(todos(stateBefore, action), stateAfter)
  ).toEqual(true)
}
testAddAnotherTodo()

console.log('tests passed')
