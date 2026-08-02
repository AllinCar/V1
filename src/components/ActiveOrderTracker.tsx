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

  return (
    <div className={`absolute inset-x-4 bottom-32 max-w-lg mx-auto z-30 animate-in fade-in slide-in-from-bottom-4 ${lang === 'fa' ? 'dir-rtl' : 'dir-ltr'}`}>
      <div className="panel rounded-3xl p-5 space-y-4">
        {/* Header Order Status */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-bold shadow-md"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-ink">{order.serviceTitle}</h3>
              <p className="text-[11px] text-ink-4 mt-0.5">{t.orderSubtitle.replace('{car}', order.carName)}</p>
            </div>
          </div>

          <div className={lang === 'fa' ? 'text-left' : 'text-right'}>
            <span className="text-[10px] text-ink-4 block">{t.etaLabel}</span>
            <strong className="text-xs text-ok font-extrabold">{t.etaMinutes.replace('{n}', String(order.etaMinutes))}</strong>
          </div>
        </div>

        {/* 5-Step Progress Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-ink-4">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              return (
                <span
                  key={step.id}
                  className={`font-medium ${isActive ? 'text-gold font-bold' : 'text-ink-4'}`}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
          <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden flex">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                backgroundColor: currentTheme.primaryHex,
              }}
            ></div>
          </div>
        </div>

        {/* Technician Card */}
        <div className="panel-subtle p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={order.technicianPhoto}
              alt={order.technicianName}
              className="w-10 h-10 rounded-xl object-cover border border-white/10"
            />
            <div>
              <h4 className="text-xs font-bold text-ink">{order.technicianName}</h4>
              <p className="text-[10px] text-ink-4 mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 text-gold fill-gold" />
                <span>{t.seniorTechnician.replace('{score}', order.technicianScore.toFixed(1))}</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.technicianPhone}`}
            className="w-9 h-9 rounded-xl bg-ok/15 text-ok border border-ok/30 flex items-center justify-center hover:bg-ok hover:text-black transition"
            title={t.callTechnician}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={onCancelOrder}
          className="btn-ghost w-full py-2 text-xs"
        >
          {t.cancelOrderTracking}
        </button>
      </div>
    </div>
  );
};
