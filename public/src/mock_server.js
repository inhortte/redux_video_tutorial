const { createStore, todoApp } = require('./todoApp')
const { TodoApp, Provider } = require('./TodoApp')
import Immutable from 'immutable'
import $ from 'jquery'
import React from 'react'
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

const render = () => {
  ReactDOM.render(
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
    document.getElementById('mockServer')
  )
}

// store.subscribe(render)
render()

// -------------- vdna tests

/*
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
*/

// -------------- video tutorial todo hovno
