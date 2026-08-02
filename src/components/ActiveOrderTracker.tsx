import React from 'react';
import { ActiveServiceOrder, ThemeAccent } from '../types';
import { Truck, Phone, Star } from 'lucide-react';
import { Language, translations } from '../translations';

interface ActiveOrderTrackerProps {
  order: ActiveServiceOrder;
  currentTheme: ThemeAccent;
  onCancelOrder: () => void;
  lang?: Language;
}

export const ActiveOrderTracker: React.FC<ActiveOrderTrackerProps> = ({
  order,
  currentTheme,
  onCancelOrder,
  lang = 'fa',
}) => {
  const t = translations[lang];
  const steps = [
    { id: 'accepted', label: t.stepAccepted },
    { id: 'on_the_way', label: t.stepEnRoute },
    { id: 'arrived', label: t.stepArrived },
    { id: 'charging', label: t.stepInProgress },
    { id: 'completed', label: t.stepCompleted },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="absolute inset-x-4 bottom-[calc(var(--nav-clearance)+0.25rem)] max-w-lg mx-auto z-30 sheet-enter">
      <div className="panel p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: currentTheme.primaryHex, color: '#0a0a0b' }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-ink truncate">{order.serviceTitle}</h3>
              <p className="text-[11px] text-ink-4 mt-0.5 truncate">
                {t.orderSubtitle.replace('{car}', order.carName)}
              </p>
            </div>
          </div>

          <div className="text-end shrink-0">
            <span className="text-[10px] text-ink-4 block">{t.etaLabel}</span>
            <strong className="text-sm text-ok font-bold font-mono">
              {t.etaMinutes.replace('{n}', String(order.etaMinutes))}
            </strong>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-1">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              return (
                <span
                  key={step.id}
                  className={`text-[9px] font-medium truncate ${isActive ? 'text-ink' : 'text-ink-4'}`}
                  style={isActive && idx === currentStepIndex ? { color: currentTheme.primaryHex } : undefined}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
          <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: currentTheme.primaryHex,
              }}
            />
          </div>
        </div>

        <div className="panel-subtle p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={order.technicianPhoto}
              alt={order.technicianName}
              className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border)]"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-ink truncate">{order.technicianName}</h4>
              <p className="text-[10px] text-ink-4 mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 text-gold fill-gold shrink-0" />
                <span className="truncate">{t.seniorTechnician.replace('{score}', order.technicianScore.toFixed(1))}</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.technicianPhone}`}
            className="icon-btn shrink-0 text-ok border-ok/25 bg-ok/10 hover:bg-ok hover:text-black"
            title={t.callTechnician}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <button onClick={onCancelOrder} className="btn-ghost w-full text-xs">
          {t.cancelOrderTracking}
        </button>
      </div>
    </div>
  );
};
