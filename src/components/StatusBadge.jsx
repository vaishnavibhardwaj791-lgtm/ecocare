export function statusClass(status) {
  return `badge-${String(status || '').toLowerCase().replace(/\s+/g, '-')}`
}

export default function StatusBadge({ status }) {
  return <span className={`badge ${statusClass(status)}`}>{status}</span>
}
