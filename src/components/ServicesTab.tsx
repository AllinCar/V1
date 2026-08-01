import React from 'react';
import { ServiceItem, ThemeAccent, WalletState } from '../types';
import { SERVICES_LIST } from '../data/mockData';
import { Zap, Sparkles, UserCheck, Wrench, ShieldAlert, Check, Plus, ShoppingBag } from 'lucide-react';
import { Language, translations } from '../translations';

interface ServicesTabProps {
  currentTheme: ThemeAccent;
  walletState: WalletState;
  onSelectService: (service: ServiceItem, withBundle?: boolean) => void;
  onTopUpClick: () => void;
  lang?: Language;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  currentTheme,
  walletState,
  onSelectService,
  onTopUpClick,
  lang = 'fa',
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [bundledMap, setBundledMap] = React.useState<Record<string, boolean>>({});
  const t = translations[lang];

  const categories = [
    { id: 'all', label: t.allServices },
    { id: 'charging', label: lang === 'fa' ? 'شارژ برقی' : 'EV Charging' },
    { id: 'wash', label: lang === 'fa' ? 'کارواش و زیبایی' : 'Nano Wash' },
    { id: 'driver', label: lang === 'fa' ? 'راننده تشریفات' : 'Chauffeur' },
    { id: 'maintenance', label: lang === 'fa' ? 'سرویس دوره‌ای' : 'Maintenance' },
  ];

  const filteredServices = SERVICES_LIST.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  const toggleBundle = (id: string) => {
    setBundledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="pb-32 pt-6 px-4 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Prepaid Inventory Summary Banner (اعتبار پکیج پیش‌پرداخت شما) */}
      <div className="bg-white/5 rounded-3xl p-4 relative overflow-hidden backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">
              {t.activePkgLabel} {walletState.activePackageName}
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">{t.walletBalance}</h3>
          </div>
          <button
            onClick={onTopUpClick}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl text-slate-950 transition hover:opacity-90"
            style={{ backgroundColor: currentTheme.primaryHex }}
          >
            {t.upgradePackage}
          </button>
        </div>

        {/* Prepaid Allowances Counter grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 text-center">
          <div className="bg-white/5 p-2.5 rounded-2xl">
            <span className="text-sm font-extrabold text-white block">{walletState.remainingKwh}</span>
            <span className="text-[10px] text-white/50">{t.powerRemaining}</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl">
            <span className="text-sm font-extrabold text-white block">{walletState.remainingWashes}</span>
            <span className="text-[10px] text-white/50">{t.nanoWashRemaining}</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-2xl">
            <span className="text-sm font-extrabold text-white block">{walletState.remainingDrivers}</span>
            <span className="text-[10px] text-white/50">{t.chauffeurRemaining}</span>
          </div>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services List Cards */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isBundled = bundledMap[service.id];
          return (
            <div
              key={service.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3 relative overflow-hidden backdrop-blur-xl hover:bg-white/[0.08] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"
                    style={{ color: currentTheme.primaryHex }}
                  >
                    {renderIcon(service.iconName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{service.title}</h4>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-mono"
                      style={{
                        backgroundColor: `${currentTheme.primaryHex}20`,
                        color: currentTheme.primaryHex,
                      }}
                    >
                      {service.inventoryBadge}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-white/50 leading-relaxed">{service.description}</p>

              {/* Dynamic Service Bundling Offer (باندل کردن خدمات) */}
              {service.bundledOffer && (
                <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`bundle-${service.id}`}
                      checked={!!isBundled}
                      onChange={() => toggleBundle(service.id)}
                      className="w-4 h-4 rounded bg-white/10 border-0 text-[#C5A059] focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`bundle-${service.id}`}
                      className="text-[11px] text-white/70 cursor-pointer"
                    >
                      {service.bundledOffer}
                    </label>
                  </div>
                  {isBundled && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold"
                      style={{ backgroundColor: `${currentTheme.primaryHex}30`, color: currentTheme.primaryHex }}
                    >
                      {lang === 'fa' ? 'باندل شد +' : 'Bundled +'}
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => onSelectService(service, isBundled)}
                className="w-full py-3 rounded-xl font-bold text-xs text-black transition hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                <span>{t.reserveService}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

