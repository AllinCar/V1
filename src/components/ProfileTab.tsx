import React from 'react';
import { UserPersona, WalletState, ServiceHistory, ThemeAccent, PrepaidPackage } from '../types';
import { PREPAID_PACKAGES, THEME_ACCENTS } from '../data/mockData';
import { User, Wallet, Award, History, Palette, Sparkles, CheckCircle2, ChevronRight, PlusCircle, ArrowUpRight } from 'lucide-react';
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
  lang = 'fa',
}) => {
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState('2000000');
  const [isPackageModalOpen, setIsPackageModalOpen] = React.useState(false);
  const t = translations[lang];

  return (
    <div className="pb-32 pt-6 px-4 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
      {/* User Persona Header Card */}
      <div className="bg-black/60 border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
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
            <h2 className="text-lg font-light tracking-tight text-white truncate">{userPersona.name}</h2>
            <p className="text-[11px] text-white/40 mt-0.5 font-mono dir-ltr text-right">{userPersona.phone}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-white/10 text-[#C5A059] border border-white/10 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Award className="w-3 h-3 text-[#C5A059]" />
                <span>{userPersona.level}</span>
              </span>
              <span className="text-[10px] bg-black/70 text-white/50 px-2.5 py-0.5 rounded-full border border-white/5 font-mono">
                {userPersona.totalPoints} PTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Active Package Summary */}
      <div className="bg-black/60 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#C5A059]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/40 block">{t.walletBalance}</span>
              <h3 className="text-base font-light tracking-tight text-white">
                {walletState.balance.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')} {t.toman}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsTopUpOpen(true)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl text-black shadow-md transition hover:opacity-90 flex items-center gap-1"
            style={{ backgroundColor: currentTheme.primaryHex }}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.chargeWallet}</span>
          </button>
        </div>

        {/* Active Package Info */}
        <div className="bg-black/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 block">{t.activePkgLabel}</span>
            <strong className="text-xs text-white font-medium">{walletState.activePackageName}</strong>
          </div>
          <button
            onClick={() => setIsPackageModalOpen(true)}
            className="text-[11px] font-bold hover:underline"
            style={{ color: currentTheme.primaryHex }}
          >
            {t.upgradePackage} ❯
          </button>
        </div>

        {/* Remaining Inventory Chips */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="bg-black/70 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">{t.powerRemaining}</span>
            <strong className="text-white text-xs font-mono">{walletState.remainingKwh} kWh</strong>
          </div>
          <div className="bg-black/70 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">{t.nanoWashRemaining}</span>
            <strong className="text-white text-xs font-mono">{walletState.remainingWashes} {t.times}</strong>
          </div>
          <div className="bg-black/70 p-2.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">{t.chauffeurRemaining}</span>
            <strong className="text-[#C5A059] text-xs font-mono">{walletState.remainingDrivers} {t.times}</strong>
          </div>
        </div>
      </div>

      {/* Theme Accent Customizer */}
      <div className="bg-black/60 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C5A059]" />
          <h3 className="text-xs font-bold text-white">{t.appTheme}</h3>
        </div>
        <p className="text-[11px] text-white/40">
          {lang === 'fa'
            ? 'تم اپلیکیشن را مطابق سلیقه یا برند خودروی خود تنطیم کنید:'
            : 'Customize application theme color to suit your style:'}
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {THEME_ACCENTS.map((themeItem) => (
            <button
              key={themeItem.id}
              onClick={() => onSelectTheme(themeItem)}
              className={`p-3 rounded-2xl border flex items-center gap-2 text-xs font-bold transition ${
                currentTheme.id === themeItem.id
                  ? 'bg-white/10 border-white/30 text-white shadow-lg'
                  : 'bg-black border-white/5 text-white/40 hover:border-white/10'
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: themeItem.primaryHex }}></span>
              <span className="text-[11px] truncate">{themeItem.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Service History Log */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-white/50" />
            <span>{t.historyTitle}</span>
          </h3>
          <span className="text-[10px] text-white/40">{serviceHistory.length} {t.servicesCount}</span>
        </div>

        <div className="space-y-2 pt-1">
          {serviceHistory.map((h) => (
            <div
              key={h.id}
              className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-bold text-white">{h.serviceTitle}</h4>
                <p className="text-[10px] text-white/40 mt-0.5">
                  {h.carName} • {h.date}
                </p>
              </div>
              <div className="text-left">
                <span className="text-[10px] bg-white/10 text-emerald-400 px-2 py-0.5 rounded border border-white/5 block">
                  {h.amountDeduction}
                </span>
                <span className="text-[10px] text-amber-400 mt-1 block">★ {h.rating}.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Top-Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-black/95 border border-white/15 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">{t.chargeWallet}</h3>
              <button onClick={() => setIsTopUpOpen(false)} className="text-white/40 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/50 block">{t.chargeAmountLabel}</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold text-sm text-left font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setTopUpAmount('2000000')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-mono"
              >
                2,000,000 {t.toman}
              </button>
              <button
                onClick={() => setTopUpAmount('5000000')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-mono"
              >
                5,000,000 {t.toman}
              </button>
              <button
                onClick={() => setTopUpAmount('10000000')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-mono"
              >
                10,000,000 {t.toman}
              </button>
            </div>

            <button
              onClick={() => {
                onTopUpWallet(parseInt(topUpAmount) || 2000000);
                setIsTopUpOpen(false);
              }}
              className="w-full py-3 rounded-xl font-bold text-xs text-black transition hover:opacity-90"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              {t.confirmCharge}
            </button>
          </div>
        </div>
      )}

      {/* Package Upgrade Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-black/95 border border-white/15 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">{t.upgradePackage}</h3>
              <button onClick={() => setIsPackageModalOpen(false)} className="text-white/40 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {PREPAID_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 hover:bg-white/[0.08] transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{pkg.name}</h4>
                    <span className="text-xs font-extrabold text-amber-400 font-mono">
                      {pkg.price.toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')} {t.toman}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">{pkg.description}</p>
                  <button
                    onClick={() => {
                      onChangePackage(pkg);
                      setIsPackageModalOpen(false);
                    }}
                    className="w-full py-2 rounded-xl font-bold text-xs text-black transition hover:opacity-90 mt-2"
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
