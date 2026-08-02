import React from 'react';
import { Car, ThemeAccent, UserPersona } from '../types';
import { ChevronDown, BatteryCharging, Gauge, Wrench, ShieldCheck, User, Check, Sparkles } from 'lucide-react';
import { Language, translations } from '../translations';

interface FloatingCarCardProps {
  cars: Car[];
  selectedCar: Car;
  onSelectCar: (car: Car) => void;
  currentTheme: ThemeAccent;
  isMapExpanded: boolean;
  userPersona?: UserPersona;
  onOpenProfile?: () => void;
  lang?: Language;
}

export const FloatingCarCard: React.FC<FloatingCarCardProps> = ({
  cars,
  selectedCar,
  onSelectCar,
  currentTheme,
  isMapExpanded,
  userPersona,
  onOpenProfile,
  lang = 'fa',
}) => {
  const [isCarDropdownOpen, setIsCarDropdownOpen] = React.useState(false);
  const t = translations[lang];

  return (
    <div
      className={`absolute top-[calc(max(env(safe-area-inset-top),0.75rem)+4rem)] inset-x-4 max-w-lg mx-auto z-30 transition-all duration-500 ${
        isMapExpanded ? 'opacity-30 scale-95 pointer-events-none -translate-y-2' : 'opacity-100 scale-100'
      }`}
    >
      <div className="bg-black/70 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 relative overflow-hidden">
        {/* Ambient background glow from theme */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryHex }}
        ></div>

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Left: User Avatar + Car Selector */}
          <div className="flex items-center gap-3">
            {/* User Avatar Quick Access */}
            {userPersona && (
              <button
                onClick={onOpenProfile}
                className="relative shrink-0 group"
                title={t.profile}
              >
                <img
                  src={userPersona.avatarUrl}
                  alt={userPersona.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-white/15 group-hover:scale-105 transition-transform"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black"
                  style={{ backgroundColor: currentTheme.primaryHex }}
                />
              </button>
            )}

            {/* Car Photo & Selector Button */}
            <div
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={selectedCar.photo}
                  alt={selectedCar.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-white group-hover:text-white/80 transition">
                    {selectedCar.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isCarDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-[10px] text-white/40 mt-0.5 dir-ltr text-right font-mono">
                  {selectedCar.plateNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Battery & Range Pill */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
              <BatteryCharging
                className={`w-3.5 h-3.5 ${
                  selectedCar.batteryPercent < 25 ? 'text-red-400 animate-pulse' : 'text-[#C5A059]'
                }`}
              />
              <span className="text-xs font-bold text-white font-mono">{selectedCar.batteryPercent}%</span>
            </div>
            <span className="text-[9px] text-white/40 mt-1 flex items-center gap-1 font-mono">
              <Gauge className="w-2.5 h-2.5" />
              <span>{selectedCar.currentRangeKm} km</span>
            </span>
          </div>
        </div>

        {/* 10,000 km Service Alert Banner inside card if applicable */}
        {selectedCar.kmsSinceLastService >= 10000 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="font-medium flex items-center gap-1.5" style={{ color: currentTheme.primaryHex }}>
              <Wrench className="w-3.5 h-3.5 animate-bounce" />
              <span>{t.bmsInspection}</span>
            </span>
            <span className="text-white/40 text-[10px] font-mono">{t.serviceDue}</span>
          </div>
        )}

        {/* Attractive Flat Car Switcher Dropdown Modal */}
        {isCarDropdownOpen && (
          <div className="absolute top-full right-0 left-0 mt-3 bg-black/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.primaryHex }} />
                <span>{t.selectMapCar}</span>
              </span>
              <span className="text-[10px] text-white/40 font-mono">{cars.length} {t.vehiclesCount}</span>
            </div>

            <div className="space-y-2">
              {cars.map((car) => {
                const isSelected = car.id === selectedCar.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => {
                      onSelectCar(car);
                      setIsCarDropdownOpen(false);
                    }}
                    className={`w-full text-right p-3 rounded-2xl flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-white/15 text-white font-medium border border-white/20 shadow-md'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={car.photo} alt={car.name} className="w-12 h-9 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{car.name}</span>
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: currentTheme.primaryHex }}
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono dir-ltr block text-right">
                          {car.plateNumber} • {car.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <span className="text-xs font-bold text-white font-mono block">{car.batteryPercent}%</span>
                        <span className="text-[9px] text-white/40 font-mono">{car.currentRangeKm} km</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#C5A059]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


