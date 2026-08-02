import React from 'react';
import { UserPersona, WalletState, ServiceHistory, ThemeAccent, PrepaidPackage } from '../types';
import { getPrepaidPackages, getThemeAccents } from '../data/mockData';
import { Wallet, Award, History, Palette, CheckCircle2, ChevronRight, PlusCircle, ArrowUpRight, X } from 'lucide-react';
import { Language, translations } from '../translations';

interface ProfileTabProps {
  userPersona: UserPersona;
  walletState: WalletState;
  serviceHistory: ServiceHistory[];
  currentTheme: ThemeAccent;
  onSelectTheme: (theme: ThemeAccent) => void;
  onTopUpWallet: (amount: number) => void;
  onChangePackage: (pkg: PrepaidPackage) => void;
  lang?: Language;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userPersona,
  walletState,
  serviceHistory,
  currentTheme,
  onSelectTheme,
  onTopUpWallet,
  onChangePackage,
  lang = 'fa' as Language,
}) => {
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState('2000000');
  const [isPackageModalOpen, setIsPackageModalOpen] = React.useState(false);
  const t = translations[lang];

  return (
    <div className="pb-32 pt-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] px-4 max-w-lg mx-auto space-y-5">
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.vipAccount}</p>
          <h2 className="text-lg font-bold text-ink mt-1">{t.profile}</h2>
        </div>
      </div>

      {/* User Persona Header Card */}
      <div className="panel p-5 relative overflow-hidden">
        <div
          className="absolute -top-10 -left-10 w-36 h-36 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryHex }}
        ></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <img
              src={userPersona.avatarUrl}
              alt={userPersona.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 shadow-xl"
              style={{ borderColor: currentTheme.primaryHex }}
            />
            <span
              className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-black shadow-md uppercase tracking-wider"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              VIP
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-light tracking-tight text-ink truncate">{userPersona.name}</h2>
            <p className="text-[11px] text-ink-4 mt-0.5 font-mono dir-ltr text-right">{userPersona.phone}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="chip text-gold border-gold/30">
                <Award className="w-3 h-3" />
                {userPersona.level}
              </span>
              <span className="chip font-mono">{userPersona.totalPoints} {t.pointsLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Active Package Summary */}
      <div className="panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-white/[0.07] flex items-center justify-center text-gold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-ink-4 block">{t.walletBalance}</span>
              <h3 className="text-base font-light tracking-tight text-ink">
                {walletState.balance.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')} {t.toman}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsTopUpOpen(true)}
            className="btn-accent text-[11px] px-3.5 py-2"
            style={{ backgroundColor: currentTheme.primaryHex }}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.chargeWallet}</span>
          </button>
        </div>

        {/* Active package */}
        <div className="panel-subtle p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-ink-4 block">{t.activePkgLabel}</span>
            <strong className="text-xs text-ink font-semibold mt-0.5 block">{walletState.activePackageName}</strong>
          </div>
          <button
            onClick={() => setIsPackageModalOpen(true)}
            className="text-[11px] font-bold flex items-center gap-0.5 hover:opacity-80 transition"
            style={{ color: currentTheme.primaryHex }}
          >
            {t.upgradePackage}
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* Remaining inventory */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="panel-subtle p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-ink-4 block">{t.powerRemaining}</span>
            <strong className="text-ink text-xs font-mono">{walletState.remainingKwh} kWh</strong>
          </div>
          <div className="panel-subtle p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-ink-4 block">{t.nanoWashRemaining}</span>
            <strong className="text-ink text-xs font-mono">{walletState.remainingWashes} {t.times}</strong>
          </div>
          <div className="panel-subtle p-2.5">
            <span className="text-[10px] uppercase tracking-wider text-ink-4 block">{t.chauffeurRemaining}</span>
            <strong className="text-gold text-xs font-mono">{walletState.remainingDrivers} {t.times}</strong>
          </div>
        </div>
      </div>

      {/* Theme Accent Customizer */}
      <div className="panel p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gold" />
          <h3 className="text-xs font-bold text-ink">{t.appTheme}</h3>
        </div>
        <p className="text-[11px] text-ink-4">
          {t.themeCustomizeHint}
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {getThemeAccents(lang).map((themeItem) => {
            const isActive = currentTheme.id === themeItem.id;
            return (
              <button
                key={themeItem.id}
                onClick={() => onSelectTheme(themeItem)}
                className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-bold transition ${
                  isActive
                    ? 'bg-surface-3 border-white/20 text-ink'
                    : 'bg-transparent border-white/[0.06] text-ink-4 hover:border-white/[0.14]'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: themeItem.primaryHex }}
                ></span>
                <span className="text-[11px] truncate">{themeItem.name}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: currentTheme.primaryHex }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Service History Log */}
      <div className="panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-ink-4" />
            <span>{t.historyTitle}</span>
          </h3>
          <span className="chip">{serviceHistory.length} {t.servicesCount}</span>
        </div>

        <div className="space-y-2 pt-1">
          {serviceHistory.map((h) => (
            <div
              key={h.id}
              className="panel-subtle p-3 flex items-center justify-between text-xs"
            >
              <div className="min-w-0">
                <h4 className="font-bold text-ink truncate">{h.serviceTitle}</h4>
                <p className="text-[10px] text-ink-4 mt-0.5">
                  {h.carName} • {h.date}
                </p>
              </div>
              <div className="text-left shrink-0">
                <span className="text-[10px] bg-ok/15 text-ok px-2 py-0.5 rounded-full border border-ok/20 block">
                  {h.amountDeduction}
                </span>
                <span className="text-[10px] text-gold mt-1 block">★ {h.rating}.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Top-Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
          <div className="sheet w-full max-w-lg sm:rounded-3xl p-5 space-y-4 sheet-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{t.chargeWallet}</h3>
              <button onClick={() => setIsTopUpOpen(false)} className="icon-btn w-8 h-8 rounded-lg text-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-ink-3 block">{t.chargeAmountLabel}</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="field font-mono text-sm font-bold text-left"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {['2000000', '5000000', '10000000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount)}
                  className={`p-2 rounded-xl border font-mono transition ${
                    topUpAmount === amount
                      ? 'border-gold/50 bg-gold/10 text-gold'
                      : 'border-white/[0.07] bg-surface-1 text-ink-3 hover:border-white/[0.15]'
                  }`}
                >
                  {Number(amount).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')} {t.toman}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onTopUpWallet(parseInt(topUpAmount) || 2000000);
                setIsTopUpOpen(false);
              }}
              className="btn-accent w-full py-3 text-xs"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              <ArrowUpRight className="w-4 h-4" />
              {t.confirmCharge}
            </button>
          </div>
        </div>
      )}

      {/* Package Upgrade Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
          <div className="sheet w-full max-w-lg sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar sheet-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{t.upgradePackage}</h3>
              <button onClick={() => setIsPackageModalOpen(false)} className="icon-btn w-8 h-8 rounded-lg text-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {getPrepaidPackages(lang).map((pkg) => (
                <div key={pkg.id} className="panel-subtle p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-ink">{pkg.name}</h4>
                    <span className="text-xs font-extrabold text-gold font-mono">
                      {pkg.price.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')} {t.toman}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-3 leading-relaxed">{pkg.description}</p>
                  <button
                    onClick={() => {
                      onChangePackage(pkg);
                      setIsPackageModalOpen(false);
                    }}
                    className="btn-accent w-full py-2.5 text-xs mt-1"
                    style={{ backgroundColor: currentTheme.primaryHex }}
                  >
                    {t.upgradePackage}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
