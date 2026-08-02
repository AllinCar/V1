import React from 'react';
import { ServiceItem, ThemeAccent, WalletState } from '../types';
import { getServicesList } from '../data/mockData';
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
  lang = 'fa' as Language,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [bundledMap, setBundledMap] = React.useState<Record<string, boolean>>({});
  const t = translations[lang];

  const categories = [
    { id: 'all', label: t.allServices },
    { id: 'charging', label: t.catCharging },
    { id: 'wash', label: t.catWash },
    { id: 'driver', label: t.catDriver },
    { id: 'maintenance', label: t.catMaintenance },
  ];

  const filteredServices = getServicesList(lang).filter(
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
    <div className="page-shell space-y-5">
      {/* Page header */}
      <div className="page-header !mb-0">
        <div>
          <p className="eyebrow">AllinCar</p>
          <h2 className="page-title mt-1">{t.allServices}</h2>
        </div>
        <button
          onClick={onTopUpClick}
          className="btn-ghost text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          {t.upgradePackage}
        </button>
      </div>

      {/* Prepaid Inventory Summary */}
      <div className="panel p-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <span className="chip text-gold">
                <Gem className="w-3 h-3" />
                {t.activePkgLabel} {walletState.activePackageName}
              </span>
              <h3 className="text-sm font-semibold text-ink mt-2.5">{t.walletBalance}</h3>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-black shrink-0"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-bold text-ink block font-mono">{walletState.remainingKwh}</span>
              <span className="text-[10px] text-ink-4">{t.powerRemaining}</span>
            </div>
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-bold text-ink block font-mono">{walletState.remainingWashes}</span>
              <span className="text-[10px] text-ink-4">{t.nanoWashRemaining}</span>
            </div>
            <div className="panel-subtle p-2.5 text-center">
              <span className="text-sm font-bold text-ink block font-mono">{walletState.remainingDrivers}</span>
              <span className="text-[10px] text-ink-4">{t.chauffeurRemaining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="filter-chip"
            data-active={selectedCategory === cat.id}
            style={
              selectedCategory === cat.id
                ? { backgroundColor: currentTheme.primaryHex }
                : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services List Cards */}
      <div className="space-y-3">
        {filteredServices.map((service, index) => {
          const isBundled = bundledMap[service.id];
          return (
            <div
              key={service.id}
              className="panel panel-interactive p-4 space-y-3"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      color: currentTheme.primaryHex,
                      backgroundColor: `${currentTheme.primaryHex}14`,
                      borderColor: `${currentTheme.primaryHex}2E`,
                    }}
                  >
                    {renderIcon(service.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-ink truncate">{service.title}</h4>
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

              <p className="text-[12px] text-ink-3 leading-relaxed">{service.description}</p>

              {service.bundledOffer && (
                <div className="panel-subtle p-3 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      id={`bundle-${service.id}`}
                      checked={!!isBundled}
                      onChange={() => toggleBundle(service.id)}
                      className="w-4 h-4 rounded accent-[var(--color-accent)] cursor-pointer shrink-0"
                    />
                    <label htmlFor={`bundle-${service.id}`} className="text-[11px] text-ink-3 cursor-pointer">
                      {service.bundledOffer}
                    </label>
                  </div>
                  {isBundled && (
                    <span className="chip shrink-0" style={{ backgroundColor: currentTheme.primaryHex, color: '#0a0a0b', borderColor: 'transparent' }}>
                      {t.bundledActive}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => onSelectService(service, isBundled)}
                className="btn-accent w-full"
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
