import React from 'react';
import { ThemeAccent, Car, WalletState } from '../types';
import { Wrench, UserCheck, Zap, ArrowLeft } from 'lucide-react';
import { Language, translations } from '../translations';

interface ProactiveServiceSectionProps {
  currentTheme: ThemeAccent;
  selectedCar: Car;
  walletState: WalletState;
  onOpenChargeFlow: () => void;
  onBookDriverDirectly: () => void;
  onBookServiceDirectly: () => void;
  isMapExpanded: boolean;
  lang?: Language;
}

export const ProactiveServiceSection: React.FC<ProactiveServiceSectionProps> = ({
  currentTheme,
  selectedCar,
  walletState,
  onOpenChargeFlow,
  onBookDriverDirectly,
  onBookServiceDirectly,
  isMapExpanded,
  lang = 'fa',
}) => {
  if (isMapExpanded) return null;
  const t = translations[lang];

  const cards = [
    {
      key: 'charge',
      onClick: onOpenChargeFlow,
      icon: Zap,
      badge: `${walletState.remainingKwh} kWh`,
      badgeTone: 'gold' as const,
      title: t.fastChargeReady,
      desc: t.batteryVanLine.replace('{pct}', String(selectedCar.batteryPercent)),
      cta: t.bookNow,
      accent: true,
    },
    ...(selectedCar.kmsSinceLastService >= 10000
      ? [
          {
            key: 'bms',
            onClick: onBookServiceDirectly,
            icon: Wrench,
            badge: '10k km',
            badgeTone: 'danger' as const,
            title: t.bmsAlertTitle,
            desc: t.bmsAlertDesc,
            cta: t.bookNow,
            accent: true,
          },
        ]
      : []),
    {
      key: 'driver',
      onClick: onBookDriverDirectly,
      icon: UserCheck,
      badge: `${walletState.remainingDrivers} ${t.creditServices}`,
      badgeTone: 'neutral' as const,
      title: t.chauffeurTitle,
      desc: t.chauffeurDesc,
      cta: t.orderOnline,
      accent: false,
    },
  ];

  return (
    <div className="absolute inset-x-4 bottom-[calc(var(--nav-clearance)+0.25rem)] max-w-lg mx-auto z-20 fade-up">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <p className="eyebrow flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }} />
          <span>{t.quickVipServices}</span>
        </p>
        <span className="text-[10px] text-ink-4">{t.swipeHint}</span>
      </div>

      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={card.onClick}
              className="min-w-[200px] max-w-[220px] shrink-0 snap-start panel panel-interactive glass p-3.5 text-start flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface-2)]"
                  style={{ color: card.accent ? currentTheme.primaryHex : 'var(--color-ink-3)' }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`chip font-mono ${
                    card.badgeTone === 'gold'
                      ? 'text-gold'
                      : card.badgeTone === 'danger'
                        ? 'text-danger'
                        : ''
                  }`}
                >
                  {card.badge}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-[12px] font-semibold text-ink leading-snug">{card.title}</h4>
                <p className="text-[10px] text-ink-4 mt-1 line-clamp-2 leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-semibold text-ink-2">
                <span>{card.cta}</span>
                <ArrowLeft className={`w-3.5 h-3.5 opacity-60 ${lang === 'en' ? 'rotate-180' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
