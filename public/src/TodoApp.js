const store = require('./todoApp').store
import React, { Component } from 'react'

export class TodoForm extends Component {
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

export const FilterLink = ( { filter, current, children } ) => {
  if(current === filter) {
    return <span style={{color: 'red'}}>{children}</span>
  } else {
    return (
      <a href="#" onClick={e => {
        e.preventDefault()
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: filter
          })
      }}
      style={{color: 'black'}}>{children}</a>
    )
  }
}

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

export const TodoList = ( { onTodoClick, todos, visibilityFilter } ) => {
  return (
    <ul>
    {todos.filter(t => isVisible(visibilityFilter, t)).map((todo) =>
      <Todo key={todo.id} onClick={() => onTodoClick(todo.id)} {...todo} />
    )}
    </ul>
  )
}

export class TodoApp extends Component {
  constructor(props) {
    super(props)
    // this.store = props.store
  }

  onTodoClick(id) {
    store.dispatch({ type: 'TOGGLE_TODO', id: id })
  }

  render() {
    const { visibilityFilter } = this.props
    return (
      <div>
      <p>
      <FilterLink filter={'ALL'} text={'Todo'} current={visibilityFilter}>Todo</FilterLink>{' '}
      <FilterLink filter={'COMPLETE'} text={'Terminado'} current={visibilityFilter}>Terminado</FilterLink>{' '}
      <FilterLink filter={'INCOMPLETE'} text={'Incompleto'} current={visibilityFilter}>Incompleto</FilterLink>
      </p>
      <TodoForm />
      <TodoList onTodoClick={id => store.dispatch({ type: 'TOGGLE_TODO', id: id })} {...this.props} />
      </div>
    )
  }
}
