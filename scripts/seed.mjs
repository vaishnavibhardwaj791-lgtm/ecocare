// Seeds MongoDB with demo users, complaints, pickups, centers and notifications.
// Usage: npm run seed   (reads MONGODB_URI from .env.local)
// WARNING: clears the EcoWaste collections before inserting.
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Center from '../src/models/Center.js'
import Complaint from '../src/models/Complaint.js'
import Counter from '../src/models/Counter.js'
import Notification from '../src/models/Notification.js'
import Pickup from '../src/models/Pickup.js'
import User from '../src/models/User.js'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set. Create .env.local (see .env.example).')
  process.exit(1)
}

// ---------- Demo accounts (plain passwords are only here; the DB stores bcrypt hashes) ----------
const USERS = [
  { name: 'Admin Team', email: 'admin@ecowaste.app', password: 'admin123', role: 'admin', area: 'City HQ', phone: '+91 90000 00001' },
  { name: 'Operations Desk', email: 'ops@ecowaste.app', password: 'ops12345', role: 'admin', area: 'Ward Office', phone: '+91 90000 00002' },
  { name: 'Aarav Mehta', email: 'citizen@ecowaste.app', password: 'citizen123', role: 'citizen', area: 'Ward 12', phone: '+91 90000 11223' },
  { name: 'Priya Sharma', email: 'priya@ecowaste.app', password: 'priya123', role: 'citizen', area: 'Ward 4', phone: '+91 90000 22334' },
  { name: 'Rahul Iyer', email: 'rahul@ecowaste.app', password: 'rahul123', role: 'citizen', area: 'Ward 9', phone: '+91 90000 33445' },
  { name: 'Neha Kapoor', email: 'neha@ecowaste.app', password: 'neha123', role: 'citizen', area: 'Ward 3', phone: '+91 90000 44556' },
  { name: 'Vikram Singh', email: 'vikram@ecowaste.app', password: 'vikram123', role: 'citizen', area: 'Ward 11', phone: '+91 90000 55667' },
]

const PHOTOS = {
  bin: 'https://images.unsplash.com/photo-1611284446314-60a74ac6a437?w=800&q=80',
  missed: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  dumping: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80',
  segregation: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=800&q=80',
  road: 'https://images.unsplash.com/photo-1595278069441-2cf29f0d0a1b?w=800&q=80',
}

const DAY = 86400000
const daysAgo = (n) => new Date(Date.now() - n * DAY)
const ymd = (d) => d.toISOString().slice(0, 10)

// Recent complaints (dates relative to today so the demo always looks fresh).
const COMPLAINTS = [
  { code: 'CMP-1048', email: 'citizen@ecowaste.app', category: 'Overflowing Garbage Bin', location: 'Green Park Market, Ward 12', landmark: 'Opposite Metro Gate 2', ago: 2, status: 'In Progress', priority: 'High', department: 'Sanitation', description: 'The community bin near the vegetable market has been overflowing for two days and attracting stray animals.', photo: PHOTOS.bin },
  { code: 'CMP-1042', email: 'citizen@ecowaste.app', category: 'Missed Collection', location: 'Lakeview Society, Block B, Ward 12', landmark: 'Near clubhouse', ago: 5, status: 'Resolved', priority: 'Medium', department: 'Collection Fleet', description: 'Door-to-door wet waste collection was missed on Monday and Tuesday.', photo: PHOTOS.missed },
  { code: 'CMP-1036', email: 'citizen@ecowaste.app', category: 'Illegal Dumping', location: 'Riverside Walk, Ward 7', landmark: 'Behind the walking track', ago: 8, status: 'Assigned', priority: 'High', department: 'Ward Office', description: 'Construction debris dumped beside the public walking path.', photo: PHOTOS.dumping },
  { code: 'CMP-1029', email: 'citizen@ecowaste.app', category: 'Improper Waste Segregation', location: 'Campus Canteen, City College, Ward 12', landmark: 'West food court', ago: 12, status: 'Under Review', priority: 'Low', department: 'Recycling Unit', description: 'Wet and dry waste mixed in the same bins after lunch hours.', photo: PHOTOS.segregation },
  { code: 'CMP-1011', email: 'priya@ecowaste.app', category: 'Garbage on Road', location: 'MG Road Junction, Ward 4', landmark: 'Near traffic signal', ago: 3, status: 'Submitted', priority: 'High', department: '', description: 'Loose garbage scattered after last night’s market.', photo: PHOTOS.road },
  { code: 'CMP-1008', email: 'rahul@ecowaste.app', category: 'Overflowing Garbage Bin', location: 'Sunrise Apartments, Ward 9', landmark: 'Tower 3 parking', ago: 10, status: 'Resolved', priority: 'Medium', department: 'Sanitation', description: 'Society dumpster overflowing over the weekend.', photo: PHOTOS.bin },
  { code: 'CMP-1004', email: 'neha@ecowaste.app', category: 'Illegal Dumping', location: 'Old Mill Road, Ward 3', landmark: 'Vacant plot 14', ago: 14, status: 'In Progress', priority: 'High', department: 'Ward Office', description: 'Repeated dumping of household waste on vacant land.', photo: PHOTOS.dumping },
  { code: 'CMP-0998', email: 'vikram@ecowaste.app', category: 'Missed Collection', location: 'Harmony Residency, Ward 11', landmark: 'Gate 1', ago: 16, status: 'Reopened', priority: 'Medium', department: 'Collection Fleet', description: 'Pickup truck skipped the society again after a previous complaint.', photo: PHOTOS.missed },
]

// Older, mostly-resolved history spread across the previous five months for the analytics charts.
function historicalComplaints() {
  let seed = 42
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const templates = [
    ['Overflowing Garbage Bin', 'Community bin overflowing before the scheduled pickup.', PHOTOS.bin, 'Sanitation'],
    ['Garbage on Road', 'Garbage bags torn open and scattered on the road.', PHOTOS.road, 'Sanitation'],
    ['Missed Collection', 'Collection vehicle did not arrive on the scheduled day.', PHOTOS.missed, 'Collection Fleet'],
    ['Illegal Dumping', 'Waste dumped in an open plot overnight.', PHOTOS.dumping, 'Ward Office'],
    ['Improper Waste Segregation', 'Mixed waste found in the dry-waste bins.', PHOTOS.segregation, 'Recycling Unit'],
  ]
  const places = ['Green Park Market, Ward 12', 'MG Road Junction, Ward 4', 'Riverside Walk, Ward 7', 'Old Mill Road, Ward 3', 'Sunrise Apartments, Ward 9', 'Harmony Residency, Ward 11', 'Lakeview Society, Ward 12', 'Station Road, Ward 4']
  const citizens = USERS.filter((u) => u.role === 'citizen').map((u) => u.email)
  const perMonth = [9, 12, 10, 14, 16] // 5..1 months ago
  const list = []
  let n = 900
  perMonth.forEach((count, idx) => {
    const monthsAgo = 5 - idx
    for (let i = 0; i < count; i++) {
      const [category, description, photo, department] = pick(templates)
      const ago = monthsAgo * 30 + Math.floor(rand() * 28)
      list.push({
        code: `CMP-${String(n++).padStart(4, '0')}`,
        email: pick(citizens),
        category,
        location: pick(places),
        landmark: '',
        ago,
        status: rand() < 0.8 ? 'Resolved' : 'In Progress',
        priority: pick(['Low', 'Medium', 'High']),
        department,
        description,
        photo,
      })
    }
  })
  return list
}

const PICKUPS = [
  { code: 'PKP-220', email: 'citizen@ecowaste.app', wasteType: 'E-Waste', quantity: '8 kg', address: '12B Lakeview Society, Ward 12', inDays: 2, time: '10:00 AM – 12:00 PM', notes: 'Old laptop, charger and two batteries.', status: 'Pending' },
  { code: 'PKP-214', email: 'citizen@ecowaste.app', wasteType: 'Plastic', quantity: '12 kg', address: '12B Lakeview Society, Ward 12', inDays: -9, time: '08:00 AM – 10:00 AM', notes: 'Clean bottles and containers.', status: 'Completed' },
  { code: 'PKP-208', email: 'priya@ecowaste.app', wasteType: 'Wet Waste', quantity: '20 kg', address: 'City College Hostel, Block C', inDays: 1, time: '08:00 AM – 10:00 AM', notes: 'Canteen leftover collection.', status: 'Scheduled' },
  { code: 'PKP-201', email: 'rahul@ecowaste.app', wasteType: 'Dry Waste', quantity: '15 kg', address: 'Sunrise Apartments, Ward 9', inDays: 0, time: '04:00 PM – 06:00 PM', notes: '', status: 'Pending' },
]

const CENTERS = [
  { code: 'CTR-01', name: 'GreenLoop Recycling Hub', types: ['Plastic', 'Paper', 'Mixed Recyclables'], address: '42 Eco Street, Ward 12', distance: '1.2 km', phone: '+91 98450 11220', hours: '8:00 AM – 7:00 PM', x: 28, y: 42 },
  { code: 'CTR-02', name: 'City E-Waste Drop Point', types: ['E-Waste'], address: 'Tech Park Annex, Ward 8', distance: '2.8 km', phone: '+91 98450 33441', hours: '10:00 AM – 6:00 PM', x: 62, y: 30 },
  { code: 'CTR-03', name: 'Paper & Glass Collective', types: ['Paper', 'Glass'], address: 'Old Market Lane, Ward 4', distance: '3.4 km', phone: '+91 98450 77882', hours: '9:00 AM – 5:00 PM', x: 48, y: 68 },
  { code: 'CTR-04', name: 'Metal Recovery Yard', types: ['Metal'], address: 'Industrial Road, Ward 3', distance: '5.1 km', phone: '+91 98450 90901', hours: '8:30 AM – 4:30 PM', x: 74, y: 58 },
  { code: 'CTR-05', name: 'Campus Zero-Waste Kiosk', types: ['Plastic', 'Paper', 'E-Waste', 'Mixed Recyclables'], address: 'City College Main Gate', distance: '0.6 km', phone: '+91 98450 22119', hours: '9:00 AM – 8:00 PM', x: 36, y: 22 },
]

const hoursAgo = (h) => new Date(Date.now() - h * 3600000)
const NOTIFICATIONS = [
  { audience: 'user', userEmail: 'citizen@ecowaste.app', title: 'Pickup scheduled', body: 'Your e-waste pickup PKP-220 has been received and will be confirmed shortly.', at: hoursAgo(2), unread: true },
  { audience: 'user', userEmail: 'citizen@ecowaste.app', title: 'Complaint update', body: 'CMP-1048 moved to In Progress. A sanitation crew is assigned.', at: hoursAgo(26), unread: true },
  { audience: 'user', userEmail: 'citizen@ecowaste.app', title: 'Issue resolved', body: 'CMP-1042 (Missed Collection) has been marked resolved.', at: hoursAgo(96), unread: false },
  { audience: 'admin', title: 'New complaint', body: 'CMP-1011 — Garbage on Road at MG Road Junction needs assignment.', at: hoursAgo(0.6), unread: true },
  { audience: 'admin', title: 'Hotspot alert', body: 'Ward 12 recorded the most complaints this week.', at: hoursAgo(3), unread: true },
  { audience: 'admin', title: 'Pickup backlog', body: 'Pickup requests are still pending confirmation.', at: hoursAgo(27), unread: false },
]

// Build through Mongoose (validation + defaults), then insert raw so our createdAt values are kept.
async function insertRaw(Model, docs) {
  const objs = []
  for (const data of docs) {
    const doc = new Model(data)
    await doc.validate()
    objs.push(doc.toObject({ depopulate: true, versionKey: false, transform: false }))
  }
  if (objs.length) await Model.collection.insertMany(objs)
}

async function main() {
  await mongoose.connect(uri)
  console.log(`Connected to ${mongoose.connection.name}`)

  await Promise.all([User, Complaint, Pickup, Center, Notification, Counter].map((M) => M.deleteMany({})))
  await Promise.all([User, Complaint, Pickup, Center].map((M) => M.syncIndexes()))

  const users = await User.insertMany(
    await Promise.all(USERS.map(async ({ password, ...u }) => ({ ...u, password: await bcrypt.hash(password, 10) }))),
  )
  const byEmail = Object.fromEntries(users.map((u) => [u.email, u]))

  const complaints = [...COMPLAINTS, ...historicalComplaints()].map(({ email, ago, ...c }) => {
    const created = daysAgo(ago)
    return { ...c, user: byEmail[email]._id, citizen: byEmail[email].name, citizenEmail: email, date: ymd(created), createdAt: created, updatedAt: created }
  })
  await insertRaw(Complaint, complaints)

  await insertRaw(
    Pickup,
    PICKUPS.map(({ email, inDays, ...p }, i) => {
      const created = daysAgo(3 + i * 2)
      return { ...p, user: byEmail[email]._id, citizen: byEmail[email].name, citizenEmail: email, date: ymd(new Date(Date.now() + inDays * DAY)), createdAt: created, updatedAt: created }
    }),
  )

  await insertRaw(Center, CENTERS.map((c, i) => ({ ...c, createdAt: daysAgo(60 - i), updatedAt: daysAgo(60 - i) })))
  await insertRaw(Notification, NOTIFICATIONS.map(({ at, ...n }) => ({ ...n, createdAt: at, updatedAt: at })))

  // Continue numbering after the seeded ids.
  await Counter.insertMany([
    { _id: 'CMP', seq: 1048 },
    { _id: 'PKP', seq: 220 },
    { _id: 'CTR', seq: 5 },
  ])

  console.log(`Seeded ${users.length} users, ${complaints.length} complaints, ${PICKUPS.length} pickups, ${CENTERS.length} centers, ${NOTIFICATIONS.length} notifications.\n`)
  console.log('Demo logins:')
  console.table(USERS.map(({ email, password, role }) => ({ role, email, password })))
  await mongoose.disconnect()
}

main().catch(async (err) => {
  console.error('Seed failed:', err.message)
  await mongoose.disconnect()
  process.exit(1)
})
