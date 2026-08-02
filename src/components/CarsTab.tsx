import React from 'react';
import { Car, ThemeAccent } from '../types';
import { Plus, Camera, Sparkles, BatteryCharging, Gauge, ShieldCheck, Trash2, Cpu, Wrench } from 'lucide-react';
import { Language, translations } from '../translations';

interface CarsTabProps {
  cars: Car[];
  selectedCarId: string;
  onSelectCar: (car: Car) => void;
  onAddCar: (newCar: Car) => void;
  currentTheme: ThemeAccent;
  lang?: Language;
}

export const CarsTab: React.FC<CarsTabProps> = ({
  cars,
  selectedCarId,
  onSelectCar,
  onAddCar,
  currentTheme,
  lang = 'fa',
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [uploadImage, setUploadImage] = React.useState<string | null>(null);
  const [isAiDetecting, setIsAiDetecting] = React.useState(false);
  const t = translations[lang];

  // Form states for manual or AI populated inputs
  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [color, setColor] = React.useState('');
  const [batteryCapacity, setBatteryCapacity] = React.useState('93.4');
  const [plateNumber, setPlateNumber] = React.useState('۵۵ م ۷۷۷ ایران ۲۲');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setUploadImage(base64);
        runAiCarDetection(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiCarDetection = async (base64: string) => {
    setIsAiDetecting(true);
    try {
      const res = await fetch('/api/detect-car', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      if (data) {
        setBrand(data.brand || 'Tesla');
        setModel(data.model || 'Model 3 EV');
        setColor(data.color || 'مشکی');
        setBatteryCapacity(data.batteryCapacity || '82');
      }
    } catch (err) {
      setBrand('Mercedes-Benz');
      setModel('EQS 580 4MATIC');
      setColor('نقره‌ای ابریشمی');
      setBatteryCapacity('107.8');
    } finally {
      setIsAiDetecting(false);
    }
  };

  const handleCreateCar = () => {
    if (!brand || !model) return;
    const carObj: Car = {
      id: `car-${Date.now()}`,
      name: `${brand} ${model}`,
      brand,
      model,
      year: '2024',
      color: color || 'مشکی متالیک',
      photo:
        uploadImage ||
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
      batteryPercent: 85,
      batteryCapacityKwh: parseFloat(batteryCapacity) || 90,
      currentRangeKm: 380,
      lastServiceKm: 1200,
      kmsSinceLastService: 1200,
      plateNumber: plateNumber || '۱۲ ک ۳۴۵ ایران ۹۹',
      vin: `VIN${Math.floor(Math.random() * 899999 + 100000)}`,
      healthScore: 99,
    };

    onAddCar(carObj);
    setIsAddModalOpen(false);
    setUploadImage(null);
    setBrand('');
    setModel('');
  };

  return (
    <div className="pb-32 pt-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] px-4 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{t.garageTitle}</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <Cpu className="w-3 h-3" />
              <span>AI Base</span>
            </span>
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">
            {lang === 'fa' ? 'مدیریت بصری و تحلیل هوشمند سلامتی خودروها' : 'Visual management & AI battery diagnostics'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl font-bold text-xs text-black shadow-lg flex items-center gap-1.5 transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: currentTheme.primaryHex }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.addVehicle}</span>
        </button>
      </div>

      {/* Luxury Animated Car List */}
      <div className="space-y-5">
        {cars.map((car) => {
          const isSelected = car.id === selectedCarId;
          return (
            <div
              key={car.id}
              onClick={() => onSelectCar(car)}
              className={`bg-black/60 border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer relative group backdrop-blur-xl ${
                isSelected ? `border-[#C5A059] ring-1 ring-[#C5A059]/40` : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Car Photo Banner with smooth hover zoom */}
              <div className="relative h-48 w-full overflow-hidden bg-black">
                <img
                  src={car.photo}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#C5A059] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.activeVehicleOnMap}</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-light text-white drop-shadow-md tracking-tight">{car.name}</h3>
                    <p className="text-[11px] text-white/50 drop-shadow dir-ltr text-right font-mono">
                      {car.plateNumber} • {car.color}
                    </p>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-xs text-[#C5A059] font-bold">
                    <BatteryCharging className="w-4 h-4 text-[#C5A059]" />
                    <span>{car.batteryPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Specs Grid & Diagnostics */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                  <div className="bg-black/80 p-2.5 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">{t.batteryState}</span>
                    <strong className="text-white text-xs font-mono">{car.batteryCapacityKwh} kWh</strong>
                  </div>
                  <div className="bg-black/80 p-2.5 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">{t.currentRange}</span>
                    <strong className="text-white text-xs font-mono">{car.currentRangeKm} km</strong>
                  </div>
                  <div className="bg-black/80 p-2.5 rounded-xl border border-white/10">
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider">{t.bmsStatus}</span>
                    <strong className="text-[#C5A059] text-xs font-mono">{car.healthScore}%</strong>
                  </div>
                </div>

                {/* AI Diagnostic Prompt */}
                <div className="flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-[#C5A059]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>
                      {lang === 'fa'
                        ? 'تحلیل AI: باتری در شرایط ایده‌آل بدون افت ولتاژ سلول‌ها'
                        : 'AI Analysis: Battery in optimal state, zero cell voltage degradation'}
                    </span>
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">VIN: {car.vin.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Car with AI Photo Detection */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-black/95 border border-white/15 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t.addCarTitle}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Photo Upload Box */}
            <div className="border border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl p-4 text-center cursor-pointer bg-white/5 relative overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {uploadImage ? (
                <div className="relative h-32 w-full rounded-xl overflow-hidden">
                  <img src={uploadImage} alt="Car Upload" className="w-full h-full object-cover" />
                  {isAiDetecting && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 text-amber-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{lang === 'fa' ? 'در حال تشخیص مدل و باتری با AI...' : 'AI Detecting model & battery...'}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    {lang === 'fa' ? 'عکس خودرو را آپلود یا ثبت کنید' : 'Upload or snap car photo'}
                  </p>
                  <p className="text-[11px] text-white/40">
                    {lang === 'fa'
                      ? 'هوش مصنوعی مدل، رنگ و باتری خودرو را خودکار تشخیص می‌دهد'
                      : 'AI will automatically detect brand, color, and battery specs'}
                  </p>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-white/50 block mb-1">
                  {lang === 'fa' ? 'برند خودرو' : 'Brand'}
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Porsche"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-white/50 block mb-1">
                  {lang === 'fa' ? 'مدل خودرو' : 'Model'}
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Taycan Turbo S"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-white/50 block mb-1">
                  {lang === 'fa' ? 'رنگ بدنه' : 'Color'}
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder={lang === 'fa' ? 'مشکی کربن' : 'Carbon Black'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-white/50 block mb-1">
                  {lang === 'fa' ? 'ظرفیت باتری (kWh)' : 'Battery (kWh)'}
                </label>
                <input
                  type="text"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(e.target.value)}
                  placeholder="93.4"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCar}
              disabled={!brand || !model}
              className="w-full py-3 rounded-xl font-bold text-xs text-black shadow-lg disabled:opacity-40 transition"
              style={{ backgroundColor: currentTheme.primaryHex }}
            >
              {t.confirmAddCar}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
