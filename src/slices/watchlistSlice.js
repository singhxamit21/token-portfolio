import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tokens: [],           // array of CoinGecko IDs
  holdings: {},         // { [id]: number }
  lastUpdated: null
}

const slice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setTokens(state, { payload }) { state.tokens = payload },
    addTokens(state, { payload }) {
      for (const id of payload) if (!state.tokens.includes(id)) state.tokens.push(id)
    },
    removeToken(state, { payload }) {
      state.tokens = state.tokens.filter(id => id !== payload)
      delete state.holdings[payload]
    },
    setHolding(state, { payload: { id, amount } }) {
      state.holdings[id] = Number(amount) || 0
    },
    setLastUpdated(state, { payload }) { state.lastUpdated = payload }
  }
})

export const { setTokens, addTokens, removeToken, setHolding, setLastUpdated } = slice.actions
export default slice.reducer
