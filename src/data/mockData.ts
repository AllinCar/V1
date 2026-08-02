import { Car, PrepaidPackage, ServiceItem, ThemeAccent, UserPersona, ServiceHistory } from '../types';
import { Language, translations } from '../translations';
import { assetUrl } from '../utils/assetUrl';

type T = (typeof translations)['fa'];

export function getInitialCars(lang: Language = 'fa'): Car[] {
  const t = translations[lang];
  return [
    {
      id: 'car-1',
      name: t.car1Name,
      brand: 'Porsche',
      model: 'Taycan Turbo S',
      year: '2024',
      color: t.car1Color,
      photo: assetUrl('images/cars/porsche-taycan.jpg'),
      batteryPercent: 32,
      batteryCapacityKwh: 93.4,
      currentRangeKm: 145,
      lastServiceKm: 10450,
      kmsSinceLastService: 10450,
      plateNumber: '۶۸ ج ۹۱۲ ایران ۴۴',
      vin: 'WP0ZZZY1ZMSA88901',
      healthScore: 98,
    },
    {
      id: 'car-2',
      name: t.car2Name,
      brand: 'Tesla',
      model: 'Model S Plaid',
      year: '2024',
      color: t.car2Color,
      photo: assetUrl('images/cars/tesla-model-s.jpg'),
      batteryPercent: 78,
      batteryCapacityKwh: 100,
      currentRangeKm: 420,
      lastServiceKm: 4200,
      kmsSinceLastService: 4200,
      plateNumber: '۲۱ ط ۴۵۶ ایران ۱۱',
      vin: '5YJSA1E28MF998231',
      healthScore: 99,
    },
    {
      id: 'car-3',
      name: t.car3Name,
      brand: 'BMW',
      model: 'i7 xDrive60 Luxury',
      year: '2024',
      color: t.car3Color,
      photo: assetUrl('images/cars/bmw-i7.jpg'),
      batteryPercent: 19,
      batteryCapacityKwh: 101.7,
      currentRangeKm: 92,
      lastServiceKm: 8100,
      kmsSinceLastService: 8100,
      plateNumber: '۸۸ د ۳۳۳ ایران ۳۳',
      vin: 'WBY73EH020CH88192',
      healthScore: 96,
    },
  ];
}

export function getPrepaidPackages(lang: Language = 'fa'): PrepaidPackage[] {
  const t = translations[lang];
  return [
    {
      id: 'pkg-diamond',
      name: t.pkgDiamondName,
      price: 8500000,
      kwhIncluded: 150,
      washesIncluded: 4,
      driversIncluded: 2,
      description: t.pkgDiamondDesc,
      badge: t.pkgDiamondBadge,
      isPopular: true,
    },
    {
      id: 'pkg-gold',
      name: t.pkgGoldName,
      price: 4900000,
      kwhIncluded: 80,
      washesIncluded: 2,
      driversIncluded: 1,
      description: t.pkgGoldDesc,
      badge: t.pkgGoldBadge,
    },
    {
      id: 'pkg-silver',
      name: t.pkgSilverName,
      price: 2800000,
      kwhIncluded: 40,
      washesIncluded: 1,
      driversIncluded: 0,
      description: t.pkgSilverDesc,
    },
  ];
}

export function getServicesList(lang: Language = 'fa'): ServiceItem[] {
  const t = translations[lang];
  return [
    {
      id: 'srv-mobile-charge',
      title: t.srvMobileChargeTitle,
      category: 'charging',
      description: t.srvMobileChargeDesc,
      inventoryBadge: t.srvMobileChargeBadge,
      isPrepaidAvailable: true,
      bundledOffer: t.srvMobileChargeBundle,
      iconName: 'Zap',
    },
    {
      id: 'srv-fast-station',
      title: t.srvFastStationTitle,
      category: 'charging',
      description: t.srvFastStationDesc,
      inventoryBadge: t.srvFastStationBadge,
      isPrepaidAvailable: true,
      iconName: 'MapPin',
    },
    {
      id: 'srv-dry-wash',
      title: t.srvDryWashTitle,
      category: 'wash',
      description: t.srvDryWashDesc,
      inventoryBadge: t.srvDryWashBadge,
      isPrepaidAvailable: true,
      bundledOffer: t.srvDryWashBundle,
      iconName: 'Sparkles',
    },
    {
      id: 'srv-vip-driver',
      title: t.srvVipDriverTitle,
      category: 'driver',
      description: t.srvVipDriverDesc,
      inventoryBadge: t.srvVipDriverBadge,
      isPrepaidAvailable: true,
      iconName: 'UserCheck',
    },
    {
      id: 'srv-period-maintenance',
      title: t.srvPeriodMaintTitle,
      category: 'maintenance',
      description: t.srvPeriodMaintDesc,
      inventoryBadge: t.srvPeriodMaintBadge,
      isPrepaidAvailable: false,
      iconName: 'Wrench',
    },
    {
      id: 'srv-emergency-sos',
      title: t.srvEmergencyTitle,
      category: 'emergency',
      description: t.srvEmergencyDesc,
      inventoryBadge: t.srvEmergencyBadge,
      isPrepaidAvailable: true,
      iconName: 'ShieldAlert',
    },
  ];
}

export function getThemeAccents(lang: Language = 'fa'): ThemeAccent[] {
  const t = translations[lang];
  return [
    {
      id: 'emerald',
      name: t.themeEmerald,
      primaryHex: '#02DAAE',
      primaryTailwindBg: 'bg-[#02DAAE]',
      primaryTailwindText: 'text-[#02DAAE]',
      glowColor: 'rgba(2, 218, 174, 0.4)',
      borderGlow: 'border-[#02DAAE]/40',
      textLight: '#059669',
      secondaryDark: '#5EEAD4',
    },
    {
      id: 'cyan',
      name: t.themeCyan,
      primaryHex: '#22D3EE',
      primaryTailwindBg: 'bg-[#22D3EE]',
      primaryTailwindText: 'text-[#22D3EE]',
      glowColor: 'rgba(34, 211, 238, 0.4)',
      borderGlow: 'border-[#22D3EE]/40',
      textLight: '#0E7490',
      secondaryDark: '#A5F3FC',
    },
    {
      id: 'blue',
      name: t.themeBlue,
      primaryHex: '#3B82F6',
      primaryTailwindBg: 'bg-[#3B82F6]',
      primaryTailwindText: 'text-[#3B82F6]',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      borderGlow: 'border-[#3B82F6]/40',
      textLight: '#1D4ED8',
      secondaryDark: '#93C5FD',
    },
    {
      id: 'rose',
      name: t.themeRose,
      primaryHex: '#EC4899',
      primaryTailwindBg: 'bg-[#EC4899]',
      primaryTailwindText: 'text-[#EC4899]',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      borderGlow: 'border-[#EC4899]/40',
      textLight: '#BE185D',
      secondaryDark: '#F9A8D4',
    },
  ];
}

export function getInitialUserPersona(lang: Language = 'fa'): UserPersona {
  const t = translations[lang];
  return {
    name: t.userName,
    phone: t.userPhone,
    level: t.userLevel,
    levelBadge: t.userLevelBadge,
    totalPoints: 1250,
    avatarUrl: assetUrl('images/avatars/user.jpg'),
    memberSince: t.userMemberSince,
  };
}

export function getInitialHistory(lang: Language = 'fa'): ServiceHistory[] {
  const t = translations[lang];
  return [
    {
      id: 'hist-1',
      serviceTitle: t.hist1Title,
      date: t.hist1Date,
      carName: t.hist1Car,
      amountDeduction: t.hist1Amount,
      rating: 5,
    },
    {
      id: 'hist-2',
      serviceTitle: t.hist2Title,
      date: t.hist2Date,
      carName: t.hist2Car,
      amountDeduction: t.hist2Amount,
      rating: 5,
    },
    {
      id: 'hist-3',
      serviceTitle: t.hist3Title,
      date: t.hist3Date,
      carName: t.hist3Car,
      amountDeduction: t.hist3Amount,
      rating: 5,
    },
  ];
}

/** @deprecated Prefer lang-aware getters */
export const INITIAL_CARS = getInitialCars('fa');
/** @deprecated Prefer getPrepaidPackages(lang) */
export const PREPAID_PACKAGES = getPrepaidPackages('fa');
/** @deprecated Prefer getServicesList(lang) */
export const SERVICES_LIST = getServicesList('fa');
/** @deprecated Prefer getThemeAccents(lang) */
export const THEME_ACCENTS = getThemeAccents('fa');
/** @deprecated Prefer getInitialUserPersona(lang) */
export const INITIAL_USER_PERSONA = getInitialUserPersona('fa');
/** @deprecated Prefer getInitialHistory(lang) */
export const INITIAL_HISTORY = getInitialHistory('fa');

export type TranslationDict = T;
