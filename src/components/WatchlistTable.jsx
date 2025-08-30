import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { marketsByIds } from "../hooks/useCoinGecko";
import { setHolding, removeToken, setLastUpdated } from "../slices/watchlistSlice";
import { fmtCurrency, fmtPct } from "../utils/format";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";
import editIcon from "../images/edit.svg";
import trashIcon from "../images/trash.svg";

const pageSize = 10;

export default function WatchlistTable({ onRefresh }) {
  const dispatch = useDispatch();
  const { tokens, holdings } = useSelector((s) => s.watchlist);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [market, setMarket] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const refresh = async () => {
    if (!tokens.length) {
      setMarket([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await marketsByIds(tokens);
      setMarket(data);
      dispatch(setLastUpdated(new Date().toISOString()));
      onRefresh?.(data);
    } catch (e) {
      setError("Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [tokens.join(",")]);

  const totalPages = Math.max(1, Math.ceil(tokens.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    const ids = tokens.slice(start, start + pageSize);
    return ids.map((id) => market.find((m) => m.id === id)).filter(Boolean);
  }, [page, tokens, market]);

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left table-th">
              <th className="cell">Token</th>
              <th className="cell">Price</th>
              <th className="cell">24h %</th>
              <th className="cell">Sparkline (7d)</th>
              <th className="cell">Holdings</th>
              <th className="cell">Value</th>
              <th className="cell"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="cell text-center text-muted">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="7" className="cell text-center text-negative">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && current.map((m) => {
              const amount = holdings[m.id] || 0;
              const value = amount * (m.current_price || 0);
              const pct = m.price_change_percentage_24h;

              return (
                <tr
                  key={m.id}
                  className="border-t border-white/5 hover:bg-white/5 relative"
                >
                  <td className="cell">
                    <div className="flex items-center gap-2">
                      <img src={m.image} className="w-6 h-6 rounded-full" />
                      <div className="flex flex-col">
                        <span>{m.name}</span>
                        <span className="text-xs text-muted">{m.symbol?.toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="cell">{fmtCurrency(m.current_price, 2)}</td>
                  <td className={`cell ${pct >= 0 ? "text-positive" : "text-negative"}`}>
                    {fmtPct(pct, 2)}
                  </td>
                  <td className="cell" style={{ minWidth: 120 }}>
                    <div className="h-8 w-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={(m.sparkline_in_7d?.price || []).map((y, i) => ({ i, y }))}>
                          <Line type="monotone" dataKey="y" dot={false} strokeWidth={1.5} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>

                  {/* Holdings Cell */}
                  <td className="cell">
                    {editingId === m.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input w-28"
                          defaultValue={amount}
                          id={`holding-input-${m.id}`}
                          onInput={(e) => {
                            if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10);
                          }}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            const input = document.getElementById(`holding-input-${m.id}`);
                            dispatch(setHolding({ id: m.id, amount: input.value }));
                            setEditingId(null);
                          }}
                        >
                          Save
                        </button>
                        <button className="btn btn-muted" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span>{amount}</span>
                    )}
                  </td>

                  <td className="cell">{fmtCurrency(value, 2)}</td>

                  {/* Menu */}
                  <td className="cell text-right relative">
                    <button
                      ref={buttonRef}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
                      onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                      title="More"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuId === m.id && (
                      <div
                        ref={menuRef}
                        className="absolute top-1/2 right-full -translate-y-1/2 w-40 bg-bg border border-white/10 rounded-lg shadow-lg z-50"
                      >
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-white/10"
                          onClick={() => {
                            setEditingId(m.id);
                            setMenuId(null);
                          }}
                        >
                          <img src={editIcon} alt="edit icon" loading="lazy" className="w-4 h-4" />
                          <span>Edit Holding</span>
                        </button>
                        <div className="border-t border-white/10"></div>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-white/10 text-red-500"
                          onClick={() => {
                            dispatch(removeToken(m.id));
                            setMenuId(null);
                          }}
                        >
                          <img src={trashIcon} alt="remove icon" loading="lazy" className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && !error && current.length === 0 && (
              <tr>
                <td colSpan="7" className="cell text-center text-muted">
                  Your watchlist is empty. Add tokens to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 text-xs text-muted flex items-center justify-between border-t border-white/5">
        <div>
          1 — {Math.min(tokens.length, page * pageSize)} of {tokens.length} results
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-muted" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </button>
          <span>{page} of {totalPages} pages</span>
          <button className="btn btn-muted" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
