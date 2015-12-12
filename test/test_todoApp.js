const store = require('../public/src/todoApp').store
import { expect } from 'chai'

describe('todoApp', () => {
  describe('default state', () => {
    let state
    beforeEach('get the state of the store', () => {
      state = store.getState()
    })
    it('should have a blank object as the todos part of the state', () => {
      expect(Object.keys(state.todos).length).to.equal(0)
    })

    it('should have a visibilityFilter of ALL', () => {
      expect(state.visibilityFilter === 'ALL')
    })
  })

  describe('add a todo', () => {
    let text, resultantState
    beforeEach('set up the expected state', () => {
      store.dispatch({ type: 'RESET' })
      text = 'Brush a pine marten'
      resultantState = [
        { id: 0, text: text, complete: false }
      ]
    })

    it('should add a single todo', () => {
      store.dispatch({ type: 'ADD_TODO', text: text })
      expect(store.getState().todos[0].id).to.equal(resultantState[0].id)
      expect(store.getState().todos[0].text).to.equal(resultantState[0].text)
      expect(store.getState().todos[0].complete).to.be.false
    })
  })

  describe('add another todo and then flip the completed flag', () => {
    let text1, text2, resultantState
    beforeEach('set up the expected state', () => {
      store.dispatch({ type: 'RESET' })
      text1 = 'Brush a pine marten'
      text2 = 'Kill Christian'
      resultantState = [
        { id: 0, text: text1, complete: false },
        { id: 1, text: text2, complete: false }
      ]
    })

    it('should add two todos', () => {
      store.dispatch({ type: 'ADD_TODO', text: text1 })
      store.dispatch({ type: 'ADD_TODO', text: text2 })
      expect(store.getState().todos[1].id).to.equal(resultantState[1].id)
      expect(store.getState().todos[1].text).to.equal(resultantState[1].text)
      expect(store.getState().todos[1].complete).to.be.false
    })

    it('should add two todos then change the complete flag of the second to true', () => {
      store.dispatch({ type: 'ADD_TODO', text: text1 })
      store.dispatch({ type: 'ADD_TODO', text: text2 })
      store.dispatch({ type: 'TOGGLE_TODO', id: 1 })
      expect(store.getState().todos[1].complete).to.be.true
    })
  })
})
