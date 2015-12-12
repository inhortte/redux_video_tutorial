const store = require('./todoApp').store
import React, { Component } from 'react'

const AddTodo = ( { onAddClick } ) => {
  let pomegranate
  return (
    <div>
      <input type="text" ref={node => { pomegranate = node }} />
      <button onClick={() => {
        onAddClick(pomegranate.value)
        pomegranate.value = ''
      }}>Smack!</button>
    </div>
  )
}

export const FilterLink = ( { filter, current, children, filterLinkClick } ) => {
  if(current === filter) {
    return <span style={{color: 'red'}}>{children}</span>
  } else {
    return (
      <a href="#" onClick={e => {
        e.preventDefault()
        filterLinkClick(filter)
      }}
      style={{color: 'black'}}>{children}</a>
    )
  }
}

const FilterBuddy = ( { visibilityFilter, filterLinkClick } ) => (
  <p>
    <FilterLink filter={'ALL'} text={'Todo'} current={visibilityFilter} filterLinkClick={filterLinkClick} >Todo</FilterLink>{' '}
  <FilterLink filter={'COMPLETE'} text={'Terminado'} current={visibilityFilter} filterLinkClick={filterLinkClick}>Terminado</FilterLink>{' '}
  <FilterLink filter={'INCOMPLETE'} text={'Incompleto'} current={visibilityFilter} filterLinkClick={filterLinkClick}>Incompleto</FilterLink>
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

export const TodoList = ( { onTodoClick, todos, visibilityFilter } ) => {
  return (
    <ul>
      {todos.filter(t => isVisible(visibilityFilter, t)).map((todo) =>
        <Todo key={todo.id} onClick={() => onTodoClick(todo.id)} {...todo} />
      )}
    </ul>
  )
}

/*
export class TodoApp extends Component {
  constructor(props) {
    super(props)
    // this.store = props.store
  }

  onTodoClick(id) {
    store.dispatch({ type: 'TOGGLE_TODO', id: id })
  }

  onAddClick(inputValue) {
    store.dispatch({ type: 'ADD_TODO', text: inputValue })
  }

  filterLinkClick(filter) {
    store.dispatch({
      type: 'SET_VISIBILITY_FILTER',
      filter: filter
    })
  }

  render() {
    const { visibilityFilter } = this.props
    return (
      <div>
        <FilterBuddy visibilityFilter={visibilityFilter} filterLinkClick={this.filterLinkClick} />
        <AddTodo onAddClick={this.onAddClick} />
        <TodoList onTodoClick={id => store.dispatch({ type: 'TOGGLE_TODO', id: id })} {...this.props} />
      </div>
    )
  }
}
*/

export const TodoApp = ( props ) => (
  <div>
    <FilterBuddy visibilityFilter={props.visibilityFilter}
                 filterLinkClick={filter => store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: filter })} />
    <AddTodo onAddClick={inputValue => store.dispatch({ type: 'ADD_TODO', text: inputValue })} />
    <TodoList onTodoClick={id => store.dispatch({ type: 'TOGGLE_TODO', id: id })} {...props} />
  </div>
)
