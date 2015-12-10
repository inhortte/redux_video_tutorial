// import { combineReducers } from 'redux'
import Immutable from 'immutable'
import $ from 'jquery'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import expect, { createSpy, spyOn, isSpy } from 'expect'

// ----- socket.io
// const socket = require('socket.io-client')('http://localhost:9187')
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

const todo = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        complete: false
      }
    case 'TOGGLE_TODO':
      if(state.id === action.id) {
        return Immutable.Map(state).update('complete', v => !v).toObject()
      } else {
        return state
      }
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [...state,
              Immutable.Map(todo(undefined, action)).merge({ id: state.length }).toObject()]
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

export const store = createStore(todoApp)

class TodoForm extends Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.value }
  }
  handleChange(e) {
    this.setState({ value: e.target.value })
  }
  clearValue() {
    this.setState({ value: '' })
  }
  render() {
    // let that = this
    return (
      <div>
        <input type="text" ref={node => { this.pomegranate = node }} />
        <input type="text" name="todoInput" id="todoInput" onChange={this.handleChange.bind(this)} value={this.state.value} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.pomegranate.value + ":::" + this.state.value
          }, this.clearValue.bind(this))
          this.pomegranate.value = ''
        }}>Smack!</button>
      </div>
    )
  }
}

class TodoApp extends Component {
  render() {
    return (
      <div>
        <TodoForm />
        <ul>
          {this.props.todos.map((todo) =>
            <li key={todo.id}>{todo.text}</li>
          )}
        </ul>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} />,
    document.getElementById('mockServer')
  )
}

store.subscribe(render)
render()

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
// console.log('testSendDiv')
//socket.emit('addCats', { div: '<li>leprosy is a <strong>very</strong> fine thing.</li>' })
//socket.on('sendDiv', data => {
//  console.log(data.div)
//})

// -------------- video tutorial todo hovno

const testAddTodo = () => {
  // const todo = Immutable.Map({
    // text: 'Brush a pine marten'
  // })
  // const stateBefore = Immutable.List.of()
  const stateBefore = []
  // const action = {
    // type: 'ADD_TODO',
    // text: todo.get('text')
  // }
  // const stateAfter = Immutable.List.of(Immutable.Map(todo).merge({
  //  id: 0,
  //  complete: false
  // }))
  const stateAfter = [
    {
      id: 0,
      text: 'Brush a pine marten',
      complete: false
    }
  ]
  const nextState = todos(stateBefore, { type: 'ADD_TODO', text: 'Brush a pine marten' })
  // console.log(JSON.stringify(nextState))
  expect(
    // Immutable.is(todos(stateBefore, action), stateAfter)
    nextState.text === stateAfter.text
  ).toEqual(true)
}
testAddTodo()
console.log('add a todo test passed')

const testAddAnotherTodo = () => {
  const state1 = todos([], {
    type: 'ADD_TODO',
    text: 'Kill Christian'
  })
  const state2 = todos(state1, {
    type: 'ADD_TODO',
    text: 'Brush a pine marten'
  })
  const stateAfter = [
    Immutable.Map({
      id: 0,
      text: 'Kill Christian',
      complete: false
    }),
    Immutable.Map({
      id: 1,
      text: 'Brush a pine marten',
      complete: false
    })
  ]
  console.log(state2[1].constructor.name)
  expect(
    state2[1].text
  ).toEqual(stateAfter[1].get('text'))
}
testAddAnotherTodo()
console.log('add another todo test passed')

const testToggleTodo = () => {
  const state1 = todos([], {
    type: 'ADD_TODO',
    text: 'Kill Christian'
  })
  const state2 = todos(state1, {
    type: 'ADD_TODO',
    text: 'Brush a pine marten'
  })
  const stateAfter = [
    Immutable.Map({
      id: 0,
      text: 'Kill Christian',
      complete: false
    }),
    Immutable.Map({
      id: 1,
      text: 'Brush a pine marten',
      complete: false
    })
  ]
  const toggleAction = {
    type: 'TOGGLE_TODO',
    id: 1
  }
  console.log(todos(state2, toggleAction))
  expect(
    todos(state2, toggleAction)[1].complete
  ).toEqual(true)
}
testToggleTodo()

console.log('tests passed')
