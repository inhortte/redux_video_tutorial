import { expect } from 'chai'
import * as james from '../public/server/james.js'

describe('snippet', () => {
  describe('SET_SNIPPET', () => {
    it('sets the state to a html snippet', () => {
      let snip = '<div><div><span>thurk?</span> <p>Quien soy?</p></div></div>'
      james.store.dispatch({
        type: 'SET_SNIPPET',
        snip: snip
      })
      expect(james.store.getState().snippet).to.equal(snip)
    })
  })
})

describe('categories', () => {
  describe('GET_ONE_CATEGORY', () => {
    it('returns a one element array', () => {
      james.store.dispatch({
        type: 'GET_ONE_CATEGORY'
      })
      expect(james.store.getState().categories.length).to.equal(1)
    })

    it('returns a string within the array', () => {
      james.store.dispatch({
        type: 'GET_ONE_CATEGORY'
      })
      expect(james.store.getState().categories[0]).to.be.a('string')
    })
  })

  describe('GET_TWO_CATEGORIES', () => {
    it('returns a two element array', () => {
      james.store.dispatch({
        type: 'GET_TWO_CATEGORIES'
      })
      expect(james.store.getState().categories.length).to.equal(2)
    })

    it('returns two strings', () => {
      james.store.dispatch({
        type: 'GET_TWO_CATEGORIES'
      })
      expect(james.store.getState().categories.reduce((truth, s) => {
        return truth && typeof s === 'string'
      }, true)).to.be.true
    })
  })
})
