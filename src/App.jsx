import { useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import AddTokenModal from './components/AddTokenModal'
import PortfolioHeader from './components/PortfolioHeader'
import WalletConnect from './components/WalletConnect'
import WatchlistTable from './components/WatchlistTable'
import { marketsByIds } from './hooks/useCoinGecko'
import symbolIcon from "./images/symbol.svg";
import starIcon from "./images/star.svg";

export default function App() {
  const [modal, setModal] = useState(false)
  const { tokens, holdings } = useSelector(s => s.watchlist)
  const [market, setMarket] = useState([])
  const marketCache = useRef({})

  const refreshMarket = async () => {
    if (!tokens.length) {
      setMarket([])
      return
    }
    const idsToFetch = tokens.filter(t => !marketCache.current[t])
    if (idsToFetch.length) {
      const data = await marketsByIds(idsToFetch)
      data.forEach(d => marketCache.current[d.id] = d)
    }
    setMarket(tokens.map(t => marketCache.current[t]))
  }

  useEffect(() => {
    refreshMarket()
  }, [tokens.join(',')])

  const total = useMemo(() =>
    market.reduce((acc, m) => acc + (holdings[m.id] || 0) * (m.current_price || 0), 0),
    [market, holdings]
  )

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
        <div className="w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-primary flex-shrink-0">
              <img src={symbolIcon} alt="symbol icon" loading="lazy" className="inline-block" />
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-900">Token Portfolio</h4>
          </div>
          <div className="flex items-center gap-2">
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6 space-y-6">
        <PortfolioHeader market={market} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm flex-shrink-0">
              <img src={starIcon} alt="star icon" loading="lazy" className="inline-block" />
            </div>
            <h4 className="text-xl sm:text-2xl font-semibold text-900">Watchlist</h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-muted text-sm" onClick={refreshMarket}>
              + Refresh Prices
            </button>
            <button className="btn btn-primary" onClick={() => setModal(true)}>
              + Add Token
            </button>
          </div>
        </div>

        <WatchlistTable market={market} onRefresh={refreshMarket} />
      </main>

      <AddTokenModal open={modal} onClose={() => setModal(false)} />
    </div>
  )
}
