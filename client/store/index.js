import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import notes from './notes'
import {editor} from './editorBlocks'

const reducer = combineReducers({
  notes,
  user,
  editor
})
const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    createLogger({
      collapsed: true
    })
  )
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './notes'
export * from './editorBlocks'
