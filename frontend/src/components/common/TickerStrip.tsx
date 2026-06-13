interface TickerStripProps { items: string[] }

export default function TickerStrip({ items }: TickerStripProps) {
  const doubled = [...items, ...items]
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">◆ {item}</span>
        ))}
      </div>
    </div>
  )
}
