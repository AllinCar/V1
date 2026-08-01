import React from 'react';
import { ActiveServiceOrder, ThemeAccent } from '../types';
import { Truck, Phone, Star, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface ActiveOrderTrackerProps {
  order: ActiveServiceOrder;
  currentTheme: ThemeAccent;
  onCancelOrder: () => void;
}

export const ActiveOrderTracker: React.FC<ActiveOrderTrackerProps> = ({
  order,
  currentTheme,
  onCancelOrder,
}) => {
  const steps = [
    { id: 'accepted', label: 'پذیرفته شد' },
    { id: 'on_the_way', label: 'در مسیر' },
    { id: 'arrived', label: 'رسید به محل' },
    { id: 'charging', label: 'در حال ارائه' },
    { id: 'completed', label: 'تکمیل شد' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);

  return (
    <div className="absolute inset-x-4 bottom-24 max-w-lg mx-auto z-30 animate-in fade-in slide-in-from-bottom-4 dir-rtl">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4">
        {/* Header Order Status */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">{order.serviceTitle}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">برای {order.carName} • موقعیت الهیه</p>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[10px] text-slate-400 block">زمان رسیدن (ETA)</span>
            <strong className="text-xs text-emerald-400 font-extrabold">{order.etaMinutes} دقیقه</strong>
          </div>
        </div>

        {/* 5-Step Progress Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              return (
                <span
                  key={step.id}
                  className={`font-medium ${isActive ? 'text-amber-400 font-bold' : 'text-slate-500'}`}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex">
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
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={order.technicianPhoto}
              alt={order.technicianName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{order.technicianName}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>تکنسین ارشد آلین‌کار ({order.technicianScore}.0)</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${order.technicianPhone}`}
            className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition"
            title="تماس مستقیم با تکنسین"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={onCancelOrder}
          className="w-full py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-800 transition"
        >
          اتمام / لغو پیگیری سفارش
        </button>
      </div>
    </div>
  );
};
