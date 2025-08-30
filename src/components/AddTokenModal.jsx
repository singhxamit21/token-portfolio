import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTokens } from '../slices/watchlistSlice'
import { searchTokens, trendingTokens } from '../hooks/useCoinGecko'
import { Star } from 'lucide-react'

function AddTokenModal({ open, onClose }) {
  const dispatch = useDispatch()
  const existing = useSelector(s => s.watchlist.tokens)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [trend, setTrend] = useState([])
  const [selected, setSelected] = useState({})

  useEffect(() => {
    if (!open) return
    setLoading(true); setError(null)
    trendingTokens()
      .then(setTrend)
      .catch(() => setError('Failed to load trending'))
      .finally(() => setLoading(false))
  }, [open])

  useEffect(() => {
    if (!query) return setResults([])
    const timeout = setTimeout(() => {
      setLoading(true); setError(null)
      searchTokens(query)
        .then(setResults)
        .catch(() => setError('Search failed'))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  const list = useMemo(() => (query ? results : trend).filter(c => !existing.includes(c.id)), [query, results, trend, existing])

  const onSave = () => {
    const ids = Object.keys(selected).filter(id => selected[id])
    if (ids.length) dispatch(addTokens(ids))
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg md:max-w-xl card p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <input autoFocus placeholder="Search tokens..." value={query} onChange={e => setQuery(e.target.value)} className="input w-full" />
        </div>
        <div className="max-h-96 overflow-y-auto">
          <div className="px-4 pt-2 text-xs text-muted">{query ? 'Results' : 'Trending'}</div>
          {loading && <div className="p-6 text-muted text-center">Loading…</div>}
          {error && <div className="p-6 text-negative text-center">{error}</div>}
          {!loading && !error && list.map(c => {
            const isSelected = selected[c.id]
            return (
              <button key={c.id} className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3" onClick={() => setSelected(s => ({ ...s, [c.id]: !s[c.id] }))}>
                <img src={c.large || c.thumb} alt="" className="w-6 h-6 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm">{c.name} <span className="text-muted">({(c.symbol || '').toUpperCase()})</span></div>
                </div>
                {isSelected ? <Star size={14} className="text-green-500 fill-green-500" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
              </button>
            )
          })}
          {!loading && !error && list.length === 0 && <div className="p-6 text-muted text-center">No tokens</div>}
        </div>
        <div className="p-4 border-t border-white/5 flex justify-end gap-2">
          <button className="btn btn-muted" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary disabled:opacity-50" disabled={!Object.values(selected).some(Boolean)} onClick={onSave}>Add to Watchlist</button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AddTokenModal);