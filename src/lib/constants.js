export const ISSUE_TYPES = [
  'Overflowing Garbage Bin',
  'Garbage on Road',
  'Missed Collection',
  'Illegal Dumping',
  'Improper Waste Segregation',
  'Other',
]

export const WASTE_TYPES = ['Dry Waste', 'Wet Waste', 'Plastic', 'E-Waste', 'Other']

export const DEPARTMENTS = [
  'Sanitation',
  'Collection Fleet',
  'Recycling Unit',
  'Ward Office',
  'Hazardous Waste Cell',
]

export const STATUS_FLOW = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved']
export const COMPLAINT_STATUSES = [...STATUS_FLOW, 'Reopened']
export const PICKUP_STATUSES = ['Pending', 'Scheduled', 'Completed']
export const PRIORITIES = ['Low', 'Medium', 'High']

export const hotspots = [
  { name: 'Green Park', level: 'high', x: 30, y: 40 },
  { name: 'MG Road', level: 'high', x: 58, y: 28 },
  { name: 'Riverside', level: 'medium', x: 44, y: 62 },
  { name: 'Campus', level: 'low', x: 22, y: 22 },
  { name: 'Old Mill', level: 'medium', x: 72, y: 54 },
  { name: 'Lakeview', level: 'low', x: 66, y: 18 },
]

export function timeAgo(date) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  const days = Math.floor(diff / 86400)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}
