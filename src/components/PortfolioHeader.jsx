import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { fmtCurrency } from '../utils/format'
import { generateColors } from '../utility'

function PortfolioHeader({ market }) {
  const { holdings, lastUpdated } = useSelector(s => s.watchlist)

  const { total, chartData } = useMemo(() => {
    let total = 0
    const rows = (market || []).map((m) => {
      const value = (holdings[m.id] || 0) * (m.current_price || 0)
      total += value
      return { name: m.name, symbol: m.symbol?.toUpperCase(), value }
    }).filter(r => r.value > 0)

    const colors = generateColors(rows.length)
    const coloredRows = rows.map((r, i) => ({ ...r, color: colors[i] }))

    return { total, chartData: coloredRows }
  }, [market, holdings])

  return (
    <div className="card p-4 md:p-6 grid md:grid-cols-2 gap-6">

      <div className="flex flex-col justify-between">
        <div>
          <div className="text-xs text-muted tracking-wide">Portfolio Total</div>
          <div className="text-3xl md:text-5xl font-semibold mt-2">{fmtCurrency(total)}</div>
        </div>
        <div className="text-xs text-muted mt-4 md:mt-8">
          Last updated: {lastUpdated ? dayjs(lastUpdated).format('h:mm:ss A') : '—'}
        </div>
      </div>


      <div className="flex flex-col">
        <div className="text-xs text-muted tracking-wide mb-2">Portfolio Total</div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <div className="flex-1 h-52 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="symbol"
                  innerRadius="40%"
                  outerRadius="90%"
                  paddingAngle={0}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`c-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `$${new Intl.NumberFormat().format(value.toFixed(2))}`,
                    props.payload.symbol
                  ]}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>


          <ul className="flex-1 space-y-2 text-sm w-full">
            {chartData.map((d, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
                  <span className="font-medium" style={{ color: d.color }}>{d.name}</span>
                  <span className="text-muted" style={{ color: d.color }}>({d.symbol})</span>
                </div>
                <span className="text-muted">{((d.value / Math.max(total, 1)) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default React.memo(PortfolioHeader);