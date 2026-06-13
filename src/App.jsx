import { useState, useEffect, useRef } from 'react'
import './index.css'

// ─── SVG Icons (inline, matching original) ───────────────────────────────────
const WrenchIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)
const SunIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
)
const ArrowRightIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const ShieldCheckIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)
const LockIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const LeafIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const PiggyBankIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/>
    <path d="M16 10h.01"/><path d="M2 8v1a2 2 0 0 0 2 2h1"/>
  </svg>
)
const ShieldAlertIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="M12 8v4"/><path d="M12 16h.01"/>
  </svg>
)
const ScaleIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
)
const BadgeCheckIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)
const SparklesIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>
  </svg>
)
const CpuIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/>
    <path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/>
    <path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/>
    <path d="M7 20v2"/><path d="M7 2v2"/>
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>
  </svg>
)
const MapPinIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
const NavigationIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
)
const SearchIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>
  </svg>
)
const TriangleAlertIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
)
const RecycleIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
    <path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/>
    <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
  </svg>
)
const ZapIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
)
const ChevronRightIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)
const StarIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className} aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)
const PhoneIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const LeafIcon2 = LeafIcon
const GlobeIcon = ({className=''}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
  </svg>
)

// ─── AI Diagnosis mock data ───────────────────────────────────────────────────
const DIAGNOSES = {
  Phone: { cause: 'Battery degradation or charging port damage', confidence: 87, priceMin: 800, priceMax: 2500, redFlags: ['Asking for full board replacement', 'No warranty on parts'] },
  Laptop: { cause: 'Thermal paste dried out or fan failure', confidence: 82, priceMin: 1200, priceMax: 4500, redFlags: ['Quote above ₹5,000 without diagnosis', 'Replacing SSD unnecessarily'] },
  TV: { cause: 'Backlight failure or power board issue', confidence: 79, priceMin: 1500, priceMax: 6000, redFlags: ['Recommending panel replacement for backlight issue'] },
  AC: { cause: 'Refrigerant leak or compressor fault', confidence: 75, priceMin: 1800, priceMax: 8000, redFlags: ['Claiming gas refill needs board replacement'] },
  Refrigerator: { cause: 'Compressor or thermostat failure', confidence: 80, priceMin: 2000, priceMax: 9000, redFlags: ['Replacing compressor without checking thermostat first'] },
  'Washing Machine': { cause: 'Motor brush wear or PCB fault', confidence: 78, priceMin: 1000, priceMax: 5000, redFlags: ['Full drum replacement suggestion'] },
  Bike: { cause: 'Carburetor clog or ignition coil fault', confidence: 85, priceMin: 500, priceMax: 3000, redFlags: ['Suggesting engine overhaul for minor issues'] },
  Car: { cause: 'Alternator or starter motor failure', confidence: 81, priceMin: 3000, priceMax: 15000, redFlags: ['No breakdown of parts vs labour cost'] },
  Fan: { cause: 'Capacitor failure or winding issue', confidence: 90, priceMin: 150, priceMax: 600, redFlags: ['Full motor replacement for capacitor issue'] },
  Microwave: { cause: 'Magnetron or high voltage diode failure', confidence: 77, priceMin: 500, priceMax: 2500, redFlags: ['Replacing magnetron without diode test'] },
}

// ─── Mock shops ──────────────────────────────────────────────────────────────
const MOCK_SHOPS = [
  { id:1, name:'TechFix Express', address:'12 Brigade Road, MG Road, Bengaluru', distance:'0.8 km', rating:4.7, reviews:312, open:true, hours:'9am–8pm', phone:'+91 98450 12345', specialty:'Mobile, Laptop' },
  { id:2, name:'Rapid Repairs Hub', address:'45 SP Road, Shivajinagar, Bengaluru', distance:'1.4 km', rating:4.5, reviews:198, open:true, hours:'10am–7pm', phone:'+91 80123 45678', specialty:'All Electronics' },
  { id:3, name:'ElectroCare Solutions', address:'78 Residency Road, Bengaluru', distance:'2.1 km', rating:4.3, reviews:145, open:false, hours:'9am–6pm', phone:'+91 91234 56789', specialty:'AC, Refrigerator' },
  { id:4, name:'SmartPhone Clinic', address:'23 Commercial Street, Bengaluru', distance:'2.9 km', rating:4.8, reviews:421, open:true, hours:'9am–9pm', phone:'+91 99870 11223', specialty:'Mobile, Tablet' },
  { id:5, name:'ApplianCare Works', address:'56 Indiranagar 100 Feet Rd, Bengaluru', distance:'3.6 km', rating:4.2, reviews:87, open:true, hours:'10am–6pm', phone:'+91 77009 88776', specialty:'Washing Machine, AC' },
  { id:6, name:'QuickFix Point', address:'34 Koramangala 5th Block, Bengaluru', distance:'4.2 km', rating:4.6, reviews:234, open:false, hours:'8am–7pm', phone:'+91 88001 22334', specialty:'All Devices' },
]

const TESTIMONIALS = [
  { name:'Priya M.', city:'Bengaluru', text:'I was about to buy a new ₹45,000 laptop. RepairRadar told me it was just a battery — fixed for ₹2,800. Game changer.', device:'Dell Inspiron', saved:'₹42,200', rating:5 },
  { name:'Rahul K.', city:'Mumbai', text:'The AI correctly diagnosed my AC compressor issue and gave me a price range. The shop tried to charge 3x — I showed them the estimate and they came down instantly.', device:'Voltas 1.5T AC', saved:'₹8,000', rating:5 },
  { name:'Anjali S.', city:'Pune', text:'Found a verified shop 900m away with 4.8 stars. Done in 2 hours. The "Nearby Shops" feature alone is worth everything.', device:'Samsung S21', saved:'₹12,000', rating:5 },
]

// ─── Repair vs Replace logic ──────────────────────────────────────────────────
function getRecommendation(age, repairCost, newPrice) {
  const ratio = repairCost / newPrice
  const ageScore = age / 15
  const score = ratio * 0.7 + ageScore * 0.3
  if (score < 0.35) return { label: 'Repair', color: 'var(--accent)', msg: "Still worth fixing — but get a second quote to be sure." }
  if (score < 0.6) return { label: 'Consider', color: '#f59e0b', msg: "It's borderline — weigh the repair warranty against a new unit's lifespan." }
  return { label: 'Replace', color: '#ef4444', msg: "Cost of repair approaches replacement. Time for an upgrade." }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Nav scroll
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // AI Advisor
  const [device, setDevice] = useState('Phone')
  const [problem, setProblem] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)
  const [diagLoading, setDiagLoading] = useState(false)

  function runDiagnosis() {
    if (!problem.trim()) return
    setDiagLoading(true)
    setDiagnosis(null)
    setTimeout(() => {
      setDiagnosis(DIAGNOSES[device] || DIAGNOSES['Phone'])
      setDiagLoading(false)
    }, 1800)
  }

  // Repair vs Replace
  const [age, setAge] = useState(3)
  const [repairCost, setRepairCost] = useState(4500)
  const [newPrice, setNewPrice] = useState(15000)
  const rec = getRecommendation(age, repairCost, newPrice)
  const saved = Math.max(0, newPrice - repairCost)
  const co2 = Math.round(newPrice * 0.007)

  // Shops
  const shopCategories = ['Mobile phone','Laptop','AC','Refrigerator','Washing machine','TV','Bike','Car']
  const [activeShopCat, setActiveShopCat] = useState('Mobile phone')
  const [shopsState, setShopsState] = useState('idle') // idle | locating | loading | found | error
  const [shopsError, setShopsError] = useState('')
  const [realShops, setRealShops] = useState([])
  const [userCoords, setUserCoords] = useState(null)
  const [userCity, setUserCity] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Haversine distance in km
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  // Build a display name from OSM tags
  function shopName(tags) {
    return tags.name || tags['name:en'] || tags.brand || 'Repair Shop'
  }
  function shopAddress(tags) {
    const parts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city'] || tags['addr:town'] || tags['addr:village']].filter(Boolean)
    return parts.length ? parts.join(', ') : tags.description || 'Address not listed'
  }
  function shopPhone(tags) {
    return tags.phone || tags['contact:phone'] || tags.mobile || ''
  }
  function shopHours(tags) {
    return tags.opening_hours || ''
  }
  function shopWebsite(tags) {
    return tags.website || tags['contact:website'] || ''
  }
  function isOpen(tags) {
    // crude heuristic: if opening_hours has "Mo-Sa" or "24/7", assume open
    const oh = (tags.opening_hours || '').toLowerCase()
    if (oh.includes('24/7')) return true
    if (!oh) return null // unknown
    const now = new Date()
    const h = now.getHours()
    // most shops open 9-20
    if (h >= 9 && h < 20) return true
    return false
  }

  async function fetchShopsFromOverpass(lat, lon, radiusM = 8000) {
    const query = `
[out:json][timeout:25];
(
  node["shop"="electronics"](around:${radiusM},${lat},${lon});
  node["craft"="electronics_repair"](around:${radiusM},${lat},${lon});
  node["shop"="mobile_phone"](around:${radiusM},${lat},${lon});
  node["repair"="electronics"](around:${radiusM},${lat},${lon});
  node["shop"="computer"](around:${radiusM},${lat},${lon});
  node["amenity"="telephone"](around:${radiusM},${lat},${lon});
  way["shop"="electronics"](around:${radiusM},${lat},${lon});
  way["craft"="electronics_repair"](around:${radiusM},${lat},${lon});
  way["shop"="mobile_phone"](around:${radiusM},${lat},${lon});
);
out body center;
    `.trim()

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    ]

    for (const url of endpoints) {
      try {
        const res = await fetch(url, { method:'POST', body: 'data=' + encodeURIComponent(query), headers:{'Content-Type':'application/x-www-form-urlencoded'} })
        if (!res.ok) continue
        const json = await res.json()
        const elements = json.elements || []
        const shops = elements
          .map(el => {
            const elLat = el.lat ?? el.center?.lat
            const elLon = el.lon ?? el.center?.lon
            if (!elLat || !elLon) return null
            const dist = haversine(lat, lon, elLat, elLon)
            return {
              id: el.id,
              name: shopName(el.tags),
              address: shopAddress(el.tags),
              distance: dist < 1 ? `${Math.round(dist*1000)} m` : `${dist.toFixed(1)} km`,
              distRaw: dist,
              phone: shopPhone(el.tags),
              hours: shopHours(el.tags),
              website: shopWebsite(el.tags),
              openStatus: isOpen(el.tags),
              type: el.tags.shop || el.tags.craft || el.tags.repair || 'Electronics',
              lat: elLat,
              lon: elLon,
            }
          })
          .filter(Boolean)
          .sort((a,b) => a.distRaw - b.distRaw)
          .slice(0, 12)
        return shops
      } catch(_) { continue }
    }
    return []
  }

  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      const json = await res.json()
      return json.address?.suburb || json.address?.city_district || json.address?.city || json.address?.town || json.address?.village || ''
    } catch { return '' }
  }

  async function searchByCity(cityName) {
    try {
      setShopsState('loading')
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`)
      const json = await res.json()
      if (!json.length) { setShopsError('City not found. Try a different name or pincode.'); setShopsState('error'); return }
      const { lat, lon } = json[0]
      const shops = await fetchShopsFromOverpass(parseFloat(lat), parseFloat(lon))
      setRealShops(shops)
      setUserCity(cityName)
      setShopsState(shops.length ? 'found' : 'empty')
    } catch(e) {
      setShopsError('Search failed. Please try again.')
      setShopsState('error')
    }
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setShopsError('Geolocation is not supported by your browser.')
      setShopsState('error')
      return
    }
    setShopsState('locating')
    setShopsError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        setUserCoords({ lat, lon })
        setShopsState('loading')
        const [city, shops] = await Promise.all([
          reverseGeocode(lat, lon),
          fetchShopsFromOverpass(lat, lon)
        ])
        setUserCity(city)
        setRealShops(shops)
        setShopsState(shops.length ? 'found' : 'empty')
      },
      (err) => {
        const msgs = { 1:'Location access denied. Please allow location in your browser settings.', 2:'Location unavailable. Try searching by city.', 3:'Location request timed out.' }
        setShopsError(msgs[err.code] || 'Could not get location.')
        setShopsState('error')
      },
      { timeout: 15000, maximumAge: 60000 }
    )
  }

  // Device chips
  const devices = ['Phone','Laptop','TV','AC','Refrigerator','Washing Machine','Bike','Car','Fan','Microwave']

  return (
    <div className="App" style={{background:'var(--bg)', color:'var(--text)', minHeight:'100vh', fontFamily:'Inter, system-ui, sans-serif'}}>
      <main style={{position:'relative'}}>

        {/* ── HEADER ── */}
        <header style={{
          position:'fixed', top:0, left:0, right:0, zIndex:50,
          transition:'all 0.3s',
          background: scrolled ? 'rgba(10,13,12,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <nav style={{maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px'}}>
            <a href="#" style={{display:'flex', alignItems:'center', gap:10}}>
              <span style={{width:36, height:36, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <WrenchIcon className="" style={{width:20, height:20, color:'#0a0d0c'}} />
              </span>
              <span style={{fontSize:20, fontFamily:'Fraunces, serif', fontWeight:500, letterSpacing:'-0.02em'}}>RepairRadar</span>
            </a>
            <div style={{display:'flex', alignItems:'center', gap:36}}>
              {[['AI Advisor','advisor'],['Repair vs Replace','calculator'],['Shops','shops'],['Features','features']].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)}
                  style={{fontSize:14.5, color:'var(--muted)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', transition:'color 0.2s'}}
                  onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--muted)'}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <button aria-label="Toggle theme" style={{
                width:36, height:36, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center', background:'transparent',
                cursor:'pointer', transition:'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
                <SunIcon style={{width:16, height:16, color:'var(--muted)'}} />
              </button>
              <button className="btn-primary" style={{padding:'9px 18px', fontSize:14}} onClick={() => scrollTo('advisor')}>Get started</button>
            </div>
          </nav>
        </header>

        {/* ── HERO ── */}
        <section id="hero" className="hero-grid noise" style={{position:'relative', paddingTop:144, paddingBottom:112, overflow:'hidden'}}>
          <div style={{position:'absolute', top:-160, left:-160, width:600, height:600, borderRadius:'50%', background:'radial-gradient(closest-side, rgba(195,255,61,0.08), transparent)', pointerEvents:'none'}} />
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center', position:'relative'}}>
            
            {/* Left */}
            <div className="fade-in">
              <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:9999, border:'1px solid rgba(255,255,255,0.1)', marginBottom:28}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 8px var(--accent-glow)'}} />
                <span className="font-mono-ui" style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--muted)'}}>AI-Powered Repair Intelligence</span>
              </div>
              <h1 className="font-serif" style={{fontSize:64, lineHeight:0.95, letterSpacing:'-0.03em'}}>
                <span style={{display:'block'}}>Fix first.</span>
                <span style={{display:'block'}}><em style={{fontStyle:'italic', fontWeight:400, color:'rgba(255,255,255,0.85)'}}>Replace</em> last<span style={{color:'var(--accent)'}}>.</span></span>
              </h1>
              <p style={{marginTop:28, fontSize:17, lineHeight:1.625, color:'var(--muted)', maxWidth:520}}>
                Why spend <span style={{color:'#fff', fontWeight:500}}>₹10,000</span> on a replacement when a <span style={{color:'#fff', fontWeight:500}}>₹2,000</span> repair solves it? Compare prices, find trusted shops, and stop getting overcharged.
              </p>
              <div style={{marginTop:36, display:'flex', flexWrap:'wrap', gap:12}}>
                <button className="btn-primary" onClick={() => scrollTo('advisor')}>Diagnose with AI <ArrowRightIcon style={{width:16, height:16}} /></button>
                <button className="btn-ghost" onClick={() => scrollTo('calculator')}>Repair or replace?</button>
              </div>
              <div style={{marginTop:36, display:'flex', flexWrap:'wrap', alignItems:'center', gap:'12px 28px'}}>
                {[
                  [ShieldCheckIcon, 'Verified shops'],
                  [LockIcon, 'Price-protected'],
                  [LeafIcon, 'Planet-positive'],
                ].map(([Icon, text]) => (
                  <div key={text} style={{display:'flex', alignItems:'center', gap:8, fontSize:12.5, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--muted)'}}>
                    <Icon style={{width:14, height:14, color:'var(--accent)'}} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – hero card */}
            <div style={{position:'relative'}}>
              <div className="rounded-2xl overflow-hidden glow" style={{border:'1px solid rgba(255,255,255,0.1)'}}>
                <img
                  src="https://images.unsplash.com/photo-1721332154191-ba5f1534266e?w=900&q=80"
                  alt="Repair workbench"
                  style={{width:'100%', height:440, objectFit:'cover', display:'block'}}
                />
                <div style={{position:'absolute', inset:0, background:'linear-gradient(rgba(0,0,0,0) 30%, rgba(10,13,12,0.85) 100%)'}} />
                <div style={{position:'absolute', top:16, left:16, right:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span className="font-mono-ui" style={{fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', padding:'6px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)'}}>Sample diagnosis</span>
                  <span className="font-mono-ui" style={{fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--accent)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', padding:'6px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)'}}>● Live</span>
                </div>
                <div style={{position:'absolute', left:16, right:16, bottom:16, padding:20, borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(15,20,19,0.85)', backdropFilter:'blur(10px)'}}>
                  <div className="font-serif" style={{fontSize:20, marginBottom:16}}>iPhone 13 — won't charge</div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
                    {[['Cost','₹800–1,500','#fff'],['Time','2 hrs','#fff'],['Conf.','92%','var(--accent)']].map(([label,val,col]) => (
                      <div key={label}>
                        <div className="label-mono">{label}</div>
                        <div style={{marginTop:4, fontSize:15, fontWeight:500, color:col}}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{padding:'80px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:40}}>
            {[['1.2M+','Repairs compared'],['₹84 Cr','Money saved'],['12,400','Verified shops'],['97%','Successful repairs']].map(([num, label]) => (
              <div key={label}>
                <div className="font-serif" style={{fontSize:52, lineHeight:1, letterSpacing:'-0.02em'}}>{num}</div>
                <div className="label-mono" style={{marginTop:12}}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY REPAIRRADAR ── */}
        <section style={{padding:'96px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px'}}>
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Why RepairRadar</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em', maxWidth:820, margin:'0 auto'}}>Built to put repair power<br />back in your hands.</h2>
            </div>
            <div style={{marginTop:64, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20}}>
              {[
                [PiggyBankIcon, 'Save Money', 'Average user saves ₹4,200 per repair by comparing local shop prices first.'],
                [ShieldAlertIcon, 'Avoid Scams', 'Overcharge detector flags quotes above local market averages instantly.'],
                [ScaleIcon, 'Compare Prices', 'Side-by-side comparison of distance, price, warranty and shop ratings.'],
                [BadgeCheckIcon, 'Trusted Experts', 'Every shop verified, every review real, every warranty tracked.'],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="card card-hover" style={{padding:24}}>
                  <div style={{width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(195,255,61,0.06)'}}>
                    <Icon style={{width:20, height:20, color:'var(--accent)'}} />
                  </div>
                  <div className="font-serif" style={{marginTop:20, fontSize:22, letterSpacing:'-0.02em'}}>{title}</div>
                  <p style={{marginTop:8, fontSize:14.5, lineHeight:1.625, color:'var(--muted)'}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI ADVISOR ── */}
        <section id="advisor" style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:56}}>
            {/* Left */}
            <div>
              <div className="eyebrow" style={{marginBottom:20}}><span className="dot" />AI Repair Advisor</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em'}}>Describe the problem. Get a diagnosis in seconds.</h2>
              <p style={{marginTop:24, fontSize:16, color:'var(--muted)', lineHeight:1.625, maxWidth:480}}>Our AI has been trained on thousands of repair cases across phones, appliances, and vehicles. Get instant insight into likely cause, fair price range, and whether you should DIY or call a pro.</p>
              <ul style={{marginTop:32, display:'flex', flexDirection:'column', gap:14}}>
                {['Cause analysis & confidence score','Realistic price range (INR)','DIY vs professional recommendation','Red flags to watch out for'].map(item => (
                  <li key={item} style={{display:'flex', alignItems:'center', gap:12, fontSize:15}}>
                    <SparklesIcon style={{width:16, height:16, flexShrink:0, color:'var(--accent)'}} />
                    <span style={{color:'rgba(255,255,255,0.9)'}}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right – form */}
            <div className="card glow" style={{padding:28}}>
              <div className="label-mono" style={{marginBottom:12}}>Device</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                {devices.map(d => (
                  <button key={d} className={`chip ${device===d?'active':''}`} onClick={() => { setDevice(d); setDiagnosis(null) }}>{d}</button>
                ))}
              </div>
              <div className="label-mono" style={{marginTop:28, marginBottom:8}}>Problem description</div>
              <textarea
                value={problem}
                onChange={e => setProblem(e.target.value)}
                placeholder="e.g. Screen flickers when I tilt it, sometimes goes black for a few seconds..."
                rows={5}
                style={{
                  width:'100%', background:'transparent', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)',
                  padding:'14px 16px', fontSize:14.5, color:'var(--text)', fontFamily:'inherit',
                  outline:'none', resize:'none', transition:'border-color 0.2s',
                  lineHeight:1.5,
                }}
                onFocus={e => e.target.style.borderColor='rgba(195,255,61,0.5)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
              />
              <button className="btn-primary" onClick={runDiagnosis} disabled={diagLoading}
                style={{marginTop:16, width:'100%', justifyContent:'center', opacity: diagLoading ? 0.8 : 1}}>
                {diagLoading
                  ? <><span className="animate-spin" style={{width:16, height:16, border:'2px solid rgba(0,0,0,0.3)', borderTopColor:'#0a0d0c', borderRadius:'50%', display:'inline-block'}} /> Analysing...</>
                  : <><CpuIcon style={{width:16, height:16}} /> Get AI diagnosis</>
                }
              </button>

              {/* Diagnosis result */}
              {diagnosis && (
                <div style={{marginTop:20, padding:20, borderRadius:12, border:'1px solid rgba(195,255,61,0.25)', background:'rgba(195,255,61,0.04)'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
                    <div className="label-mono">Diagnosis Result</div>
                    <div style={{fontSize:13, fontFamily:'JetBrains Mono, monospace', color:'var(--accent)', background:'rgba(195,255,61,0.12)', padding:'2px 10px', borderRadius:9999}}>
                      {diagnosis.confidence}% confidence
                    </div>
                  </div>
                  <p style={{fontSize:15, color:'rgba(255,255,255,0.9)', lineHeight:1.5, marginBottom:16}}><strong>Likely cause:</strong> {diagnosis.cause}</p>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16}}>
                    <div style={{padding:12, borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                      <div className="label-mono">Est. Repair Cost</div>
                      <div className="font-serif" style={{fontSize:22, marginTop:4}}>₹{diagnosis.priceMin.toLocaleString()}–{diagnosis.priceMax.toLocaleString()}</div>
                    </div>
                    <div style={{padding:12, borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>
                      <div className="label-mono">Recommendation</div>
                      <div style={{fontSize:14, marginTop:4, color:'var(--accent)', fontWeight:500}}>Hire a Pro</div>
                    </div>
                  </div>
                  <div style={{marginTop:4}}>
                    <div className="label-mono" style={{marginBottom:8}}>Red flags to watch for</div>
                    {diagnosis.redFlags.map(flag => (
                      <div key={flag} style={{display:'flex', alignItems:'flex-start', gap:8, marginBottom:6}}>
                        <TriangleAlertIcon style={{width:14, height:14, color:'#f59e0b', flexShrink:0, marginTop:1}} />
                        <span style={{fontSize:13.5, color:'var(--muted)'}}>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── REPAIR VS REPLACE ── */}
        <section id="calculator" className="noise" style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)', position:'relative'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px'}}>
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Repair vs Replace</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em'}}>Make the smart<br />call in 10 seconds.</h2>
            </div>
            <div style={{marginTop:56, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
              {/* Left – sliders */}
              <div className="card" style={{padding:32}}>
                {[
                  {label:'Product age', val:`${age} years`, min:0, max:15, step:1, value:age, onChange:e=>setAge(+e.target.value)},
                  {label:'Repair quote (₹)', val:`₹${repairCost.toLocaleString()}`, min:100, max:50000, step:100, value:repairCost, onChange:e=>setRepairCost(+e.target.value)},
                  {label:'New product price (₹)', val:`₹${newPrice.toLocaleString()}`, min:1000, max:150000, step:500, value:newPrice, onChange:e=>setNewPrice(+e.target.value)},
                ].map((s, i) => (
                  <div key={s.label}>
                    {i > 0 && <div className="divider" style={{margin:'28px 0'}} />}
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
                      <span className="label-mono">{s.label}</span>
                      <span className="font-serif" style={{fontSize:24, letterSpacing:'-0.02em'}}>{s.val}</span>
                    </div>
                    <input type="range" className="rr-range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={s.onChange} />
                  </div>
                ))}
              </div>
              {/* Right – result */}
              <div className="card" style={{padding:32, display:'flex', flexDirection:'column'}}>
                <div className="label-mono">Recommendation</div>
                <div className="font-serif" style={{fontSize:80, lineHeight:0.95, letterSpacing:'-0.03em', marginTop:8, color: rec.color}}>{rec.label}</div>
                <p style={{marginTop:12, fontSize:15.5, color:'var(--muted)', lineHeight:1.625}}>{rec.msg}</p>
                <div style={{marginTop:'auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, paddingTop:32}}>
                  <div style={{borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', padding:16, background:'rgba(255,255,255,0.02)'}}>
                    <div className="label-mono">You save</div>
                    <div className="font-serif" style={{fontSize:28, marginTop:4, letterSpacing:'-0.02em'}}>₹{saved.toLocaleString()}</div>
                  </div>
                  <div style={{borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', padding:16, background:'rgba(255,255,255,0.02)'}}>
                    <div className="label-mono">CO₂ avoided</div>
                    <div className="font-serif" style={{fontSize:28, marginTop:4, letterSpacing:'-0.02em'}}>{co2} kg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEARBY SHOPS ── */}
        <section id="shops" style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px'}}>
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Nearby Shops · Live</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em'}}>Real shops. Real<br />addresses. Real ratings.</h2>
            </div>

            {/* Filter + buttons */}
            <div style={{marginTop:48, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16}}>
              <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                {shopCategories.map(cat => (
                  <button key={cat} className={`chip ${activeShopCat===cat?'active':''}`} onClick={() => setActiveShopCat(cat)}>{cat}</button>
                ))}
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <button className="btn-ghost" style={{padding:'10px 16px', fontSize:14}} onClick={() => setShowSearch(s => !s)}>
                  <SearchIcon style={{width:16, height:16}} /> Search city
                </button>
                <button className="btn-primary" style={{padding:'10px 18px', fontSize:14}} onClick={useMyLocation}>
                  <NavigationIcon style={{width:16, height:16}} /> Use my location
                </button>
              </div>
            </div>

            {/* Search bar */}
            {showSearch && (
              <div style={{marginTop:16, display:'flex', gap:8}}>
                <input
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  placeholder="Enter city name or pincode..."
                  style={{flex:1, background:'var(--card)', border:'1px solid var(--border-2)', borderRadius:12, padding:'12px 16px', fontSize:14.5, color:'var(--text)', fontFamily:'inherit', outline:'none'}}
                  onFocus={e => e.target.style.borderColor='rgba(195,255,61,0.5)'}
                  onBlur={e => e.target.style.borderColor='var(--border-2)'}
                  onKeyDown={e => e.key==='Enter' && searchCity.trim() && searchByCity(searchCity.trim())}
                />
                <button className="btn-primary" style={{padding:'12px 24px'}} onClick={() => searchCity.trim() && searchByCity(searchCity.trim())}>Search</button>
              </div>
            )}

            {/* Shop list area */}
            <div style={{marginTop:24}}>

              {/* IDLE */}
              {shopsState === 'idle' && (
                <div className="card" style={{padding:48, textAlign:'center'}}>
                  <MapPinIcon style={{width:36, height:36, margin:'0 auto', color:'var(--accent)'}} />
                  <h3 className="font-serif" style={{fontSize:28, marginTop:16}}>Find verified shops nearby</h3>
                  <p style={{fontSize:15, color:'var(--muted)', marginTop:12, maxWidth:560, margin:'12px auto 0', lineHeight:1.625}}>
                    Allow location access to see real repair shops within 8 km — sorted by distance, with addresses, hours, and phone numbers. You can also search by city or pincode.
                  </p>
                  <div style={{marginTop:20, display:'flex', justifyContent:'center', gap:8}}>
                    <button className="btn-primary" style={{padding:'10px 18px', fontSize:13}} onClick={useMyLocation}>
                      <NavigationIcon style={{width:16, height:16}} /> Use my location
                    </button>
                    <button className="btn-ghost" style={{padding:'10px 18px', fontSize:13}} onClick={() => setShowSearch(true)}>
                      <SearchIcon style={{width:16, height:16}} /> Search by city
                    </button>
                  </div>
                </div>
              )}

              {/* LOCATING */}
              {shopsState === 'locating' && (
                <div className="card" style={{padding:48, textAlign:'center'}}>
                  <div className="animate-spin" style={{width:36, height:36, border:'3px solid rgba(195,255,61,0.2)', borderTopColor:'var(--accent)', borderRadius:'50%', margin:'0 auto'}} />
                  <p style={{marginTop:16, color:'var(--muted)', fontSize:15}}>Getting your location…</p>
                  <p style={{marginTop:6, color:'var(--muted-2)', fontSize:13}}>Please allow location access in your browser popup.</p>
                </div>
              )}

              {/* LOADING */}
              {shopsState === 'loading' && (
                <div className="card" style={{padding:48, textAlign:'center'}}>
                  <div className="animate-spin" style={{width:36, height:36, border:'3px solid rgba(195,255,61,0.2)', borderTopColor:'var(--accent)', borderRadius:'50%', margin:'0 auto'}} />
                  <p style={{marginTop:16, color:'var(--muted)', fontSize:15}}>Searching for repair shops{userCity ? ` near ${userCity}` : ''} via OpenStreetMap…</p>
                </div>
              )}

              {/* ERROR */}
              {shopsState === 'error' && (
                <div className="card" style={{padding:40, textAlign:'center'}}>
                  <TriangleAlertIcon style={{width:32, height:32, margin:'0 auto', color:'#f59e0b'}} />
                  <p style={{marginTop:12, fontSize:15, color:'rgba(255,255,255,0.8)', fontWeight:500}}>{shopsError}</p>
                  <div style={{marginTop:16, display:'flex', justifyContent:'center', gap:8}}>
                    <button className="btn-primary" style={{padding:'10px 18px', fontSize:13}} onClick={useMyLocation}>
                      <NavigationIcon style={{width:16, height:16}} /> Try again
                    </button>
                    <button className="btn-ghost" style={{padding:'10px 18px', fontSize:13}} onClick={() => setShowSearch(true)}>
                      <SearchIcon style={{width:16, height:16}} /> Search by city
                    </button>
                  </div>
                </div>
              )}

              {/* NO RESULTS */}
              {shopsState === 'empty' && (
                <div className="card" style={{padding:48, textAlign:'center'}}>
                  <MapPinIcon style={{width:36, height:36, margin:'0 auto', color:'var(--muted)'}} />
                  <h3 className="font-serif" style={{fontSize:24, marginTop:16, color:'var(--muted)'}}>No shops found nearby</h3>
                  <p style={{fontSize:14, color:'var(--muted-2)', marginTop:8}}>No electronics repair shops found within 8 km. Try searching a different city.</p>
                  <button className="btn-ghost" style={{marginTop:16, padding:'10px 18px', fontSize:13}} onClick={() => setShowSearch(true)}>
                    <SearchIcon style={{width:16, height:16}} /> Search different city
                  </button>
                </div>
              )}

              {/* RESULTS */}
              {shopsState === 'found' && (
                <>
                  <div style={{marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <p style={{fontSize:14, color:'var(--muted)'}}>Found <strong style={{color:'var(--accent)'}}>{realShops.length}</strong> repair shops{userCity ? ` near ${userCity}` : ''} · sorted by distance</p>
                    <button className="btn-ghost" style={{padding:'6px 14px', fontSize:12}} onClick={() => setShopsState('idle')}>
                      Reset
                    </button>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
                    {realShops.map((shop, i) => (
                      <div key={shop.id ?? i} className="card card-hover" style={{padding:20}}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{fontSize:15, fontWeight:600, lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{shop.name}</div>
                            <div style={{fontSize:12, color:'var(--muted)', marginTop:2, textTransform:'capitalize'}}>{shop.type.replace('_',' ')}</div>
                          </div>
                          {shop.openStatus !== null && (
                            <span style={{fontSize:11, fontFamily:'JetBrains Mono, monospace', padding:'3px 8px', borderRadius:9999, background: shop.openStatus ? 'rgba(195,255,61,0.12)' : 'rgba(255,255,255,0.05)', color: shop.openStatus ? 'var(--accent)' : 'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', flexShrink:0, marginLeft:8}}>
                              {shop.openStatus ? 'Open' : 'Closed'}
                            </span>
                          )}
                        </div>

                        {/* Address */}
                        <div style={{display:'flex', alignItems:'flex-start', gap:5, fontSize:13, color:'var(--muted)', marginBottom:8, lineHeight:1.4}}>
                          <MapPinIcon style={{width:12, height:12, flexShrink:0, marginTop:1, strokeWidth:2}} />
                          <span>{shop.address}</span>
                        </div>

                        {/* Hours */}
                        {shop.hours && (
                          <div style={{fontSize:12, color:'var(--muted-2)', marginBottom:6}}>
                            🕐 {shop.hours.length > 40 ? shop.hours.slice(0,40)+'…' : shop.hours}
                          </div>
                        )}

                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                          <span style={{fontSize:13, color:'var(--accent)', fontWeight:600}}>{shop.distance}</span>
                          <div style={{display:'flex', gap:8}}>
                            {shop.phone && (
                              <a href={`tel:${shop.phone}`}
                                style={{display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--muted)', textDecoration:'none', padding:'4px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', transition:'all 0.2s'}}
                                onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(195,255,61,0.3)' }}
                                onMouseLeave={e => { e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}>
                                <PhoneIcon style={{width:12, height:12}} /> Call
                              </a>
                            )}
                            <a href={`https://www.openstreetmap.org/?mlat=${shop.lat}&mlon=${shop.lon}&zoom=18`} target="_blank" rel="noreferrer"
                              style={{display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--muted)', textDecoration:'none', padding:'4px 8px', borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', transition:'all 0.2s'}}
                              onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(195,255,61,0.3)' }}
                              onMouseLeave={e => { e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}>
                              <MapPinIcon style={{width:12, height:12, strokeWidth:2}} /> Map
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Overcharge banner */}
            <div style={{marginTop:24, padding:20, borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(195,255,61,0.04)', display:'flex', alignItems:'flex-start', gap:12}}>
              <TriangleAlertIcon style={{width:20, height:20, marginTop:2, flexShrink:0, color:'var(--accent)'}} />
              <div>
                <div style={{fontSize:15, fontWeight:500}}>Overcharge detector active</div>
                <div style={{fontSize:13.5, color:'var(--muted)', marginTop:2}}>Get a quote, then compare it against the AI Advisor's estimated range above to spot inflated pricing.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px'}}>
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Every tool you need</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em'}}>One platform.<br />Six superpowers.</h2>
            </div>
            <div style={{marginTop:56, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
              {[
                [RecycleIcon, 'Repair vs Replace Calculator', 'Get a data-backed verdict in 10 seconds.'],
                [TriangleAlertIcon, 'Overcharge Detector', 'Flags any quote above local market averages.'],
                [ShieldCheckIcon, 'Warranty Comparison', 'See verified warranty terms side by side.'],
                [BadgeCheckIcon, 'Digital Repair Passport', 'Complete service history for every device.'],
                [ZapIcon, 'Emergency Repairs', 'Fastest available technicians, dispatched now.'],
                [SparklesIcon, 'Community Price Database', 'Crowdsourced real prices from real users.'],
              ].map(([Icon, title, desc]) => (
                <a key={title} href="#" className="card card-hover" style={{padding:28, display:'block', textDecoration:'none'}}>
                  <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
                    <div style={{width:44, height:44, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(195,255,61,0.06)'}}>
                      <Icon style={{width:20, height:20, color:'var(--accent)'}} />
                    </div>
                    <ChevronRightIcon style={{width:16, height:16, color:'var(--muted-2)', transition:'all 0.2s'}} />
                  </div>
                  <div className="font-serif" style={{marginTop:28, fontSize:24, letterSpacing:'-0.02em'}}>{title}</div>
                  <p style={{marginTop:8, fontSize:14.5, lineHeight:1.625, color:'var(--muted)'}}>{desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px'}}>
            <div style={{textAlign:'center'}}>
              <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Real stories</div>
              <h2 className="font-serif" style={{fontSize:44, lineHeight:1.05, letterSpacing:'-0.02em'}}>People who stopped<br />buying, started fixing.</h2>
            </div>
            <div style={{marginTop:56, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="card" style={{padding:28}}>
                  <div style={{display:'flex', gap:2, marginBottom:16}}>
                    {Array.from({length:t.rating}).map((_,i) => <StarIcon key={i} style={{width:15, height:15, color:'#f59e0b'}} />)}
                  </div>
                  <p style={{fontSize:15, lineHeight:1.625, color:'rgba(255,255,255,0.85)', marginBottom:24}}>"{t.text}"</p>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                    <div>
                      <div style={{fontSize:15, fontWeight:600}}>{t.name}</div>
                      <div style={{fontSize:13, color:'var(--muted)', marginTop:2}}>{t.city} · {t.device}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div className="label-mono">Saved</div>
                      <div className="font-serif" style={{fontSize:22, color:'var(--accent)', marginTop:2}}>{t.saved}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="noise" style={{padding:'112px 0', borderTop:'1px solid rgba(255,255,255,0.05)', position:'relative'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px', textAlign:'center'}}>
            <div className="eyebrow" style={{marginBottom:20, justifyContent:'center'}}><span className="dot" />Start saving today</div>
            <h2 className="font-serif" style={{fontSize:52, lineHeight:1.02, letterSpacing:'-0.03em', maxWidth:700, margin:'0 auto'}}>Stop overpaying.<br />Start repairing smart.</h2>
            <p style={{marginTop:24, fontSize:17, color:'var(--muted)', lineHeight:1.625, maxWidth:520, margin:'24px auto 0'}}>Join 1.2M+ Indians who compare prices, avoid scams, and extend the life of their devices.</p>
            <div style={{marginTop:36, display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap'}}>
              <button className="btn-primary" onClick={() => scrollTo('advisor')}>Diagnose with AI <ArrowRightIcon style={{width:16, height:16}} /></button>
              <button className="btn-ghost" onClick={() => scrollTo('shops')}>Find nearby shops</button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)', padding:'48px 0'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <span style={{width:32, height:32, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <WrenchIcon style={{width:18, height:18, color:'#0a0d0c'}} />
              </span>
              <span className="font-serif" style={{fontSize:18}}>RepairRadar</span>
            </div>
            <div style={{display:'flex', gap:24}}>
              {['Privacy','Terms','About','Contact'].map(link => (
                <a key={link} href="#" style={{fontSize:13.5, color:'var(--muted)', transition:'color 0.2s'}}
                  onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--muted)'}>{link}</a>
              ))}
            </div>
            <div style={{fontSize:13, color:'var(--muted-2)', textAlign:'right'}}>
              <div>© 2025 RepairRadar · Made for India 🇮🇳</div>
              <div style={{marginTop:4, color:'var(--accent)', fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:'0.1em'}}>Built by oggushivani</div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
