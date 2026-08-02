import React from 'react';
import { Car, ThemeAccent, UserPersona } from '../types';
import { ChevronDown, Wrench, Check } from 'lucide-react';
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
      className={`absolute top-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] inset-x-4 max-w-lg mx-auto z-30 transition-all duration-400 ${
        isMapExpanded ? 'opacity-0 scale-[0.97] pointer-events-none -translate-y-3' : 'opacity-100 scale-100 fade-up'
      }`}
    >
      <div className="panel glass relative overflow-hidden p-3.5">
        <div className="flex items-center justify-between gap-3 relative z-10">
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
                  className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border-strong)] group-hover:scale-[1.03] transition-transform duration-200"
                />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-surface-elevated)]"
                  style={{ backgroundColor: currentTheme.primaryHex }}
                />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0 text-start"
            >
              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)] shrink-0">
                <img
                  src={selectedCar.photo}
                  alt={selectedCar.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-semibold text-ink truncate">
                    {selectedCar.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-ink-4 shrink-0 transition-transform duration-200 ${
                      isCarDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <p className="text-[10px] text-ink-4 mt-0.5 font-mono tracking-wide">
                  {selectedCar.plateNumber}
                </p>
              </div>
            </button>
          </div>

          <div className="relative shrink-0 w-[48px] h-[48px]" title={t.battery}>
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
              <circle
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                stroke="var(--color-border-strong)"
                strokeWidth="3.25"
              />
              <circle
                cx="22"
                cy="22"
                r={RING_R}
                fill="none"
                stroke={batteryLow ? 'var(--color-danger)' : currentTheme.primaryHex}
                strokeWidth="3.25"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringDashOffset}
                style={{ transition: 'stroke-dashoffset 700ms var(--ease-out-expo)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-[11px] font-bold font-mono leading-none ${
                  batteryLow ? 'text-danger animate-pulse-soft' : 'text-ink'
                }`}
              >
                {batteryPercent}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between relative z-10">
          <span className="flex items-center gap-1.5 text-[10px] text-ink-3 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse-soft" />
            <span>{selectedCar.currentRangeKm} km</span>
            <span className="text-ink-4">{t.currentRange}</span>
          </span>

          {selectedCar.kmsSinceLastService >= 10000 ? (
            <span
              className="flex items-center gap-1.5 text-[10px] font-semibold"
              style={{ color: currentTheme.primaryHex }}
            >
              <Wrench className="w-3 h-3" />
              <span>{t.serviceDue}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] text-ink-4">
              {t.allSystemsOk}
            </span>
          )}
        </div>

        {isCarDropdownOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 panel p-3 z-50 space-y-2 scale-in shadow-lg">
            <div className="flex items-center justify-between px-1 pb-2 border-b border-[var(--color-border)]">
              <span className="text-xs font-semibold text-ink">{t.selectMapCar}</span>
              <span className="text-[10px] text-ink-4 font-mono">{cars.length}</span>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar">
              {cars.map((car) => {
                const isSelected = car.id === selectedCar.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => {
                      onSelectCar(car);
                      setIsCarDropdownOpen(false);
                    }}
                    className={`w-full text-start p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-surface-3)] text-ink'
                        : 'text-ink-3 hover:bg-[var(--color-surface-2)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={car.photo} alt={car.name} className="w-11 h-8 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-ink truncate block">{car.name}</span>
                        <span className="text-[10px] text-ink-4 font-mono truncate block">
                          {car.plateNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold font-mono text-ink">{car.batteryPercent}%</span>
                      {isSelected && <Check className="w-4 h-4 text-gold" />}
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
