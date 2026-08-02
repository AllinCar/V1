import React from 'react';
import { ServiceItem, ThemeAccent, WalletState } from '../types';
import { SERVICES_LIST } from '../data/mockData';
import { Zap, Sparkles, UserCheck, Wrench, ShieldAlert, Check, Plus, ShoppingBag, Gem } from 'lucide-react';
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
    <div className="pb-32 pt-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] px-4 max-w-lg mx-auto space-y-5">
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="eyebrow">AleenCar</p>
          <h2 className="text-lg font-bold text-ink mt-1">{t.allServices}</h2>
        </div>
        <button
          onClick={onTopUpClick}
          className="btn-ghost text-[11px] px-3.5 py-2"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.upgradePackage}
        </button>
      </div>

      {/* Prepaid Inventory Summary */}
      <div className="panel p-4 relative overflow-hidden">
        <div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryHex }}
        ></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="chip" style={{ color: 'var(--color-gold)', borderColor: 'color-mix(in oklab, var(--color-gold) 30%, transparent)' }}>
                <Gem className="w-3 h-3" />
                {t.activePkgLabel} {walletState.activePackageName}
              </span>
              <h3 className="text-sm font-bold text-ink mt-2">{t.walletBalance}</h3>
            </div>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-black shrink-0"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-extrabold text-ink block font-mono">{walletState.remainingKwh}</span>
              <span className="text-[10px] text-ink-4">{t.powerRemaining}</span>
            </div>
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-extrabold text-ink block font-mono">{walletState.remainingWashes}</span>
              <span className="text-[10px] text-ink-4">{t.nanoWashRemaining}</span>
            </div>
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-extrabold text-ink block font-mono">{walletState.remainingDrivers}</span>
              <span className="text-[10px] text-ink-4">{t.chauffeurRemaining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'text-black'
                  : 'bg-transparent text-ink-4 border-white/[0.07] hover:text-ink-2 hover:border-white/[0.15]'
              }`}
              style={isActive ? { backgroundColor: currentTheme.primaryHex, borderColor: 'transparent' } : undefined}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services List Cards */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const isBundled = bundledMap[service.id];
          return (
            <div key={service.id} className="panel p-5 space-y-3 relative overflow-hidden">
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: currentTheme.primaryHex }}
              ></div>

              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border"
                    style={{
                      color: currentTheme.primaryHex,
                      backgroundColor: `${currentTheme.primaryHex}14`,
                      borderColor: `${currentTheme.primaryHex}2E`,
                    }}
                  >
                    {renderIcon(service.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-ink truncate">{service.title}</h4>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 font-mono font-bold"
                      style={{
                        backgroundColor: `${currentTheme.primaryHex}1F`,
                        color: currentTheme.primaryHex,
                      }}
                    >
                      {service.inventoryBadge}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-ink-3 leading-relaxed">{service.description}</p>

              {service.bundledOffer && (
                <div className="panel-subtle p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id={`bundle-${service.id}`}
                      checked={!!isBundled}
                      onChange={() => toggleBundle(service.id)}
                      className="w-4 h-4 rounded bg-surface-2 border-white/15 accent-gold cursor-pointer"
                    />
                    <label htmlFor={`bundle-${service.id}`} className="text-[11px] text-ink-3 cursor-pointer">
                      {service.bundledOffer}
                    </label>
                  </div>
                  {isBundled && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-black" style={{ backgroundColor: currentTheme.primaryHex }}>
                      {lang === 'fa' ? 'باندل شد +' : 'Bundled +'}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => onSelectService(service, isBundled)}
                className="btn-accent w-full py-3 text-xs"
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t.reserveService}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
