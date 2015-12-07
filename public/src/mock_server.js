// import { combineReducers } from 'redux'
import Immutable from 'immutable'
import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import expect, { createSpy, spyOn, isSpy } from 'expect'

// ----- socket.io
const socket = require('socket.io-client')('http://localhost:9187')
// ---------------

const cats = Immutable.List.of('music', 'french actors', 'actors', 'spirituality', 'czech film', 'rock music', 'world music', 'jazz', 'technology', 'health', 'dental', 'comics', 'humor', 'literature', 'science', 'drama', 'theater', 'film', 'concerts', 'contemporary art', 'opera', 'fitness')

// from ZERO to n - 1
const getRandomInt = (n) => {
  return Math.floor(Math.random() * n);
}

// ---------------- the actual implementation required by james

const gatherOriginalVdna = () => {
  let vdnaDivs = {}
  $("*[vdnaroot]").each((index, vdnaRootEl) => {
    let vdnaRootName = $(vdnaRootEl).attr("vdnaroot");
    vdnaDivs[vdnaRootName] = [];

    $(vdnaRootEl).find("*").each((index, vdnaEl) => {
      vdnaDivs[vdnaRootName].push(vdnaEl.outerHTML);
    });
  });
  return Immutable.fromJS(vdnaDivs)
}

// -----------------------------------------------------------

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

// --- reimplementing combineReducers

const combineReducers = (reducerMapping) => {
  // returns a reducer (the combination!), así que otro función
  return (state = {}, action) => {
    return Object.keys(reducerMapping).reduce((nextState, key) => {
      nextState[key] = reducerMapping[key](state[key], action)
      return nextState
    }, {})
  }
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

const todo = (state = Immutable.Map(), action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return Immutable.Map({
        id: action.id,
        text: action.text,
        complete: false
      })
    case 'TOGGLE_TODO':
      if(state.get('id') === action.id) {
        return state.update('complete', (v) => !v)
      } else {
        return state
      }
    default:
      return state
  }
}

const todos = (state = Immutable.List(), action) => {
  switch(action.type) {
    case 'ADD_TODO':
      let temp = todo(undefined, Immutable.Map(action).merge({
        id: state === undefined ? 0 : state.size
      }).toObject())
      return state === undefined ? Immutable.List.of(temp) : state.push(temp)
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const store = createStore(todoApp)

// ---------------------------------------------------------------------

/*
 The state is { id: x, index: y }
*/
const category = (state, action) => {
  switch(action.type) {
    case 'ADD_CATEGORY':
      return Immutable.Map({ id: action.id, index: 0 })
    case 'NEXT_CATEGORY':
      let max = cats.size - 1
      if(state.get('id') === action.id) {
        let temp = state.update('index', v => v === max ? max : v + 1)
        return temp
      } else {
        return state
      }
    case 'PREVIOUS_CATEGORY':
      if(state.get('id') === action.id) {
        return state.update('index', v => v === 0 ? 0 : v - 1)
      }
      return state
    case 'RANDOM_CATEGORY':
      if(state.get('id') === action.id) {
        return getRandomInt(cats.size)
      }
      return state
    default:
      return state
  }
}

/*
   The state is a list of indexes into cats
 */
const categories = (state = Immutable.List(), action) => {
  switch(action.type) {
    case 'ADD_CATEGORY':
      return state.push(category(undefined, { type: action.type, id: state.size }))
    case 'PREVIOUS_CATEGORY':
    case 'NEXT_CATEGORY':
    case 'RANDOM_CATEGORY':
      return state.map(c => category(c, action))
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
/*
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
*/
/* the state will be the index of a single category now, not the whole array
 Add each category to 'categories', which is THE redux store
cats.forEach(function(interest) {
  return categories.dispatch({
    type: ADD_CATEGORY,
    text: interest
  })
})
*/

// ---------- test

const testAddCategory = () => {
  console.log('testAddCategory')
  const catsBefore = Immutable.List.of()
  const catsAfter = Immutable.List.of(Immutable.Map({ id: 0, index: 0 }))
  expect(
    Immutable.is(categories(catsBefore, { type: 'ADD_CATEGORY' }), catsAfter)
  ).toEqual(true)
}

const testNextCategory = () => {
  console.log('testNextCategory')
  const state0 = categories(Immutable.List(), { type: 'ADD_CATEGORY' })
  const catsBefore = categories(state0, { type: 'ADD_CATEGORY' })
  const catsAfter = Immutable.List.of(Immutable.Map({ id: 0, index: 0 }),
                                      Immutable.Map({ id: 1, index: 1 }))
  expect(
    Immutable.is(categories(catsBefore, { type: 'NEXT_CATEGORY', id: 1 }), catsAfter)
  ).toEqual(true)
}

const testPreviousCategoryZero = () => {
  console.log('testPreviousCategory on 0')
    const catsBefore = Immutable.List.of(Immutable.Map({ id: 0, index: 0 }),
                                         Immutable.Map({ id: 1, index: 0 }))
    const catsAfter = Immutable.List.of(Immutable.Map({ id: 0, index: 0 }),
                                        Immutable.Map({ id: 1, index: 0 }))
  expect(
    Immutable.is(categories(catsBefore, { type: 'PREVIOUS_CATEGORY', id: 0 }), catsAfter)
  ).toEqual(true)
}

const testPreviousCategory = () => {
  console.log('testPreviousCategory')
    const catsBefore = Immutable.List.of(Immutable.Map({ id: 0, index: 1 }),
                                         Immutable.Map({ id: 1, index: 3 }),
                                         Immutable.Map({ id: 2, index: 5 }))
    const catsAfter = Immutable.List.of(Immutable.Map({ id: 0, index: 1 }),
                                        Immutable.Map({ id: 1, index: 2 }),
                                        Immutable.Map({ id: 2, index: 5 }))
  expect(
    Immutable.is(categories(catsBefore, { type: 'PREVIOUS_CATEGORY', id: 1 }), catsAfter)
  ).toEqual(true)
}

testAddCategory()
testNextCategory()
testPreviousCategoryZero()
testPreviousCategory()

console.log('category tests passed')

// -------------- vdna tests

const testGatherOriginalVdnaRootNodes = () => {
  console.log('testGatherOriginalVdnaRootNodes')
  const originalVdna = gatherOriginalVdna()
  expect(
    Immutable.is(originalVdna.reduce((keys, _, key) => { return keys.add(key) }, Immutable.Set()),
                 Immutable.Set.of('martens', 'minks', 'ferrets'))
  ).toEqual(true)
}
testGatherOriginalVdnaRootNodes()

const testGatherOriginalVdnaChildNodes = () => {
  console.log('testGatherOriginalVdnaChildNodes')
  const originalVdna = gatherOriginalVdna()
  const firstChildren = originalVdna.reduce((children, child) => { return children.add(child.first()) }, Immutable.Set())
  expect(
    Immutable.is(firstChildren, Immutable.Set.of('<li>Henderson</li>', '<li>Rinaldo</li>', '<li>Malvada</li>'))
  ).toEqual(true)
}
testGatherOriginalVdnaChildNodes()

//console.log('testSendVdna')
//socket.on('death', data => {
//  console.log(data.text)
//})
console.log('testSendDiv')
socket.emit('addCats', { div: '<li>leprosy is a <strong>very</strong> fine thing.</li>' })
socket.on('sendDiv', data => {
  console.log(data.div)
})

// -------------- video tutorial todo hovno

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
console.log('add a todo test passed')

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
console.log('add another todo test passed')

const testToggleTodo = () => {
  const todo0 = Immutable.Map({ text: 'Brush a pine marten' })
  const todo1 = Immutable.Map({ text: 'Kill Christián' })
  const todo2 = Immutable.Map({ text: 'Pasea un poco' })
  const addAction = (todo) => {
    return {
      type: 'ADD_TODO',
      text: todo.get('text')
    }
  }
  const toggleAction = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  const state0 = todos(Immutable.List(), addAction(todo0))
  const state1 = todos(state0, addAction(todo1))
  const state2 = todos(state1, addAction(todo2))
  expect(
    todos(state2, toggleAction).get(1).get('complete')
  ).toEqual(true)
}
testToggleTodo()

console.log('tests passed')
