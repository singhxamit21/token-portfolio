import axios from 'axios'
const API = 'https://api.coingecko.com/api/v3'

export async function searchTokens(query) {
  const { data } = await axios.get(`${API}/search`, { params: { query } })
  return data.coins || []
}

export async function trendingTokens() {
  const { data } = await axios.get(`${API}/search/trending`)
  return (data.coins || []).map(c => c.item)
}

export async function marketsByIds(ids) {
  if (!ids?.length) return []
  const { data } = await axios.get(`${API}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      ids: ids.join(','),
      sparkline: true,
      price_change_percentage: '24h'
    }
  })
  return data
}
