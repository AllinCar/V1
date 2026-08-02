import React from 'react';
import { Car, ThemeAccent } from '../types';
import { Plus, Camera, Sparkles, BatteryCharging, ShieldCheck, Cpu } from 'lucide-react';
import { Language, translations } from '../translations';
import { assetUrl } from '../utils/assetUrl';

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

  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [color, setColor] = React.useState('');
  const [batteryCapacity, setBatteryCapacity] = React.useState('93.4');
  const [plateNumber, setPlateNumber] = React.useState(t.defaultPlate);

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
        setColor(data.color || t.defaultColorBlack);
        setBatteryCapacity(data.batteryCapacity || '82');
      }
    } catch (err) {
      setBrand('Mercedes-Benz');
      setModel('EQS 580 4MATIC');
      setColor(t.defaultColorSilver);
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
      color: color || t.defaultColorMetallic,
      photo: uploadImage || assetUrl('images/cars/tesla-model-s.jpg'),
      batteryPercent: 85,
      batteryCapacityKwh: parseFloat(batteryCapacity) || 90,
      currentRangeKm: 380,
      lastServiceKm: 1200,
      kmsSinceLastService: 1200,
      plateNumber: plateNumber || t.fallbackPlate,
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
    <div className="pb-32 pt-[calc(max(env(safe-area-inset-top),0.75rem)+3.5rem)] px-4 max-w-lg mx-auto space-y-5">
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="eyebrow">{t.smartGarage}</p>
          <h2 className="text-lg font-bold text-ink mt-1 flex items-center gap-2">
            <span>{t.garageTitle}</span>
            <span className="text-[10px] bg-ok/10 text-ok border border-ok/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <Cpu className="w-3 h-3" />
              <span>{t.aiBaseBadge}</span>
            </span>
          </h2>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-accent text-[11px] px-3.5 py-2.5 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.addVehicle}</span>
        </button>
      </div>

      {/* Car list */}
      <div className="space-y-5">
        {cars.map((car) => {
          const isSelected = car.id === selectedCarId;
          return (
            <div
              key={car.id}
              onClick={() => onSelectCar(car)}
              className={`panel rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group ${
                isSelected ? 'ring-1 ring-ok/40' : 'hover:border-border-strong'
              }`}
              style={isSelected ? { borderColor: 'var(--color-ok)' } : undefined}
            >
              {/* Photo banner */}
              <div className="relative h-48 w-full overflow-hidden bg-surface-1">
                <img
                  src={car.photo}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"></div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-ok text-on-accent text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.activeVehicleOnMap}</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-light text-ink drop-shadow-md tracking-tight truncate">{car.name}</h3>
                    <p className="text-[11px] text-ink-4 drop-shadow dir-ltr text-right font-mono">
                      {car.plateNumber} • {car.color}
                    </p>
                  </div>

                  <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs text-ok font-bold shrink-0">
                    <BatteryCharging className="w-4 h-4" />
                    <span>{car.batteryPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Specs & diagnostics */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                  <div className="panel-subtle p-2.5">
                    <span className="text-ink-4 block text-[10px] uppercase tracking-wider">{t.batteryState}</span>
                    <strong className="text-ink text-xs font-mono">{car.batteryCapacityKwh} kWh</strong>
                  </div>
                  <div className="panel-subtle p-2.5">
                    <span className="text-ink-4 block text-[10px] uppercase tracking-wider">{t.currentRange}</span>
                    <strong className="text-ink text-xs font-mono">{car.currentRangeKm} km</strong>
                  </div>
                  <div className="panel-subtle p-2.5">
                    <span className="text-ink-4 block text-[10px] uppercase tracking-wider">{t.bmsStatus}</span>
                    <strong className="text-ok text-xs font-mono">{car.healthScore}%</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-4 pt-3 border-t border-divider">
                  <span className="flex items-center gap-1.5 text-ok">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {t.aiBatteryAnalysis}
                    </span>
                  </span>
                  <span className="text-[10px] text-ink-4 font-mono">VIN: {car.vin.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Car with AI Photo Detection */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overlay scrim-enter">
          <div className="sheet w-full max-w-lg sm:rounded-3xl p-5 space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar sheet-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ok" />
                <span>{t.addCarTitle}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="icon-btn w-8 h-8 rounded-lg text-sm">
                ✕
              </button>
            </div>

            {/* Photo upload */}
            <div className="border border-dashed border-border-strong hover:border-ok/50 rounded-2xl p-4 text-center cursor-pointer bg-surface-1 relative overflow-hidden group transition-colors">
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
                    <div className="absolute inset-0 bg-obsidian/85 flex items-center justify-center gap-2 text-ok text-xs font-bold">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{t.aiDetecting}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto text-ok">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-ink">
                    {t.uploadCarPhoto}
                  </p>
                  <p className="text-[11px] text-ink-4">
                    {t.aiDetectHelp}
                  </p>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-ink-3 block mb-1.5">{t.brandLabel}</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={t.brandPlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label className="text-ink-3 block mb-1.5">{t.modelLabel}</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={t.modelPlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label className="text-ink-3 block mb-1.5">{t.colorLabel}</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder={t.colorPlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label className="text-ink-3 block mb-1.5">{t.batteryKwhLabel}</label>
                <input
                  type="text"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(e.target.value)}
                  placeholder="93.4"
                  className="field font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCar}
              disabled={!brand || !model}
              className="btn-accent w-full py-3 text-xs"
            >
              {t.confirmAddCar}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
