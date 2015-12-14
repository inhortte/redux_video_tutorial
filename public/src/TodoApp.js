import React, { Component } from 'react'

/*
 Presentation and behavior are combined because the object is not complex
*/
const AddTodo = ( props, { store } ) => {
  let pomegranate
  return (
    <div>
      <input type="text" ref={node => { pomegranate = node }} />
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          text: pomegranate.value
        })
        pomegranate.value = ''
      }}>Smack!</button>
    </div>
  )
}
AddTodo.contextTypes = {
  store: React.PropTypes.object
}

const Link = ( { active, children, onClick } ) => {
  if(active) {
    return <span style={{color: 'red'}}>{children}</span>
  } else {
    return (
      <a href="#" onClick={e => {
        e.preventDefault()
        onClick()
      }}>{children}</a>
    )
  }
}

/*
 Containers provides the data and the behavior of presentational components (ie, Link).
 They are self sufficient and return the same given the same props - purely functional.
 FilterLink changes when any part of the state changes because the store is subscribed.
*/
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const props = this.props
    const { store } = this.context
    const state = store.getState()
    return (
      <Link active={state.visibilityFilter === props.filter}
            onClick={() => store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: props.filter })}>{props.children}</Link>
    )
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
}

/*
 props contains store
*/
const FilterBuddy = () => (
  <p>
    <FilterLink filter='ALL'>Todo</FilterLink>{' '}
    <FilterLink filter='COMPLETE'>Terminado</FilterLink>{' '}
    <FilterLink filter='INCOMPLETE'>Incompleto</FilterLink>
  </p>
)

export const isVisible = (filter, t) => {
  switch(filter) {
    case 'COMPLETE':
      return t.complete
    case 'INCOMPLETE':
      return !t.complete
    case 'ALL':
    default:
      return true
  }
}

export const Todo = ( { text, complete, onClick } ) => {
  return (
    <li onClick={onClick}
    style={{cursor: 'pointer', textDecoration: complete ? 'line-through' : 'none'}}>
    {text}
    </li>
  )
}

const Todos = ( { onClick, todos } ) => (
  <ul>
    {todos.map((todo) => <Todo key={todo.id} onClick={() => onClick(todo.id)} {...todo} />)}
  </ul>
)

/*
 Another container component
*/
class TodoList extends Component {
  componentDidMount() {
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    const { store } = this.context
    const vf = store.getState().visibilityFilter
    const todos = store.getState().todos.filter(t => isVisible(vf, t))
    return (
      <Todos todos={todos}
             onClick={id => store.dispatch({ type: 'TOGGLE_TODO', id })} />
    )
  }
}
TodoList.contextTypes = {
  store: React.PropTypes.object
}

export const TodoApp = () => (
  <div>
    <FilterBuddy />
    <AddTodo />
    <TodoList />
  </div>
)

/* ---- scratch implementation (now using Provider from react-redux)
export class Provider extends Component {
  getChildContext() {
    return { store: this.props.store }
  }
  render() {
    return this.props.children
  }
}
Provider.childContextTypes = {
  store: React.PropTypes.object
}
*/
