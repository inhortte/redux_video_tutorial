import Immutable from 'immutable'

// --- reimplementing createStore

export const createStore = (reducer) => {
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

// ---------------------------------------------------------------------

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
    case 'RESET':
      return []
    default:
      return state
  }
}

const visibilityFilter = (state = 'ALL', action) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    case 'RESET':
      return 'ALL'
    default:
      return state
  }
}

export const todoApp = combineReducers({
  todos,
  visibilityFilter
})

// export const store = createStore(todoApp)
