export type Language = 'fa' | 'en';

export const translations = {
  fa: {
    // Navigation
    home: 'نقشه اصلی',
    services: 'خدمات آلین',
    ai_concierge: 'دستیار AI',
    cars: 'خودروها',
    profile: 'پروفایل',

    // Header & SOS
    shakeSos: 'تکان دادن گوشی / Shake SOS',
    vipElite: 'VIP Elite',
    languageToggle: 'English',

    // Floating Car Card
    activeVehicle: 'خودروی فعال',
    kmRange: 'کیلومتر پیمایش',
    serviceAlert: '۱۰ هزار کیلومتر از آخرین سرویس گذشته است.',
    bmsInspection: 'سرویس دوره‌ای BMS (۱۰,۰۰۰ km)',
    serviceDue: 'موعد سرویس',
    selectMapCar: 'انتخاب خودروی فعال در نقشه',
    vehiclesCount: 'خودرو',

    // Proactive Section
    intelligentAlerts: 'پیشنهادهای هوشمند اختصاصی شما',
    optimization: 'بهینه‌سازی باتری',
    fastChargeReady: 'ایستگاه شارژ سریع یا ون سیار',
    fastChargeDesc: 'شارژ باتری کم است • ایستگاه ۲km یا سفارش ون ۷kW سیار',
    inPackage: 'در پکیج موجود است',
    bmsAlertTitle: 'چکاپ سلامت باتری BMS (۱۰k km)',
    bmsAlertDesc: 'موعد چکاپ سلامت باتری و سیستم BMS فرا رسیده است',
    chauffeurTitle: 'درخواست راننده تشریفاتی اختصاصی',
    chauffeurDesc: 'اعزام راننده تشریفات جهت جابه‌جایی خودرو در شهر',
    creditServices: 'سرویس اعتباری',
    orderOnline: 'سفارش آنلاین ❯',
    bookNow: 'رزرو فوری ❯',

    // AI Concierge / Voxa
    aiConciergeTitle: 'آلین | AI Concierge',
    voxaSubtitle: 'دستیار هوشمند صوتی و متنی آلین‌کار',
    activeVoice: 'Voice Active',
    listening: 'در حال شنیدن صدای شما...',
    readyAssist: 'آماده گفتگو و اجرای دستورات خودرو',
    typeMessage: 'پیام به دستیار هوشمند آلین...',
    welcomeMessage: 'درود جناب مهندس محمدحسین کاشفی! من خادم و دستیار هوشمند اختصاصی شما در آلین‌کار هستم. آماده‌ام هر فرمایشی برای خودروی شما داشته باشید، فوراً انجام دهم. چه کاری می‌توانم برایتان انجام دهم؟',
    quickStation: 'ایستگاه سریع ۲km',
    quickVan: 'ون شارژ سیار',
    quickBms: 'بازدید BMS',
    quickDriver: 'راننده اختصاصی',

    // Map & Controls
    locationLabel: 'موقعیت شما: الهیه، فرشته',
    fastChargeStation: 'ایستگاه شارژ سریع',
    mobileVan: 'ون شارژ سیار آلین‌کار (۸ دقیقه)',
    closeMap: 'بستن ✕',
    confirmBooking: 'تأیید و ثبت سفارش',

    // Profile & Packages
    walletBalance: 'اعتبار کیف پول پریمیوم',
    toman: 'تومان',
    topUpWallet: 'افزایش اعتبار / شارژ',
    activeMembership: 'پکیج پیش‌پرداخت فعال:',
    changePackage: 'تغییر و ارتقای پکیج ❯',
    powerRemaining: 'کیلووات شارژ موجود',
    nanoWashRemaining: 'کارواش خشک نانو',
    chauffeurRemaining: 'سرویس راننده',
    themeAccent: 'انتخاب رنگ تم و جلوه بصری app',
    serviceHistory: 'تاریخچه خدمات و تراکنش‌ها',
    packagesTitle: 'پکیج‌های پیش‌پرداخت آلین‌کار',
    activatePackage: 'فعال‌سازی این پکیج',

    // Emergency SOS Modal
    emergencySosTitle: 'امداد جاده‌ای اضطراری (Shake SOS)',
    emergencyDesc: 'سیستم هوشمند تشخیص سقوط یا تکان شدید فعال شد.',
    dispatchTechnician: 'درخواست اعزام فوری نیرو',
    cancelSos: 'انصراف',

    // Services Tab
    allServices: 'خدمات کامل VIP',
    reserveService: 'رزرو خدمات (کسر اعتباری)',
    upgradePackage: '+ ارتقا / شارژ',
    activePkgLabel: 'پکیج فعال:',

    // Cars Tab
    garageTitle: 'گاراژ و مدیریت خودروهای الکتریکی',
    addVehicle: '+ افزودن EV جدید',
    activeVehicleOnMap: 'خودروی فعال در نقشه',
    batteryState: 'وضعیت شارژ باتری',
    currentRange: 'شعاع پیمایش فعلی',
    bmsStatus: 'وضعیت سلامت BMS',
    colorLabel: 'رنگ بدنه',
    plateLabel: 'پلاک خودرو',
    addCarTitle: 'افزودن خودروی برقی جدید',
    carNamePlaceholder: 'نام خودرو (مثلاً: لوسید ایر)',
    carPlatePlaceholder: 'پلاک (مثلاً: ۶۸ ج ۴۵۶ ایران ۳۳)',
    confirmAddCar: 'ثبت و افزودن به گاراژ',
  },
  en: {
    // Navigation
    home: 'Live Map',
    services: 'Services',
    ai_concierge: 'AI Concierge',
    cars: 'My Vehicles',
    profile: 'Profile',

    // Header & SOS
    shakeSos: 'Shake SOS',
    vipElite: 'VIP Elite',
    languageToggle: 'فارسی',

    // Floating Car Card
    activeVehicle: 'Active Vehicle',
    kmRange: 'km Range',
    serviceAlert: '10,000 km reached since last service.',
    bmsInspection: 'BMS Periodic Service (10,000 km)',
    serviceDue: 'Service Due',
    selectMapCar: 'Select Active Vehicle on Map',
    vehiclesCount: 'Vehicles',

    // Proactive Section
    intelligentAlerts: 'INTELLIGENT ALERTS & OPTIMIZATION',
    optimization: 'Battery Optimization',
    fastChargeReady: 'Fast Charge Station or Mobile Van',
    fastChargeDesc: 'Battery is low • Station 2km or order 7kW Mobile Van',
    inPackage: 'Included in package',
    bmsAlertTitle: 'BMS Battery Diagnostic (10,000 km)',
    bmsAlertDesc: 'BMS battery health diagnostic check is now due',
    chauffeurTitle: 'Request VIP Chauffeur Driver',
    chauffeurDesc: 'Dispatch professional chauffeur driver for city transit',
    creditServices: 'credit trip',
    orderOnline: 'Order Online ❯',
    bookNow: 'Book Now ❯',

    // AI Concierge / Voxa
    aiConciergeTitle: 'Aleen | AI Concierge',
    voxaSubtitle: 'Voxa Voice & Text AI Assistant',
    activeVoice: 'Voice Active',
    listening: 'Listening to your voice...',
    readyAssist: 'Ready to assist and execute car commands',
    typeMessage: 'Message Aleen AI...',
    welcomeMessage: 'Greetings Eng. Mohammad Hossein Kashfi! I am your personal AI assistant at AleenCar. How may I assist your vehicle today?',
    quickStation: '2km Fast Station',
    quickVan: 'Mobile Charging Van',
    quickBms: 'BMS Diagnostic',
    quickDriver: 'VIP Driver',

    // Map & Controls
    locationLabel: 'Your Location: Elahiyeh, Fereshteh',
    fastChargeStation: 'Fast Charge Station',
    mobileVan: 'AleenCar Mobile Charging Van (8 min)',
    closeMap: 'Close ✕',
    confirmBooking: 'Confirm & Dispatch',

    // Profile & Packages
    walletBalance: 'Premium Wallet Balance',
    toman: 'Toman',
    topUpWallet: 'Top Up / Recharge',
    activeMembership: 'Active Prepaid Package:',
    changePackage: 'Change / Upgrade Package ❯',
    powerRemaining: 'kWh Power Available',
    nanoWashRemaining: 'Nano Dry Wash',
    chauffeurRemaining: 'Chauffeur Service',
    themeAccent: 'App Theme Accent & Visual Style',
    serviceHistory: 'Service & Transaction History',
    packagesTitle: 'AleenCar Prepaid Packages',
    activatePackage: 'Activate Package',

    // Emergency SOS Modal
    emergencySosTitle: 'Roadside Emergency (Shake SOS)',
    emergencyDesc: 'Intelligent impact or shake detection triggered.',
    dispatchTechnician: 'Dispatch Emergency Unit',
    cancelSos: 'Cancel',

    // Services Tab
    allServices: 'All VIP Services',
    reserveService: 'Book Service (Credit)',
    upgradePackage: '+ Upgrade / Top-Up',
    activePkgLabel: 'Active Package:',

    // Cars Tab
    garageTitle: 'Garage & EV Fleet Management',
    addVehicle: '+ Add New EV',
    activeVehicleOnMap: 'Active Vehicle on Map',
    batteryState: 'Battery SOC State',
    currentRange: 'Current Estimated Range',
    bmsStatus: 'BMS Health Diagnostic',
    colorLabel: 'Body Color',
    plateLabel: 'License Plate',
    addCarTitle: 'Add New Electric Vehicle',
    carNamePlaceholder: 'Vehicle Name (e.g. Lucid Air)',
    carPlatePlaceholder: 'Plate Number',
    confirmAddCar: 'Add to Garage',
  },
};

