import React from 'react';
import { Car, ThemeAccent, UserPersona } from '../types';
import { ChevronDown, Wrench, Check, Sparkles } from 'lucide-react';
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

const RING_R = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

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

  const batteryPercent = Math.round(selectedCar.batteryPercent);
  const batteryLow = batteryPercent < 25;
  const ringDashOffset = RING_CIRCUMFERENCE * (1 - batteryPercent / 100);

  return (
    <div
      className={`absolute top-[calc(max(env(safe-area-inset-top),0.75rem)+4rem)] inset-x-4 max-w-lg mx-auto z-30 transition-all duration-500 ${
        isMapExpanded ? 'opacity-30 scale-95 pointer-events-none -translate-y-2' : 'opacity-100 scale-100'
      }`}
    >
      <div className="panel relative overflow-hidden p-4">
        {/* Ambient theme glow */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--accent-primary)' }}
        ></div>

        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Left: User Avatar + Car Selector */}
          <div className="flex items-center gap-3 min-w-0">
            {userPersona && (
              <button
                onClick={onOpenProfile}
                className="relative shrink-0 group"
                title={t.profile}
              >
                <img
                  src={userPersona.avatarUrl}
                  alt={userPersona.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-border-strong group-hover:scale-105 transition-transform"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface-2"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
              </button>
            )}

            <div
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            >
              <div className="relative w-16 h-11 rounded-xl overflow-hidden bg-surface-2/60 border border-border shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={selectedCar.photo}
                  alt={selectedCar.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-ink truncate group-hover:text-ink-2 transition">
                    {selectedCar.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-ink-4 shrink-0 transition-transform duration-200 ${
                      isCarDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <p className="text-[10px] text-ink-4 mt-0.5 dir-ltr text-right font-mono">
                  {selectedCar.plateNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Battery SOC Ring Gauge */}
          <div className="relative shrink-0 w-[52px] h-[52px]" title={t.battery}>
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
              <circle
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                strokeWidth="3.5"
                style={{ stroke: 'var(--ring-track)' }}
              />
              <circle
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringDashOffset}
                style={{
                  stroke: batteryLow ? 'var(--color-danger)' : 'var(--accent-primary)',
                  transition: 'stroke-dashoffset 700ms var(--ease-out-expo)',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-[11px] font-bold font-mono leading-none ${
                  batteryLow ? 'text-danger animate-pulse' : 'text-ink'
                }`}
              >
                {batteryPercent}%
              </span>
              <span className="text-[7px] text-ink-4 font-mono mt-0.5">{t.socLabel}</span>
            </div>
          </div>
        </div>

        {/* Range telemetry strip */}
        <div className="mt-3 pt-2.5 border-t border-divider flex items-center justify-between relative z-10">
          <span className="flex items-center gap-1.5 text-[10px] text-ink-3 font-mono">
            <span className="w-1 h-1 rounded-full bg-ok animate-pulse" />
            <span>{selectedCar.currentRangeKm} km</span>
            <span className="text-ink-4">{t.currentRange}</span>
          </span>

          {selectedCar.kmsSinceLastService >= 10000 ? (
            <span
              className="flex items-center gap-1.5 text-[10px] font-semibold"
              style={{ color: 'var(--accent-text)' }}
            >
              <Wrench className="w-3 h-3" />
              <span>{t.bmsInspection}</span>
              <span className="text-ink-4 font-normal">·</span>
              <span className="text-ink-4 font-mono">{t.serviceDue}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] text-ink-4">
              <span className="w-1 h-1 rounded-full bg-ok-2" />
              {t.allSystemsOk}
            </span>
          )}
        </div>

        {/* Car Switcher Dropdown */}
        {isCarDropdownOpen && (
          <div className="absolute top-full right-0 left-0 mt-3 panel p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-divider">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-text)' }} />
                <span>{t.selectMapCar}</span>
              </span>
              <span className="text-[10px] text-ink-4 font-mono">{cars.length} {t.vehiclesCount}</span>
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
                    className={`w-full text-right p-3 rounded-2xl flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-surface-3 text-ink font-medium border-border-strong'
                        : 'bg-transparent text-ink-3 hover:bg-surface-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={car.photo} alt={car.name} className="w-12 h-9 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-ink truncate">{car.name}</span>
                          {isSelected && (
                            <span
                              className="w-2 h-2 rounded-full animate-pulse shrink-0"
                              style={{ backgroundColor: 'var(--accent-primary)' }}
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-ink-4 font-mono dir-ltr block text-right truncate">
                          {car.plateNumber} • {car.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-left">
                        <span className="text-xs font-bold text-ink font-mono block">{car.batteryPercent}%</span>
                        <span className="text-[9px] text-ink-4 font-mono">{car.currentRangeKm} km</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-ok" />}
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
