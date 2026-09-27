import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Car,
  FileText,
  Clock,
  Phone,
  Compass,
  Navigation,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  LocateFixed,
  Info,
  Radio,
  ArrowUpRight,
  Crosshair,
  RefreshCw,
  Share2
} from 'lucide-react';
import { InteractiveCivicMap } from './InteractiveCivicMap';

export type CivicCenterCategory = 'all' | 'ward' | 'rto' | 'cfc' | 'registrar';

export interface CivicCenter {
  id: string;
  name: string;
  category: 'ward' | 'rto' | 'cfc' | 'registrar';
  categoryLabel: string;
  city: string;
  wardCode?: string;
  pinCode: string;
  address: string;
  landmark: string;
  lat: number;
  lng: number;
  phone: string;
  timing: string;
  tokenTiming: string;
  transitHint: string;
  services: string[];
  portalUrl?: string;
}

export const CIVIC_CENTERS_DATA: CivicCenter[] = [
  // ── MUMBAI ──
  {
    id: 'mum-ward-hw',
    name: 'BMC H/West Ward Municipal Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Mumbai',
    wardCode: 'H/West (HW)',
    pinCode: '400050',
    address: 'Saint Martin Road, Near Bandra Police Station, Bandra West, Mumbai, Maharashtra',
    landmark: 'Behind Bandra Post Office & Bandra Station West',
    lat: 19.0596,
    lng: 72.8398,
    phone: '022-26422311 / 022-26436666',
    timing: 'Mon - Sat: 09:30 AM - 05:30 PM (2nd & 4th Sat Closed)',
    tokenTiming: 'Citizen Token Counter: 09:30 AM - 03:00 PM',
    transitHint: '5 mins walking from Bandra Railway Station (West Exit). BEST Bus routes: 211, 214, 220.',
    services: [
      'Shop & Establishment License (Gumasta / Section 6)',
      'Birth & Death Certificate Issuance / Corrections',
      'Municipal Trade & Food Health License Inspection',
      'Property Tax Assessment & NOC Payments',
      'Water Connection Meter Application & Sewage NOC',
      'Drainage & Road Repair Grievance Cell'
    ],
    portalUrl: 'https://portal.mcgm.gov.in'
  },
  {
    id: 'mum-ward-ke',
    name: 'BMC K/East Ward Municipal Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Mumbai',
    wardCode: 'K/East (KE)',
    pinCode: '400069',
    address: 'Gundavali, Azad Road, Andheri East, Mumbai, Maharashtra',
    landmark: 'Near Western Express Highway Metro Station & Gundavali Subway',
    lat: 19.1172,
    lng: 72.8572,
    phone: '022-26840103 / 022-26840104',
    timing: 'Mon - Sat: 09:30 AM - 05:30 PM',
    tokenTiming: 'Citizen Token Counter: 09:30 AM - 03:30 PM',
    transitHint: '300m from WEH Metro Station (Line 1 & 7). 10 mins from Andheri East Railway Station.',
    services: [
      'Commercial Bakery & Restaurant Trade License',
      'Factory & Workshop Health License',
      'Hawker & Street Vendor Registration Certificate',
      'Building Repair Sanction & Water Drainage Approval',
      'Voter Verification Facilitation Desk'
    ],
    portalUrl: 'https://portal.mcgm.gov.in'
  },
  {
    id: 'mum-ward-a',
    name: 'BMC A Ward Municipal Head Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Mumbai',
    wardCode: 'A Ward (South Mumbai)',
    pinCode: '400001',
    address: '134, SBS Road, Opposite Reserve Bank of India, Fort, Mumbai, Maharashtra',
    landmark: 'Near Horniman Circle & Fort Post Office',
    lat: 18.9322,
    lng: 72.8354,
    phone: '022-22661353',
    timing: 'Mon - Sat: 09:30 AM - 05:30 PM',
    tokenTiming: 'Citizen Token Counter: 09:30 AM - 03:00 PM',
    transitHint: '10 mins walking from CSMT and Churchgate Stations.',
    services: [
      'Commercial Building Permission & NOC',
      'Heritage Building Alteration Approvals',
      'Trade License Renewal & Property Assessment',
      'Municipal Advertisement Hoarding Permissions'
    ],
    portalUrl: 'https://portal.mcgm.gov.in'
  },
  {
    id: 'mum-rto-02',
    name: 'MH-02 Andheri Regional Transport Office (RTO)',
    category: 'rto',
    categoryLabel: 'Regional Transport Office (RTO)',
    city: 'Mumbai',
    wardCode: 'RTO MH-02 (Western Suburbs)',
    pinCode: '400053',
    address: 'D/111, Ambivali Village, Near Manish Nagar, Versova Road, Andheri West, Mumbai',
    landmark: 'Opposite D.N. Nagar Metro Station / Behind Sports Complex',
    lat: 19.1294,
    lng: 72.8312,
    phone: '022-26366966 / 022-26366967',
    timing: 'Mon - Fri: 10:00 AM - 05:00 PM',
    tokenTiming: 'Online Appointment Slot Required via Sarathi',
    transitHint: '500m from D.N. Nagar Metro Station. Auto-rickshaw available from Andheri West.',
    services: [
      'Learner & Permanent Driver\'s License Test (Computerized Track)',
      'Vehicle Registration Certificate (RC) & Smart Card Issue',
      'No Objection Certificate (NOC) for Inter-State Vehicle Transfer',
      'Commercial Driving Badge & Fitness Certificate Renewal',
      'International Driving Permit (IDP) Verification'
    ],
    portalUrl: 'https://parivahan.gov.in'
  },
  {
    id: 'mum-rto-01',
    name: 'MH-01 Tardeo Central Mumbai RTO',
    category: 'rto',
    categoryLabel: 'Regional Transport Office (RTO)',
    city: 'Mumbai',
    wardCode: 'RTO MH-01 (Island City)',
    pinCode: '400034',
    address: 'Old Bodyguard Lane, Tulsiwadi, Tardeo, Mumbai, Maharashtra',
    landmark: 'Near AC Market & Haji Ali Junction',
    lat: 18.9723,
    lng: 72.8164,
    phone: '022-23532333',
    timing: 'Mon - Fri: 10:00 AM - 05:00 PM',
    tokenTiming: 'Biometric & Test Slot: 10:30 AM - 04:00 PM',
    transitHint: '10 mins taxi from Mumbai Central Railway Station.',
    services: [
      'Driving License Biometric Verification',
      'Vintage & Commercial Vehicle Registration',
      'Transfer of Ownership (Form 29/30)',
      'Hypothecation Removal / Endorsement (Form 35)'
    ],
    portalUrl: 'https://parivahan.gov.in'
  },
  {
    id: 'mum-cfc-santacruz',
    name: 'Santacruz West Citizen Facilitation Center (CFC)',
    category: 'cfc',
    categoryLabel: 'Citizen Facilitation Center (CFC)',
    city: 'Mumbai',
    wardCode: 'CFC-HW-02',
    pinCode: '400054',
    address: 'Gazdarbandh Civic Center, Near Podar International School, Santacruz West, Mumbai',
    landmark: 'Opposite Juhu Tara Road Junction',
    lat: 19.0825,
    lng: 72.8361,
    phone: '022-26604419',
    timing: 'Mon - Sat: 08:30 AM - 06:30 PM (Continuous Counter)',
    tokenTiming: 'Instant Digital Token on Arrival',
    transitHint: 'Accessible via SV Road or Juhu Tara Road. 7 mins auto from Santacruz Station.',
    services: [
      '1-Stop Municipal Fee & Property Tax Bill Payment',
      'Birth/Death Certificate Physical Printout with Hologram',
      'Maha e-Seva Aaple Sarkar Application Submission',
      'Senior Citizen ID Card & Disability Scheme Enrolment',
      'RTS Act Grievance Filing Counter'
    ],
    portalUrl: 'https://aaplesarkar.mahaonline.gov.in'
  },
  {
    id: 'mum-reg-bandra',
    name: 'Bandra Sub-Registrar & Stamp Duty Office',
    category: 'registrar',
    categoryLabel: 'Sub-Registrar & Property Registration',
    city: 'Mumbai',
    wardCode: 'IGR Haveli / Sub-Registrar Class-1',
    pinCode: '400051',
    address: 'Administrative Building, 2nd Floor, Near Family Court, BKC, Bandra East, Mumbai',
    landmark: 'Near MMRDA Office & BKC Police Station',
    lat: 19.0664,
    lng: 72.8576,
    phone: '022-26572844',
    timing: 'Mon - Sat: 10:00 AM - 05:30 PM (2nd & 4th Sat Closed)',
    tokenTiming: 'Biometric Appointment Slot via IGR Maharashtra',
    transitHint: 'Direct auto / bus from Bandra East Station or Kurla West Station.',
    services: [
      'Residential Rent & Leave and License Agreement Registration',
      'Sale Deed, Conveyance & Gift Deed Execution',
      'Stamp Duty Adjudication & e-Challan GRAS Verification',
      'Certified Copy of Title Deeds & Index-II Search',
      'Power of Attorney & Society Title Transfer Verification'
    ],
    portalUrl: 'https://igrmaharashtra.gov.in'
  },

  // ── PUNE ──
  {
    id: 'pune-ward-ghole',
    name: 'PMC Shivajinagar / Ghole Road Ward Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Pune',
    wardCode: 'PMC Ward No. 04',
    pinCode: '411005',
    address: 'Ghole Road, Near Balgandharva Rangmandir, Shivajinagar, Pune, Maharashtra',
    landmark: 'Behind Sambhaji Park & JM Road',
    lat: 18.5246,
    lng: 73.8478,
    phone: '020-25501000',
    timing: 'Mon - Sat: 10:00 AM - 05:30 PM',
    tokenTiming: 'CFC Token Counter: 10:00 AM - 03:30 PM',
    transitHint: '5 mins walking from Shivajinagar Metro & Bus Depot.',
    services: [
      'PMC Gumasta Shop Act Registration & NOC',
      'Property Tax Rebate & Assessment Revision',
      'Water Connection Application & Drainage Line Sanction',
      'Food Establishment Health NOC'
    ],
    portalUrl: 'https://pmc.gov.in'
  },
  {
    id: 'pune-rto-12',
    name: 'MH-12 Pune Regional Transport Office',
    category: 'rto',
    categoryLabel: 'Regional Transport Office (RTO)',
    city: 'Pune',
    wardCode: 'RTO MH-12',
    pinCode: '411001',
    address: 'Near Sangam Bridge, Pune Station Road, Shivajinagar, Pune, Maharashtra',
    landmark: 'Opposite COEP Technological University Ground',
    lat: 18.5308,
    lng: 73.8643,
    phone: '020-26058080',
    timing: 'Mon - Fri: 10:00 AM - 05:00 PM',
    tokenTiming: 'Automated Track Test: 09:30 AM - 02:30 PM',
    transitHint: 'Adjacent to Sangam Bridge. 1 km from Pune Junction Railway Station.',
    services: [
      'Permanent Driver\'s License Track Test',
      'Vehicle Hypothecation & Fitness Certification',
      'Green Tax & Commercial Permit Endorsement',
      'International Driving Permit Application'
    ],
    portalUrl: 'https://parivahan.gov.in'
  },
  {
    id: 'pune-cfc-kothrud',
    name: 'PMC Kothrud Citizen Facilitation Center (CFC)',
    category: 'cfc',
    categoryLabel: 'Citizen Facilitation Center (CFC)',
    city: 'Pune',
    wardCode: 'CFC-PMC-07',
    pinCode: '411038',
    address: 'Near DP Road & Karve Statue, Kothrud, Pune, Maharashtra',
    landmark: 'Opposite Yashwantrao Chavan Natyagruha',
    lat: 18.5074,
    lng: 73.8077,
    phone: '020-25447192',
    timing: 'Mon - Sat: 09:00 AM - 06:00 PM',
    tokenTiming: 'On-Spot Queue Token Counter',
    transitHint: 'Well connected via Karve Road PMT buses and Vanaz Metro Station.',
    services: [
      'Property Tax Assessment Bill Clearance',
      'Birth & Death Certificate Duplicate Copies',
      'Aaple Sarkar RTS Certificate Attestation',
      'New Water Meter Tap Line Application Desk'
    ],
    portalUrl: 'https://pmc.gov.in'
  },

  // ── DELHI ──
  {
    id: 'del-ward-civil-lines',
    name: 'MCD Civil Lines Zonal Municipal Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Delhi',
    wardCode: 'MCD Zone 01',
    pinCode: '110054',
    address: '16, Rajpur Road, Civil Lines, North Delhi, Delhi',
    landmark: 'Near Vishwavidyalaya Metro Station / Delhi University North Campus',
    lat: 28.6782,
    lng: 77.2249,
    phone: '011-23924151',
    timing: 'Mon - Fri: 09:30 AM - 05:30 PM',
    tokenTiming: 'Public Grievance & Token Desk: 10:00 AM - 02:00 PM',
    transitHint: '400m from Civil Lines Metro Station (Yellow Line).',
    services: [
      'Delhi General Trade & Health Trade License',
      'Sanction of Building Plans under Unified Building Bye-Laws',
      'Property Tax & Conversion Charge Clearance',
      'Factory License Renewal & Inspection'
    ],
    portalUrl: 'https://mcdonline.nic.in'
  },
  {
    id: 'del-rto-07',
    name: 'DL-07 Mayur Vihar Regional Transport Office',
    category: 'rto',
    categoryLabel: 'Regional Transport Office (RTO)',
    city: 'Delhi',
    wardCode: 'RTO DL-07 (East Delhi)',
    pinCode: '110091',
    address: 'Phase-1, Near Supreme Enclave, Mayur Vihar, East Delhi, Delhi',
    landmark: 'Near Mayur Vihar Phase-1 Metro Station',
    lat: 28.6085,
    lng: 77.2946,
    phone: '011-22754321',
    timing: 'Mon - Fri: 09:30 AM - 04:30 PM',
    tokenTiming: 'Automated Driving Test: 09:30 AM - 01:30 PM',
    transitHint: '5 mins walking from Mayur Vihar Phase-1 Metro Station (Blue/Pink Line).',
    services: [
      'Automated Driving Test Track Examination',
      'Electric Vehicle (EV) Subsidy & RC Issuance',
      'Vehicle Transfer of Ownership & Road Tax Receipt',
      'Commercial Vehicle Fitness Inspection'
    ],
    portalUrl: 'https://transport.delhi.gov.in'
  },

  // ── BENGALURU ──
  {
    id: 'blr-ward-shanthinagar',
    name: 'BBMP Shanthinagar Ward & Zonal Office',
    category: 'ward',
    categoryLabel: 'Municipal Ward Office',
    city: 'Bengaluru',
    wardCode: 'BBMP Ward No. 111',
    pinCode: '560027',
    address: 'K.H. Road, Double Road, Shanthinagar, Bengaluru, Karnataka',
    landmark: 'Opposite Shanthinagar TTMC Bus Station',
    lat: 12.9567,
    lng: 77.5962,
    phone: '080-22221188',
    timing: 'Mon - Sat: 10:00 AM - 05:00 PM (2nd & 4th Sat Closed)',
    tokenTiming: 'Citizen Service Window: 10:00 AM - 02:30 PM',
    transitHint: 'Direct access via Shanthinagar TTMC. 10 mins from Lalbagh Metro Station.',
    services: [
      'BBMP Trade License (e-Khata / e-Vyapar)',
      'A-Khata & B-Khata Transfer & Bifurcation',
      'Property Tax (SAS) Challan Verification',
      'Solid Waste Management NOC for Commercial Units'
    ],
    portalUrl: 'https://bbmp.gov.in'
  },
  {
    id: 'blr-rto-01',
    name: 'KA-01 Koramangala Regional Transport Office',
    category: 'rto',
    categoryLabel: 'Regional Transport Office (RTO)',
    city: 'Bengaluru',
    wardCode: 'RTO KA-01 (South Bengaluru)',
    pinCode: '560034',
    address: 'BDA Complex, 3rd Block, Koramangala, Bengaluru, Karnataka',
    landmark: 'Opposite Koramangala Post Office & Near 80 Feet Road',
    lat: 12.9345,
    lng: 77.6258,
    phone: '080-25533525',
    timing: 'Mon - Fri: 10:00 AM - 04:30 PM',
    tokenTiming: 'Online Parivahan Slot Required',
    transitHint: 'Connected via BMTC buses to Koramangala BDA Complex.',
    services: [
      'Smart Card Driver\'s License & Renewal',
      'High Security Registration Plate (HSRP) Verification',
      'Inter-State Vehicle Re-registration & Tax Calculation',
      'Driving School Instructor Badge Authorization'
    ],
    portalUrl: 'https://transport.karnataka.gov.in'
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export const WardLocatorView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [selectedCategory, setSelectedCategory] = useState<CivicCenterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState<string>(CIVIC_CENTERS_DATA[0].id);
  
  // Live GPS State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'osm' | 'radar'>('osm');
  const [isCopied, setIsCopied] = useState(false);

  // Auto-trigger live GPS on mount
  useEffect(() => {
    handleGetLocation(true);
  }, []);

  const handleGetLocation = (silent: boolean = false) => {
    if (!navigator.geolocation) {
      if (!silent) setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy)
        };
        setUserLocation(coords);
        setLocating(false);

        // Intelligently detect city proximity
        let closestCity = 'Mumbai';
        let minCityDist = 99999;
        CIVIC_CENTERS_DATA.forEach((center) => {
          const d = calculateDistance(coords.lat, coords.lng, center.lat, center.lng);
          if (d < minCityDist) {
            minCityDist = d;
            closestCity = center.city;
          }
        });

        // If user is within 100km of a supported city, auto switch or keep 'All'
        if (minCityDist < 120) {
          setSelectedCity(closestCity);
        } else {
          setSelectedCity('All');
        }
      },
      (err) => {
        setLocating(false);
        if (!silent) {
          if (err.code === 1) {
            setGpsError('GPS Permission Denied. Please enable location permissions in browser.');
          } else {
            setGpsError('Unable to detect live GPS. Defaulting to municipal registry.');
          }
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const filteredCenters = useMemo(() => {
    let list = CIVIC_CENTERS_DATA.filter((center) => {
      const matchesCity = selectedCity === 'All' || center.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesCategory = selectedCategory === 'all' || center.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        center.name.toLowerCase().includes(q) ||
        center.address.toLowerCase().includes(q) ||
        center.pinCode.includes(q) ||
        (center.wardCode && center.wardCode.toLowerCase().includes(q)) ||
        center.services.some((s) => s.toLowerCase().includes(q));

      return matchesCity && matchesCategory && matchesSearch;
    });

    if (userLocation) {
      list = [...list].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return list;
  }, [selectedCity, selectedCategory, searchQuery, userLocation]);

  const activeCenter = useMemo(() => {
    return CIVIC_CENTERS_DATA.find((c) => c.id === selectedCenterId) || filteredCenters[0] || CIVIC_CENTERS_DATA[0];
  }, [selectedCenterId, filteredCenters]);

  const categoryCounts = useMemo(() => {
    const cityFiltered = CIVIC_CENTERS_DATA.filter(
      (c) => selectedCity === 'All' || c.city.toLowerCase() === selectedCity.toLowerCase()
    );
    return {
      all: cityFiltered.length,
      ward: cityFiltered.filter((c) => c.category === 'ward').length,
      rto: cityFiltered.filter((c) => c.category === 'rto').length,
      cfc: cityFiltered.filter((c) => c.category === 'cfc').length,
      registrar: cityFiltered.filter((c) => c.category === 'registrar').length
    };
  }, [selectedCity]);

  // Dynamic OpenStreetMap Bounding Box generator around Active Center and User Location
  const mapEmbedUrl = useMemo(() => {
    const centerLat = activeCenter.lat;
    const centerLng = activeCenter.lng;
    const delta = 0.035; // ~3.5km zoom box
    const minLng = (centerLng - delta).toFixed(4);
    const minLat = (centerLat - delta).toFixed(4);
    const maxLng = (centerLng + delta).toFixed(4);
    const maxLat = (centerLat + delta).toFixed(4);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;
  }, [activeCenter]);

  const activeDistance = useMemo(() => {
    if (!userLocation) return null;
    return calculateDistance(userLocation.lat, userLocation.lng, activeCenter.lat, activeCenter.lng);
  }, [userLocation, activeCenter]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeCenter.name,
        text: `Address: ${activeCenter.address}\nTimings: ${activeCenter.timing}`,
        url: `https://www.google.com/maps/dir/?api=1&destination=${activeCenter.lat},${activeCenter.lng}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${activeCenter.name}\n${activeCenter.address}\nhttps://www.google.com/maps/dir/?api=1&destination=${activeCenter.lat},${activeCenter.lng}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner inside Dashboard */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden border border-[#2B6352]">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-white/20">
            <Crosshair className="w-3 h-3 text-emerald-300" />
            <span>Live GPS Jurisdiction Navigator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Municipal Ward & Government Office Locator
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
            Real-time GPS geofencing locates your nearest Municipal Ward Office, RTO facility, Citizen Facilitation Center (CFC), and Sub-Registrar desk with authentic statutory counters.
          </p>
        </div>

        {/* Live GPS Status & Trigger Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 z-10 shrink-0">
          {userLocation ? (
            <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-emerald-400/40 backdrop-blur-md text-left flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase text-emerald-300 tracking-wider flex items-center gap-1">
                  <span>GPS Active</span>
                  {userLocation.accuracy && <span>(±{userLocation.accuracy}m)</span>}
                </div>
                <div className="text-[10px] font-mono text-white/90">
                  {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
                </div>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => handleGetLocation(false)}
            disabled={locating}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#1B4D3E] hover:bg-emerald-50 text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Detecting GPS...' : userLocation ? 'Refresh GPS' : 'Detect My Location'}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0D1A16] p-4 rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* City Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#5C7066] dark:text-[#8C9B94] shrink-0 mr-1">
            City:
          </span>
          {['Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'All'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCity === city
                  ? 'bg-[#1B4D3E] text-white shadow-xs'
                  : 'bg-[#F2F7F4] dark:bg-[#142B23] text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#E2ECE6]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ward (e.g. H/W, K/E), Area, PIN, or Service..."
            className="w-full pl-9 pr-4 py-1.5 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] text-xs font-semibold text-[#11261F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1B4D3E]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Centers', icon: Layers, count: categoryCounts.all },
          { id: 'ward', label: 'Municipal Ward Offices', icon: Building2, count: categoryCounts.ward },
          { id: 'rto', label: 'RTO & Transport', icon: Car, count: categoryCounts.rto },
          { id: 'cfc', label: 'Citizen Facilitation (CFC)', icon: Compass, count: categoryCounts.cfc },
          { id: 'registrar', label: 'Sub-Registrar & Land', icon: FileText, count: categoryCounts.registrar }
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as CivicCenterCategory)}
              className={`px-3.5 py-1.5 rounded-2xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm'
                  : 'bg-white dark:bg-[#0D1A16] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E1] dark:border-[#1E3B32]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F5F2] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7]'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Split: Centers List + Live Map and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Centers List */}
        <div className="lg:col-span-5 space-y-3 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredCenters.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] space-y-2">
              <Info className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No facilities matching filter</p>
            </div>
          ) : (
            filteredCenters.map((center, idx) => {
              const isSelected = center.id === activeCenter.id;
              const dist = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, center.lat, center.lng)
                : null;

              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenterId(center.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-white dark:bg-[#12241E] border-2 border-[#1B4D3E] dark:border-[#6EE7B7] shadow-md ring-2 ring-[#1B4D3E]/10'
                      : 'bg-white dark:bg-[#0D1A16] border-[#DCE8E1] dark:border-[#1E3B32] hover:border-[#1B4D3E]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          center.category === 'ward'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : center.category === 'rto'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : center.category === 'cfc'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}>
                          {center.categoryLabel}
                        </span>
                        {center.wardCode && (
                          <span className="text-[10px] font-bold text-slate-500">
                            &bull; {center.wardCode}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-[#11261F] dark:text-white leading-snug">
                        {center.name}
                      </h3>
                    </div>

                    {dist !== null && (
                      <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black shrink-0 border flex flex-col items-end ${
                        idx === 0
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200'
                      }`}>
                        <span>{dist} km</span>
                        {idx === 0 && <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-90">Closest</span>}
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-[#5C7066] dark:text-[#9FB7AC] line-clamp-2">
                    Address: {center.address}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#4A5D54] dark:text-[#8C9B94] font-medium border-t border-[#EDF2EE] dark:border-[#1E3B32]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                      <span>{center.timing.split('(')[0]}</span>
                    </div>
                    <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">PIN {center.pinCode}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Dynamic Map & Detail Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-4 sm:p-5 shadow-sm space-y-4">
            
            {/* Map Header & Mode Selector */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EDF2EE] dark:border-[#1E3B32]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#11261F] dark:text-white">
                  Live Dynamic Jurisdiction Map
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F7F4] dark:bg-[#142B23] p-1 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setMapMode('osm')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapMode === 'osm'
                      ? 'bg-[#1B4D3E] text-white shadow-xs'
                      : 'text-[#4A5D54] dark:text-[#8C9B94] hover:text-[#11261F]'
                  }`}
                >
                  Live Street Map
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('radar')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    mapMode === 'radar'
                      ? 'bg-[#1B4D3E] text-white shadow-xs'
                      : 'text-[#4A5D54] dark:text-[#8C9B94] hover:text-[#11261F]'
                  }`}
                >
                  Spatial Radar
                </button>
              </div>
            </div>

            {/* Dynamic Map Container */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#EBF3EF] dark:bg-[#08120F] border border-[#D0DDD5] dark:border-[#1E3B32] overflow-hidden">
              {mapMode === 'osm' ? (
                /* 1. Real Interactive Leaflet Civic Street Map with all offices & live GPS pointers */
                <InteractiveCivicMap
                  centers={filteredCenters}
                  activeCenter={activeCenter}
                  userLocation={userLocation}
                  onSelectCenter={(id) => setSelectedCenterId(id)}
                />
              ) : (
                /* 2. Dynamic Spatial Radar Canvas with real GPS relative vector projection */
                <div className="relative w-full h-full p-4 flex items-center justify-center bg-radial from-[#122A22] to-[#08130F] text-white overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#1B4D3E_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
                  
                  {/* Radar Circles */}
                  <div className="absolute w-64 h-64 rounded-full border border-emerald-500/20 animate-pulse" />
                  <div className="absolute w-44 h-44 rounded-full border border-emerald-500/30" />
                  <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40" />
                  <div className="absolute w-full h-[1px] bg-emerald-500/15" />
                  <div className="absolute h-full w-[1px] bg-emerald-500/15" />

                  {/* User Location Radar Center */}
                  {userLocation && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-ping absolute" />
                      <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg relative z-10" />
                      <span className="mt-1 text-[9px] font-black uppercase tracking-wider bg-blue-900/90 text-blue-200 px-1.5 py-0.5 rounded shadow">
                        You (Live GPS)
                      </span>
                    </div>
                  )}

                  {/* Projected Civic Centers relative to active center */}
                  {filteredCenters.slice(0, 8).map((center, idx) => {
                    const isSelected = center.id === activeCenter.id;
                    // Relative spatial projection
                    const baseLat = userLocation ? userLocation.lat : activeCenter.lat;
                    const baseLng = userLocation ? userLocation.lng : activeCenter.lng;
                    const scale = 800; // coordinate scale factor
                    const dx = Math.max(-140, Math.min(140, (center.lng - baseLng) * scale));
                    const dy = Math.max(-120, Math.min(120, (baseLat - center.lat) * scale));

                    return (
                      <button
                        key={center.id}
                        type="button"
                        onClick={() => setSelectedCenterId(center.id)}
                        style={{
                          transform: `translate(${dx}px, ${dy}px)`
                        }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer group z-20 ${
                          isSelected ? 'scale-125 z-40' : 'hover:scale-110 opacity-80'
                        }`}
                        title={`${center.name} (${center.categoryLabel})`}
                      >
                        {isSelected && (
                          <span className="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping" />
                        )}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 text-white ${
                          isSelected
                            ? 'bg-[#1B4D3E] border-white ring-2 ring-emerald-400'
                            : center.category === 'rto'
                            ? 'bg-blue-600 border-white'
                            : center.category === 'cfc'
                            ? 'bg-amber-600 border-white'
                            : center.category === 'registrar'
                            ? 'bg-purple-600 border-white'
                            : 'bg-emerald-700 border-white'
                        }`}>
                          {center.category === 'rto' ? (
                            <Car className="w-3.5 h-3.5" />
                          ) : center.category === 'registrar' ? (
                            <FileText className="w-3.5 h-3.5" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <span className="absolute top-9 left-1/2 -translate-x-1/2 bg-[#08120F]/95 text-[8px] font-bold text-emerald-200 px-1.5 py-0.5 rounded whitespace-nowrap border border-emerald-800/60 shadow">
                          {center.wardCode || center.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Map Action Badges overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                <div className="px-3 py-1 rounded-xl bg-white/95 dark:bg-[#12241E]/95 backdrop-blur-md border border-[#DCE8E1] dark:border-[#1E3B32] shadow-sm text-[10px] font-black text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center gap-1.5 pointer-events-auto">
                  <MapPin className="w-3 h-3" />
                  <span>{activeCenter.lat.toFixed(4)}°N, {activeCenter.lng.toFixed(4)}°E</span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCenter.name + ' ' + activeCenter.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-white/95 dark:bg-[#12241E]/95 backdrop-blur-md border border-[#DCE8E1] dark:border-[#1E3B32] text-[10px] font-black text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-emerald-50 shadow-sm flex items-center gap-1 transition-all pointer-events-auto cursor-pointer"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Active Details Card */}
            <div className="space-y-3.5 text-xs pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDF2EE] dark:border-[#1E3B32]">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1B4D3E] dark:text-[#6EE7B7]">
                      {activeCenter.categoryLabel}
                    </span>
                    {activeCenter.wardCode && (
                      <span className="text-[10px] font-bold text-slate-400">
                        &bull; {activeCenter.wardCode}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#11261F] dark:text-white">
                    {activeCenter.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-xl border border-[#DCE8E1] dark:border-[#1E3B32] hover:bg-[#F2F7F4] dark:hover:bg-[#142B23] text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    title="Share details"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeCenter.lat},${activeCenter.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-bold flex items-center gap-2 text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    {activeDistance !== null && (
                      <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.2 rounded">
                        {activeDistance} km
                      </span>
                    )}
                  </a>
                </div>
              </div>

              {isCopied && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold text-center">
                  Facility details copied to clipboard
                </div>
              )}

              {/* Coordinates & Physical Guidance Box */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] space-y-2 text-[11px]">
                <div>
                  <span className="font-bold text-[#11261F] dark:text-white">Address: </span>
                  <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{activeCenter.address}</span>
                </div>
                <div>
                  <span className="font-bold text-[#11261F] dark:text-white">Landmark: </span>
                  <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{activeCenter.landmark}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 pt-1 border-t border-[#EDF2EE] dark:border-[#1E3B32]">
                  <div>
                    <span className="font-bold text-[#11261F] dark:text-white">Timings: </span>
                    <span>{activeCenter.timing}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">Token Window: </span>
                    <span className="font-semibold text-[#1B4D3E] dark:text-[#6EE7B7]">{activeCenter.tokenTiming}</span>
                  </div>
                </div>
                {activeCenter.phone && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#11261F] dark:text-white">
                    <Phone className="w-3 h-3 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                    <span><strong>Helpline / Phone:</strong> {activeCenter.phone}</span>
                  </div>
                )}
              </div>

              {/* Transit & Commute Tip */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Public Transit Recommendation: </span>
                  <span>{activeCenter.transitHint}</span>
                </div>
              </div>

              {/* Handled Statutory Services */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Designated Civic & Statutory Services at this Facility:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeCenter.services.map((s, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#F2F7F4] dark:bg-[#12241E] text-[11px] font-semibold text-[#11261F] dark:text-[#D1E2D9] flex items-center gap-2 border border-[#E0EBE4] dark:border-[#1B362C]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7] shrink-0" />
                      <span className="line-clamp-1">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action: Generate Roadmap for this facility */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/create', { state: { initialQuery: `I need services at ${activeCenter.name} in ${activeCenter.city}` } })}
                  className="w-full py-2.5 rounded-xl bg-[#F2F7F4] dark:bg-[#142B23] hover:bg-[#E2ECE6] text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-bold border border-[#DCE8E1] dark:border-[#1E3B32] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Build Digital Procedure Roadmap for this Jurisdiction</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default WardLocatorView;
