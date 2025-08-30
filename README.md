# Token Portfolio (Vite + React + Redux + Wagmi)

Pixel-accurate portfolio dashboard inspired by the provided Figma. Uses CoinGecko for search, trending, prices, 24h%, and 7d sparkline. State (watchlist + holdings) is persisted to localStorage.

## Run locally

```bash
npm i
npm run dev
```

## Notes
- RainbowKit + wagmi integrated; replace `projectId` in `src/wallet.js` with your WalletConnect Cloud ID.
- Holdings are editable; Value and Portfolio Total update based on CoinGecko prices.
- Add Token modal supports Search and Trending. Selected tokens are added to Redux + persisted.
- Responsive layout matches desktop and mobile screens from the Figma.
- Simple remove action via row menu icon.
- Loading/empty/error states included.
- Performance: small components, memoization, and on-demand fetching.
