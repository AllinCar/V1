/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavTab, Car, WalletState, ThemeAccent, ActiveServiceOrder, PrepaidPackage, ServiceItem, ServiceHistory, UserPersona } from './types';
import { INITIAL_CARS, PREPAID_PACKAGES, SERVICES_LIST, THEME_ACCENTS, INITIAL_USER_PERSONA, INITIAL_HISTORY } from './data/mockData';
import { MapCanvas } from './components/MapCanvas';
import { FloatingCarCard } from './components/FloatingCarCard';
import { ProactiveServiceSection } from './components/ProactiveServiceSection';
import { BottomNav } from './components/BottomNav';
import { AIConciergeModal } from './components/AIConciergeModal';
import { ServicesTab } from './components/ServicesTab';
import { CarsTab } from './components/CarsTab';
import { ProfileTab } from './components/ProfileTab';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ActiveOrderTracker } from './components/ActiveOrderTracker';
import { ShieldAlert, Globe } from 'lucide-react';
import { Language, translations } from './translations';

export default function App() {
  // Navigation, Language & View States
  const [activeTab, setActiveTab] = React.useState<NavTab>('home');
  const [lang, setLang] = React.useState<Language>('fa');
  const [isMapExpanded, setIsMapExpanded] = React.useState(false);
  const [chargeOptionSelected, setChargeOptionSelected] = React.useState<
    'package_7kw' | 'buy_20kw' | 'fast_charger_2km' | null
  >('package_7kw');

  // Dynamically set HTML direction and lang attribute
  React.useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  // Core Data States
  const [cars, setCars] = React.useState<Car[]>(INITIAL_CARS);
  const [selectedCar, setSelectedCar] = React.useState<Car>(INITIAL_CARS[0]);
  const [walletState, setWalletState] = React.useState<WalletState>({
    balance: 4500000,
    remainingKwh: 7,
    remainingWashes: 1,
    remainingDrivers: 1,
    activePackageName: 'پکیج الماس برقی VIP',
  });
  const [currentTheme, setCurrentTheme] = React.useState<ThemeAccent>(THEME_ACCENTS[0]);
  const [userPersona, setUserPersona] = React.useState<UserPersona>(INITIAL_USER_PERSONA);
  const [history, setHistory] = React.useState<ServiceHistory[]>(INITIAL_HISTORY);

  // Modals & Active Orders
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<ActiveServiceOrder | null>(null);

  // Shake-to-SOS Detection (Physical Shake Listener)
  React.useEffect(() => {
    let lastX = 0,
      lastY = 0,
      lastZ = 0;
    let lastTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const deltaX = Math.abs((current.x || 0) - lastX);
        const deltaY = Math.abs((current.y || 0) - lastY);
        const deltaZ = Math.abs((current.z || 0) - lastZ);

        const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;
        if (speed > 800) {
          setIsSOSModalOpen(true);
        }

        lastX = current.x || 0;
        lastY = current.y || 0;
        lastZ = current.z || 0;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  // Handlers for Zero Page-Jump Map Expansions
  const handleOpenChargeFlow = () => {
    setActiveTab('home');
    setIsMapExpanded(true);
  };

  const handleBookDriverDirectly = () => {
    setActiveTab('home');
    const newOrder: ActiveServiceOrder = {
      id: `ord-${Date.now()}`,
      serviceTitle: 'اعزام راننده تشریفات اختصاصی',
      status: 'on_the_way',
      carName: selectedCar.name,
      locationName: 'الهیه، فرشته',
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 12,
      technicianName: 'استاد علیرضا افشار',
      technicianScore: 4.9,
      technicianPhone: '۰۹۱۲۸۸۸۷۷۶۶',
      technicianPhoto:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      startTime: 'همین الان',
      progressPercent: 35,
    };
    setActiveOrder(newOrder);

    // Update allowances
    setWalletState((prev) => ({
      ...prev,
      remainingDrivers: Math.max(0, prev.remainingDrivers - 1),
    }));

    // Add to history
    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        serviceTitle: 'راننده تشریفات اختصاصی',
        date: 'همین الان',
        carName: selectedCar.name,
        amountDeduction: 'اعتباری (۱ سرویس راننده)',
        rating: 5,
      },
      ...prev,
    ]);
  };

  const handleBookServiceDirectly = () => {
    setActiveTab('home');
    const newOrder: ActiveServiceOrder = {
      id: `ord-${Date.now()}`,
      serviceTitle: 'سرویس دوره‌ای ۱۰ هزار کیلومتر BMS',
      status: 'accepted',
      carName: selectedCar.name,
      locationName: 'الهیه، فرشته',
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 25,
      technicianName: 'مهندس کامران رستمی',
      technicianScore: 5.0,
      technicianPhone: '۰۹۱۲۳۳۳۴۴۵۵',
      technicianPhoto:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      startTime: 'همین الان',
      progressPercent: 15,
    };
    setActiveOrder(newOrder);
  };

  const handleConfirmMapChargeBooking = (title: string, kwhAmount?: number, dryWash?: boolean) => {
    setIsMapExpanded(false);
    const newOrder: ActiveServiceOrder = {
      id: `ord-${Date.now()}`,
      serviceTitle: title,
      status: 'on_the_way',
      carName: selectedCar.name,
      locationName: 'الهیه، فرشته',
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 15,
      technicianName: 'تکنسین آرمان شریفی',
      technicianScore: 4.95,
      technicianPhone: '۰۹۱۲۱۱۱۰۰۹۹',
      technicianPhoto:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      startTime: 'همین الان',
      kwhAmount: kwhAmount || 7,
      isBundledWash: dryWash,
      progressPercent: 20,
    };
    setActiveOrder(newOrder);

    // Deduct remaining kwh / wash if available
    setWalletState((prev) => ({
      ...prev,
      remainingKwh: Math.max(0, prev.remainingKwh - (kwhAmount || 7)),
      remainingWashes: dryWash ? Math.max(0, prev.remainingWashes - 1) : prev.remainingWashes,
    }));

    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        serviceTitle: `${title}${dryWash ? ' + کارواش نانو' : ''}`,
        date: 'همین الان',
        carName: selectedCar.name,
        amountDeduction: 'کسر از اعتبارات پکیج',
        rating: 5,
      },
      ...prev,
    ]);
  };

  const handleAIExecuteAction = (action: string, params?: any) => {
    if (action === 'BOOK_MOBILE_CHARGER') {
      handleConfirmMapChargeBooking('سفارش شارژ سیار ۷ کیلووات (AI Concierge)', params?.kWh || 7, true);
    } else if (action === 'SHOW_FAST_CHARGER_MAP') {
      setIsMapExpanded(true);
      setChargeOptionSelected('fast_charger_2km');
    } else if (action === 'BOOK_DRIVER') {
      handleBookDriverDirectly();
    } else if (action === 'SOS_EMERGENCY') {
      setIsSOSModalOpen(true);
    } else if (action === 'TOPUP_WALLET') {
      setActiveTab('profile');
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-[#E0E0E0] flex flex-col justify-between overflow-hidden relative font-sans">
      {/* Persistent Icon Header Controls */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          className="w-9 h-9 bg-black/70 hover:bg-black/90 border border-white/20 text-white rounded-full shadow-lg backdrop-blur-md flex items-center justify-center transition active:scale-95 group"
          title={lang === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
        >
          <Globe className="w-4 h-4 text-[#C5A059] group-hover:rotate-45 transition-transform" />
        </button>

        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="h-9 px-3 bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 hover:text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95"
          title="امداد جاده‌ای اضطراری (Shake SOS)"
        >
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="font-mono text-[11px] font-extrabold tracking-wider">SOS</span>
        </button>
      </div>

      {/* Side Status Indicator (Design Requirement) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#C5A059]/10 border-l border-y border-[#C5A059]/20 rounded-l-xl p-1.5 py-5 flex flex-col items-center gap-3 z-30 pointer-events-none">
        <div className="w-1 h-6 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }}></div>
        <p className="writing-vertical-rl text-[9px] uppercase tracking-widest font-bold dir-ltr" style={{ color: currentTheme.primaryHex }}>
          VIP Elite
        </p>
      </div>

      {/* Main Tab Render Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {activeTab === 'home' && (
          <div className="w-full h-full relative">
            {/* Base Full Map background */}
            <MapCanvas
              currentTheme={currentTheme}
              isMapExpanded={isMapExpanded}
              activeServiceMode="idle"
              chargeOptionSelected={chargeOptionSelected}
              onSelectChargeOption={setChargeOptionSelected}
              onConfirmBooking={handleConfirmMapChargeBooking}
              onCloseMapExpansion={() => setIsMapExpanded(false)}
              userBatteryPercent={selectedCar.batteryPercent}
            />

            {/* Top Floating Car Card */}
            <FloatingCarCard
              cars={cars}
              selectedCar={selectedCar}
              onSelectCar={setSelectedCar}
              currentTheme={currentTheme}
              isMapExpanded={isMapExpanded}
              userPersona={userPersona}
              onOpenProfile={() => setActiveTab('profile')}
            />

            {/* Bottom Quiet Proactive Suggestions */}
            <ProactiveServiceSection
              currentTheme={currentTheme}
              selectedCar={selectedCar}
              walletState={walletState}
              onOpenChargeFlow={handleOpenChargeFlow}
              onBookDriverDirectly={handleBookDriverDirectly}
              onBookServiceDirectly={handleBookServiceDirectly}
              isMapExpanded={isMapExpanded}
            />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <ServicesTab
              currentTheme={currentTheme}
              walletState={walletState}
              onSelectService={(service, withBundle) => {
                handleConfirmMapChargeBooking(service.title, 7, withBundle);
                setActiveTab('home');
              }}
              onTopUpClick={() => setActiveTab('profile')}
            />
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <CarsTab
              cars={cars}
              selectedCarId={selectedCar.id}
              onSelectCar={(car) => {
                setSelectedCar(car);
                setActiveTab('home');
              }}
              onAddCar={(newCar) => {
                setCars((prev) => [newCar, ...prev]);
                setSelectedCar(newCar);
                setActiveTab('home');
              }}
              currentTheme={currentTheme}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <ProfileTab
              userPersona={userPersona}
              walletState={walletState}
              serviceHistory={history}
              currentTheme={currentTheme}
              onSelectTheme={setCurrentTheme}
              onTopUpWallet={(amount) => {
                setWalletState((prev) => ({
                  ...prev,
                  balance: prev.balance + amount,
                }));
              }}
              onChangePackage={(pkg) => {
                setWalletState((prev) => ({
                  ...prev,
                  activePackageName: pkg.name,
                  remainingKwh: prev.remainingKwh + pkg.kwhIncluded,
                  remainingWashes: prev.remainingWashes + pkg.washesIncluded,
                  remainingDrivers: prev.remainingDrivers + pkg.driversIncluded,
                }));
              }}
            />
          </div>
        )}

        {/* Active Order Live Tracker (Floats on Map) */}
        {activeOrder && (
          <ActiveOrderTracker
            order={activeOrder}
            currentTheme={currentTheme}
            onCancelOrder={() => setActiveOrder(null)}
          />
        )}
      </div>

      {/* Central Interactive AI Concierge Agent Modal (میکروفون هوشمند) */}
      <AIConciergeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentTheme={currentTheme}
        selectedCar={selectedCar}
        walletState={walletState}
        onExecuteAction={handleAIExecuteAction}
      />

      {/* Emergency Roadside SOS Modal */}
      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        currentTheme={currentTheme}
        selectedCar={selectedCar}
        onConfirmSOS={() => {
          handleBookServiceDirectly();
        }}
      />

      {/* Fixed Multilingual Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setIsMapExpanded(false);
          setActiveTab(tab);
        }}
        onOpenAIConcierge={() => setIsAIModalOpen(true)}
        currentTheme={currentTheme}
        lang={lang}
      />
    </div>
  );
}
