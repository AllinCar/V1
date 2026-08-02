export type NavTab = 'home' | 'services' | 'ai_concierge' | 'cars' | 'profile';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  photo: string;
  batteryPercent: number; // e.g. 32
  batteryCapacityKwh: number; // e.g. 93.4
  currentRangeKm: number; // e.g. 145
  lastServiceKm: number; // e.g. 10200
  kmsSinceLastService: number; // e.g. 10200 -> prompt for 10,000 km service!
  plateNumber: string;
  vin: string;
  healthScore: number;
}

export interface WalletState {
  balance: number; // Toman
  remainingKwh: number; // kWh left in active package
  remainingWashes: number; // count
  remainingDrivers: number; // count
  activePackageName: string;
}

export interface PrepaidPackage {
  id: string;
  name: string;
  price: number;
  kwhIncluded: number;
  washesIncluded: number;
  driversIncluded: number;
  description: string;
  badge?: string;
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'charging' | 'wash' | 'driver' | 'maintenance' | 'emergency';
  description: string;
  inventoryBadge: string;
  isPrepaidAvailable: boolean;
  bundledOffer?: string;
  iconName: string;
}

export interface ActiveServiceOrder {
  id: string;
  serviceTitle: string;
  status: 'accepted' | 'on_the_way' | 'arrived' | 'charging' | 'completed';
  carName: string;
  locationName: string;
  lat: number;
  lng: number;
  etaMinutes: number;
  technicianName: string;
  technicianScore: number;
  technicianPhone: string;
  technicianPhoto: string;
  startTime: string;
  isEmergency?: boolean;
  kwhAmount?: number;
  isBundledWash?: boolean;
  progressPercent: number;
}

export interface ThemeAccent {
  id: string;
  name: string;
  primaryHex: string; // e.g., '#D4AF37'
  primaryTailwindBg: string; // 'bg-amber-500'
  primaryTailwindText: string; // 'text-amber-400'
  glowColor: string; // 'rgba(212, 175, 55, 0.3)'
  borderGlow: string; // 'border-amber-500/40'
  textLight: string; // deep accent for text/links on light surfaces (WCAG AA)
  secondaryDark: string; // light accent used as secondary on dark surfaces
}

export interface UserPersona {
  name: string;
  phone: string;
  level: string; // e.g., 'پریمیوم پلاتینوم'
  levelBadge: string;
  totalPoints: number;
  avatarUrl: string;
  memberSince: string;
}

export interface ServiceHistory {
  id: string;
  serviceTitle: string;
  date: string;
  carName: string;
  amountDeduction: string;
  rating: number;
}
