export const generateColors = (count) => {
  return Array.from({ length: count }, (_, i) => 
    `hsl(${(i * 360) / count}, 70%, 55%)`
  )
}
