import { ImageOff } from 'lucide-react'

// Complaint photos are optional; show a neutral placeholder when there isn't one.
export default function ComplaintPhoto({ src, style }) {
  if (!src) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          background: '#e8f5ee',
          color: '#5b7a6a',
          borderRadius: 12,
          minHeight: 120,
          ...style,
        }}
      >
        <ImageOff size={28} />
      </div>
    )
  }
  return <img src={src} alt="Complaint photo" style={style} />
}
