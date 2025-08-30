import { configureStore } from '@reduxjs/toolkit'
import watchlistReducer from '../slices/watchlistSlice'

const PERSIST_KEY = 'tp_state_v1'

const preloaded = (() => {
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return undefined
    return JSON.parse(raw)
  } catch { return undefined }
})()

const store = configureStore({
  reducer: { watchlist: watchlistReducer },
  preloadedState: preloaded
})

store.subscribe(() => {
  const state = store.getState()
  const toPersist = {
    watchlist: {
      tokens: state.watchlist.tokens,
      holdings: state.watchlist.holdings
    }
  }
  localStorage.setItem(PERSIST_KEY, JSON.stringify(toPersist))
})

export default store
