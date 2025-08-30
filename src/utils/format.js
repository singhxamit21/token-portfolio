export function fmtCurrency(num, decimals = 2) {
  if (num == null) return "-";
  return `$${Number(num).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}


export function fmtPct(num, decimals = 2) {
  if (num == null) return "-";
  return `${Number(num).toFixed(decimals)}%`;
}
