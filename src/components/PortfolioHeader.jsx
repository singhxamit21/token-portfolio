import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { fmtCurrency } from '../utils/format'
import { generateColors } from '../utility'


export default function PortfolioHeader({ market }) {
  const { holdings, lastUpdated } = useSelector(s => s.watchlist)

  const { total, chartData } = useMemo(() => {
    let total = 0
    const rows = (market || []).map((m, i) => {
      const value = (holdings[m.id] || 0) * (m.current_price || 0)
      total += value
      return {
        name: m.name,
        symbol: m.symbol?.toUpperCase(),
        value
      }
    }).filter(r => r.value > 0)

    // assign unique colors
    const colors = generateColors(rows.length)
    const coloredRows = rows.map((r, i) => ({ ...r, color: colors[i] }))

    return { total, chartData: coloredRows }
  }, [market, holdings])

  return (
   <div className="card p-6 grid md:grid-cols-2">
  {/* Left Section - Portfolio Total */}
  <div className="flex flex-col justify-between pr-6">
    <div>
      <div className="text-xs text-muted tracking-wide">Portfolio Total</div>
      <div className="text-4xl md:text-5xl font-semibold mt-2">
        {fmtCurrency(total)}
      </div>
    </div>
    <div className="text-xs text-muted mt-8">
      Last updated: {lastUpdated ? dayjs(lastUpdated).format('h:mm:ss A') : '—'}
    </div>
  </div>

  {/* Right Section - Allocation */}
  <div className="flex flex-col pl-6">
    <div className="text-xs text-muted tracking-wide mb-2">Portfolio Total</div>
    <div className="flex flex-1 gap-6 items-center">
      {/* Pie Chart */}
      <div className="flex-1 h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="symbol"
              innerRadius="40%"
              outerRadius="90%"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`c-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, n, p) => [`$${v.toFixed(2)}`, p.payload.symbol]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <ul className="flex-1 space-y-2 text-sm">
        {chartData.map((d, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: d.color }}
              ></span>
              <span className="font-medium" style={{ color: d.color }}>
                {d.name}
              </span>
              <span className="text-muted" style={{ color: d.color }}>
                ({d.symbol})
              </span>
            </div>
            <span className="text-muted">
              {((d.value / Math.max(total, 1)) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

  )
}
