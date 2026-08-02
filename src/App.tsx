/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavTab, Car, WalletState, ThemeAccent, ActiveServiceOrder, PrepaidPackage, ServiceItem, ServiceHistory, UserPersona } from './types';
import { getInitialCars, getInitialHistory, getInitialUserPersona, getThemeAccents } from './data/mockData';
import { MapCanvas } from './components/MapCanvas';
import { FloatingCarCard } from './components/FloatingCarCard';
import { ProactiveServiceSection } from './components/ProactiveServiceSection';
import { BottomNavigation } from './components/BottomNavigation';
import { AIConciergeModal } from './components/AIConciergeModal';
import { ServicesTab } from './components/ServicesTab';
import { CarsTab } from './components/CarsTab';
import { ProfileTab } from './components/ProfileTab';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ActiveOrderTracker } from './components/ActiveOrderTracker';
import { ShieldAlert, Globe, Sun, Moon } from 'lucide-react';
import { Language, translations } from './translations';

type Appearance = 'dark' | 'light';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<NavTab>('home');
  const [lang, setLang] = React.useState<Language>('fa');
  const [appearance, setAppearance] = React.useState<Appearance>('dark');
  const [isMapExpanded, setIsMapExpanded] = React.useState(false);
  const [chargeOptionSelected, setChargeOptionSelected] = React.useState<
    'package_7kw' | 'buy_20kw' | 'fast_charger_2km' | null
  >('package_7kw');

  React.useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  React.useEffect(() => {
    document.documentElement.dataset.appearance = appearance;
  }, [appearance]);

  const t = translations[lang];

  const [cars, setCars] = React.useState<Car[]>(() => getInitialCars('fa'));
  const [selectedCar, setSelectedCar] = React.useState<Car>(() => getInitialCars('fa')[0]);
  const [walletState, setWalletState] = React.useState<WalletState>({
    balance: 4500000,
    remainingKwh: 7,
    remainingWashes: 1,
    remainingDrivers: 1,
    activePackageName: translations.fa.pkgDiamondShort,
  });
  const [currentTheme, setCurrentTheme] = React.useState<ThemeAccent>(() => getThemeAccents('fa')[0]);
  const [userPersona, setUserPersona] = React.useState<UserPersona>(() => getInitialUserPersona('fa'));
  const [history, setHistory] = React.useState<ServiceHistory[]>(() => getInitialHistory('fa'));

  React.useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', currentTheme.primaryHex);
    document.documentElement.style.setProperty('--color-accent-fg', '#0a0a0b');
  }, [currentTheme]);

  React.useEffect(() => {
    const localizedCars = getInitialCars(lang);
    setCars((prev) =>
      prev.map((car) => {
        const match = localizedCars.find((c) => c.id === car.id);
        return match ? { ...car, name: match.name, color: match.color } : car;
      })
    );
    setSelectedCar((prev) => {
      const match = localizedCars.find((c) => c.id === prev.id);
      return match ? { ...prev, name: match.name, color: match.color } : prev;
    });
    setUserPersona(getInitialUserPersona(lang));
    setHistory((prev) => {
      const localized = getInitialHistory(lang);
      return prev.map((item) => {
        const match = localized.find((h) => h.id === item.id);
        return match || item;
      });
    });
    setCurrentTheme((prev) => {
      const themes = getThemeAccents(lang);
      return themes.find((th) => th.id === prev.id) || themes[0];
    });
    setWalletState((prev) => ({
      ...prev,
      activePackageName:
        prev.activePackageName.includes('الماس') ||
        prev.activePackageName.toLowerCase().includes('diamond')
          ? translations[lang].pkgDiamondShort
          : prev.activePackageName.includes('طلا') ||
              prev.activePackageName.toLowerCase().includes('gold')
            ? translations[lang].pkgGoldName
            : prev.activePackageName.includes('نقره') ||
                prev.activePackageName.toLowerCase().includes('silver')
              ? translations[lang].pkgSilverName
              : translations[lang].pkgDiamondShort,
    }));
  }, [lang]);

  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<ActiveServiceOrder | null>(null);

  React.useEffect(() => {
    let lastX = 0,
      lastY = 0,
      lastZ = 0;
    let lastTime = 0;
    let lastTrigger = 0;
    const SHAKE_THRESHOLD = 2800;
    const SHAKE_COOLDOWN_MS = 3000;

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
        if (speed > SHAKE_THRESHOLD && currentTime - lastTrigger > SHAKE_COOLDOWN_MS) {
          lastTrigger = currentTime;
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

  const closeMapOverlays = () => {
    setIsMapExpanded(false);
  };

  const switchTab = (tab: NavTab) => {
    setIsMapExpanded(false);
    setIsAIModalOpen(false);
    setActiveTab(tab);
  };

  React.useEffect(() => {
    if (activeTab !== 'home') {
      setIsMapExpanded(false);
    }
  }, [activeTab]);

  const handleOpenChargeFlow = () => {
    switchTab('home');
    setIsMapExpanded(true);
  };

  const handleBookDriverDirectly = () => {
    switchTab('home');
    setIsMapExpanded(false);
    const newOrder: ActiveServiceOrder = {
      id: `ord-${Date.now()}`,
      serviceTitle: t.driverServiceTitle,
      status: 'on_the_way',
      carName: selectedCar.name,
      locationName: t.locationElahiyeh,
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 12,
      technicianName: t.techDriver,
      technicianScore: 4.9,
      technicianPhone: t.techDriverPhone,
      technicianPhoto: '/images/avatars/tech-driver.jpg',
      startTime: t.startNow,
      progressPercent: 35,
    };
    setActiveOrder(newOrder);

    setWalletState((prev) => ({
      ...prev,
      remainingDrivers: Math.max(0, prev.remainingDrivers - 1),
    }));

    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        serviceTitle: t.historyDriverTitle,
        date: t.historyDateNow,
        carName: selectedCar.name,
        amountDeduction: t.historyDriverCredit,
        rating: 5,
      },
      ...prev,
    ]);
  };

  const handleBookServiceDirectly = () => {
    switchTab('home');
    setIsMapExpanded(false);
    const newOrder: ActiveServiceOrder = {
      id: `ord-${Date.now()}`,
      serviceTitle: t.bmsServiceTitle,
      status: 'accepted',
      carName: selectedCar.name,
      locationName: t.locationElahiyeh,
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 25,
      technicianName: t.techBms,
      technicianScore: 5.0,
      technicianPhone: t.techBmsPhone,
      technicianPhoto: '/images/avatars/tech-bms.jpg',
      startTime: t.startNow,
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
      locationName: t.locationElahiyeh,
      lat: 35.78,
      lng: 51.42,
      etaMinutes: 15,
      technicianName: t.techMap,
      technicianScore: 4.95,
      technicianPhone: t.techMapPhone,
      technicianPhoto: '/images/avatars/tech-map.jpg',
      startTime: t.startNow,
      kwhAmount: kwhAmount || 7,
      isBundledWash: dryWash,
      progressPercent: 20,
    };
    setActiveOrder(newOrder);

    setWalletState((prev) => ({
      ...prev,
      remainingKwh: Math.max(0, prev.remainingKwh - (kwhAmount || 7)),
      remainingWashes: dryWash ? Math.max(0, prev.remainingWashes - 1) : prev.remainingWashes,
    }));

    setHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        serviceTitle: `${title}${dryWash ? t.nanoWashSuffix : ''}`,
        date: t.historyDateNow,
        carName: selectedCar.name,
        amountDeduction: t.historyDeductedPackage,
        rating: 5,
      },
      ...prev,
    ]);
  };

  const handleAIExecuteAction = (action: string, params?: any) => {
    if (action === 'BOOK_MOBILE_CHARGER') {
      handleConfirmMapChargeBooking(t.aiMobileChargeTitle, params?.kWh || 7, true);
      switchTab('home');
    } else if (action === 'SHOW_FAST_CHARGER_MAP') {
      switchTab('home');
      setIsMapExpanded(true);
      setChargeOptionSelected('fast_charger_2km');
    } else if (action === 'BOOK_DRIVER') {
      handleBookDriverDirectly();
    } else if (action === 'SOS_EMERGENCY') {
      setIsSOSModalOpen(true);
    } else if (action === 'TOPUP_WALLET') {
      switchTab('profile');
    }
  };

  return (
    <div className="app-shell bg-obsidian text-ink">
      {/* Top chrome */}
      <div className="absolute top-[calc(max(env(safe-area-inset-top),0.75rem)+0.5rem)] inset-x-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <p className="eyebrow tracking-[0.18em]">AllinCar</p>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setAppearance((a) => (a === 'dark' ? 'light' : 'dark'))}
            className="icon-btn"
            title={appearance === 'dark' ? t.appearanceLight : t.appearanceDark}
            aria-label={t.appearanceLabel}
          >
            {appearance === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
            className="icon-btn"
            title={t.languageToggle}
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSOSModalOpen(true)}
            className="btn-danger"
            title={t.emergencySosTitle}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="font-mono tracking-wider">SOS</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 w-full h-full overflow-hidden">
        <div
          className={`absolute inset-0 ${
            activeTab === 'home' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
          }`}
          aria-hidden={activeTab !== 'home'}
        >
          <MapCanvas
            currentTheme={currentTheme}
            isMapExpanded={isMapExpanded && activeTab === 'home'}
            activeServiceMode="idle"
            chargeOptionSelected={chargeOptionSelected}
            onSelectChargeOption={setChargeOptionSelected}
            onConfirmBooking={handleConfirmMapChargeBooking}
            onCloseMapExpansion={() => setIsMapExpanded(false)}
            userBatteryPercent={selectedCar.batteryPercent}
            lang={lang}
            isVisible={activeTab === 'home'}
            appearance={appearance}
          />

          {activeTab === 'home' && (
            <>
              <FloatingCarCard
                cars={cars}
                selectedCar={selectedCar}
                onSelectCar={setSelectedCar}
                currentTheme={currentTheme}
                isMapExpanded={isMapExpanded}
                userPersona={userPersona}
                onOpenProfile={() => switchTab('profile')}
                lang={lang}
              />

              {/* Exclusive home bottom layer: order takes priority over offers */}
              {activeOrder ? (
                <ActiveOrderTracker
                  order={activeOrder}
                  currentTheme={currentTheme}
                  onCancelOrder={() => setActiveOrder(null)}
                  lang={lang}
                />
              ) : (
                <ProactiveServiceSection
                  currentTheme={currentTheme}
                  selectedCar={selectedCar}
                  walletState={walletState}
                  onOpenChargeFlow={handleOpenChargeFlow}
                  onBookDriverDirectly={handleBookDriverDirectly}
                  onBookServiceDirectly={handleBookServiceDirectly}
                  isMapExpanded={isMapExpanded}
                  lang={lang}
                />
              )}
            </>
          )}
        </div>

        {activeTab === 'services' && (
          <div className="absolute inset-0 z-20 w-full h-full overflow-y-auto no-scrollbar scroll-smooth-touch bg-obsidian tab-enter" key="services">
            <ServicesTab
              currentTheme={currentTheme}
              walletState={walletState}
              onSelectService={(service, withBundle) => {
                handleConfirmMapChargeBooking(service.title, 7, withBundle);
                switchTab('home');
              }}
              onTopUpClick={() => switchTab('profile')}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="absolute inset-0 z-20 w-full h-full overflow-y-auto no-scrollbar scroll-smooth-touch bg-obsidian tab-enter" key="cars">
            <CarsTab
              cars={cars}
              selectedCarId={selectedCar.id}
              onSelectCar={(car) => {
                setSelectedCar(car);
                switchTab('home');
              }}
              onAddCar={(newCar) => {
                setCars((prev) => [newCar, ...prev]);
                setSelectedCar(newCar);
                switchTab('home');
              }}
              currentTheme={currentTheme}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="absolute inset-0 z-20 w-full h-full overflow-y-auto no-scrollbar scroll-smooth-touch bg-obsidian tab-enter" key="profile">
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
              appearance={appearance}
              onToggleAppearance={() => setAppearance((a) => (a === 'dark' ? 'light' : 'dark'))}
              lang={lang}
            />
          </div>
        )}
      </div>

      <AIConciergeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentTheme={currentTheme}
        selectedCar={selectedCar}
        walletState={walletState}
        onExecuteAction={handleAIExecuteAction}
        lang={lang}
      />

      <EmergencySOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        currentTheme={currentTheme}
        selectedCar={selectedCar}
        onConfirmSOS={() => {
          handleBookServiceDirectly();
        }}
        lang={lang}
      />

      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={switchTab}
        onOpenAIConcierge={() => {
          closeMapOverlays();
          setIsAIModalOpen(true);
        }}
        currentTheme={currentTheme}
        lang={lang}
        mode={appearance}
      />
    </div>
  );
}
