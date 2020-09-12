import { createStore } from 'redux'
import Reducers from './reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

// 'Cache' Storage the moemory
const storageConfig = {
	key: 'root',
	storage: storageSession
}

const myPersistReducer = persistReducer(storageConfig, Reducers)
const store = createStore(myPersistReducer)

export const persistor = persistStore(store)
export default store
