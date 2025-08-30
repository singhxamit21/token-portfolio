import { useEffect, useState } from 'react'
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

  useEffect(() => {
    let alive = true
    marketsByIds(tokens).then(d => { if (alive) setMarket(d) })
    return () => { alive = false }
  }, [tokens.join(',')])

  const total = market.reduce((acc, m) => acc + (holdings[m.id] || 0) * (m.current_price || 0), 0)

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-primary">
              <img
                src={symbolIcon}
                alt="symbol icon"
                loading="lazy"
                className="inline-block"
              />
            </div>
            <h4 className="text-2xl font-semibold text-900">
              Token Portfolio
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <PortfolioHeader market={market} />

        {/* Toolbar row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm">
              <img
                src={starIcon}
                alt="star icon"
                loading="lazy"
                className="inline-block"
              />
            </div>
            <h4 className="text-2xl font-semibold text-900">
              Watchlist
            </h4>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-muted text-sm"
              onClick={() => marketsByIds(tokens).then(setMarket)}
            >
              + Refresh Prices
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setModal(true)}
            >
              + Add Token
            </button>
          </div>
        </div>

        <WatchlistTable />
      </main>


      <AddTokenModal open={modal} onClose={() => setModal(false)} />
    </div>
  )
}
