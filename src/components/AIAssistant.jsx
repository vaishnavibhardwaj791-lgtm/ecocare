import { Bot, Send, X } from 'lucide-react'
import { useMemo, useState } from 'react'

const QUICK = [
  'Which bin should I put this waste in?',
  'Where can I recycle plastic near me?',
  'How should I dispose of an old battery?',
  'Is this wet or dry waste?',
]

function replyFor(text) {
  const q = text.toLowerCase()
  if (q.includes('battery') || q.includes('e-waste') || q.includes('phone') || q.includes('charger')) {
    return 'Old batteries, phones and chargers are e-waste / hazardous. Do not put them in household bins. Drop them at the City E-Waste Drop Point or request an e-waste pickup.'
  }
  if (q.includes('plastic')) {
    return 'Clean, dry plastic belongs in the Dry Waste / recyclables bin. Nearby options: GreenLoop Recycling Hub (1.2 km) and Campus Zero-Waste Kiosk (0.6 km).'
  }
  if (q.includes('wet') || q.includes('dry') || q.includes('bin') || q.includes('segregat')) {
    return 'Wet waste: food scraps, peels, garden waste → green/wet bin for composting. Dry waste: paper, cardboard, clean plastic, metal → blue/dry bin. Keep them unmixed so collection crews can process them.'
  }
  if (q.includes('recycle') || q.includes('near')) {
    return 'Open Find Nearby Recycling & Collection Centers to see shops by waste type. The closest mixed recycling kiosk is at City College Main Gate (0.6 km).'
  }
  return 'I can help with segregation, nearby recycling centers, batteries and pickup tips. Try: “Is leftover rice wet waste?” or “Where do I recycle glass?”'
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am the EcoWaste assistant. Ask me which bin to use, or where to recycle something nearby.' },
  ])

  const send = (text) => {
    const value = (text || input).trim()
    if (!value) return
    setMessages((prev) => [...prev, { role: 'user', text: value }, { role: 'bot', text: replyFor(value) }])
    setInput('')
  }

  const panel = useMemo(() => {
    if (!open) return null
    return (
      <div className="ai-panel">
        <div className="ai-head">
          <strong>AI Waste Assistant</strong>
          <button className="btn btn-sm" style={{ background: 'transparent', color: 'white' }} onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="ai-body">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>{m.text}</div>
          ))}
          <div className="row" style={{ marginTop: 4 }}>
            {QUICK.map((q) => (
              <button key={q} className="quick-q" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        </div>
        <form className="ai-foot" onSubmit={(e) => { e.preventDefault(); send() }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about waste..." />
          <button className="btn btn-primary btn-sm" type="submit"><Send size={14} /></button>
        </form>
      </div>
    )
  }, [open, input, messages])

  return (
    <>
      {panel}
      <button className="ai-fab" onClick={() => setOpen((v) => !v)} aria-label="Open AI assistant">
        <Bot size={24} />
      </button>
    </>
  )
}
