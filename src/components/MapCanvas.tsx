import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Zap, Navigation, ShieldCheck, Truck, Locate } from 'lucide-react';
import { ThemeAccent } from '../types';
import { Language, translations } from '../translations';

interface MapCanvasProps {
  currentTheme: ThemeAccent;
  isMapExpanded: boolean;
  activeServiceMode: 'idle' | 'mobile_charge' | 'fast_station' | 'driver' | 'period_service' | 'emergency';
  chargeOptionSelected?: 'package_7kw' | 'buy_20kw' | 'fast_charger_2km' | null;
  onSelectChargeOption?: (opt: 'package_7kw' | 'buy_20kw' | 'fast_charger_2km') => void;
  onConfirmBooking?: (title: string, kwh?: number, dryWash?: boolean) => void;
  onCloseMapExpansion?: () => void;
  userBatteryPercent: number;
  lang?: Language;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  currentTheme,
  isMapExpanded,
  chargeOptionSelected,
  onSelectChargeOption,
  onConfirmBooking,
  onCloseMapExpansion,
  userBatteryPercent,
  lang = 'fa',
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [includeDryWash, setIncludeDryWash] = React.useState(true);

  // State for user location from GPS (falls back to Tehran Elahiyeh)
  const [userCoords, setUserCoords] = React.useState<[number, number]>([35.792, 51.423]);
  const [isGpsActive, setIsGpsActive] = React.useState(false);


  // Read GPS coordinates on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (pos.coords.latitude && pos.coords.longitude) {
            setUserCoords([pos.coords.latitude, pos.coords.longitude]);
            setIsGpsActive(true);
          }
        },
        (err) => {
          console.log('Geolocation fallback to default:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Requested Real Tehran Charging Stations
  const realChargingStations = [
    { name: 'شهرداری تهران (خیابان بهشت)', coords: [35.708, 51.420] as [number, number], power: '50 kW DC' },
    { name: 'پارکینگ طالقانی', coords: [35.708, 51.434] as [number, number], power: '60 kW DC' },
    { name: 'پارکینگ طبقاتی سعدی', coords: [35.683, 51.423] as [number, number], power: '۹۰ کیلووات' },
    { name: 'پارکینگ نهج‌البلاغه', coords: [35.755, 51.340] as [number, number], power: '۱۳۰ کیلووات (فست)' },
    { name: 'پارکینگ امیرکبیر', coords: [35.685, 51.435] as [number, number], power: '۷۰ کیلووات' },
  ];

  // 10 AleenCar Mobile Charging Van Locations widely distributed across Greater Tehran
  const mobileChargingVans = [
    { id: 'VAN-101', name: 'ون سیار آلین - کد ۱۰۱ (تجریش / الهیه)', coords: [35.798, 51.425] as [number, number], eta: '۴ دقیقه', battery: '۹۸٪' },
    { id: 'VAN-102', name: 'ون سیار آلین - کد ۱۰۲ (سعادت‌آباد)', coords: [35.785, 51.365] as [number, number], eta: '۷ دقیقه', battery: '۹۲٪' },
    { id: 'VAN-103', name: 'ون سیار آلین - کد ۱۰۳ (چیتگر / دریاچه)', coords: [35.735, 51.210] as [number, number], eta: '۱۸ دقیقه', battery: '۸۸٪' },
    { id: 'VAN-104', name: 'ون سیار آلین - کد ۱۰۴ (میدان آزادی / اکباتان)', coords: [35.698, 51.335] as [number, number], eta: '۱۲ دقیقه', battery: '۹۵٪' },
    { id: 'VAN-105', name: 'ون سیار آلین - کد ۱۰۵ (شهر ری / جنوب)', coords: [35.590, 51.440] as [number, number], eta: '۲۵ دقیقه', battery: '۱۰۰٪' },
    { id: 'VAN-106', name: 'ون سیار آلین - کد ۱۰۶ (پاسداران / لویزان)', coords: [35.782, 51.485] as [number, number], eta: '۹ دقیقه', battery: '۸۵٪' },
    { id: 'VAN-107', name: 'ون سیار آلین - کد ۱۰۷ (تهرانپارس / شرق)', coords: [35.738, 51.530] as [number, number], eta: '۱۶ دقیقه', battery: '۹۱٪' },
    { id: 'VAN-108', name: 'ون سیار آلین - کد ۱۰۸ (افسریه / خاوران)', coords: [35.645, 51.485] as [number, number], eta: '۲۲ دقیقه', battery: '۹۶٪' },
    { id: 'VAN-109', name: 'ون سیار آلین - کد ۱۰۹ (میدان ولیعصر / مرکز)', coords: [35.702, 51.405] as [number, number], eta: '۱۱ دقیقه', battery: '۸۹٪' },
    { id: 'VAN-110', name: 'ون سیار آلین - کد ۱۱۰ (هفت‌تیر / سهروردی)', coords: [35.728, 51.442] as [number, number], eta: '۸ دقیقه', battery: '۹۴٪' },
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered on user location with optimal zoom level (not too far, perfect visibility)
    const map = L.map(mapContainerRef.current, {
      center: userCoords,
      zoom: 13.5,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add CartoDB Dark Matter tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // 1. User Location Custom HTML Marker (Clean pin icon with no text below)
    const userMarkerHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 50px; height: 50px; border-radius: 9999px; background-color: ${currentTheme.primaryHex}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 38px; height: 38px; border-radius: 9999px; background-color: #000; border: 2.5px solid ${currentTheme.primaryHex}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px ${currentTheme.glowColor}; z-index: 10;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primaryHex}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userMarkerHtml,
      className: 'custom-user-leaflet-icon',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });

    L.marker(userCoords, { icon: userIcon }).addTo(map);

    // 2. Add Real Tehran Charging Stations
    realChargingStations.forEach((station) => {
      const stationHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="width: 36px; height: 36px; border-radius: 9999px; background: #000; border: 2px solid #C5A059; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(197,160,89,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div style="margin-top: 3px; padding: 2px 7px; background: rgba(0,0,0,0.92); border: 1px solid rgba(197,160,89,0.4); border-radius: 8px; color: #E5C178; font-size: 10px; font-weight: 600; white-space: nowrap; backdrop-filter: blur(6px); direction: rtl;">
            ⚡ ${station.name} (${station.power})
          </div>
        </div>
      `;

      const stationIcon = L.divIcon({
        html: stationHtml,
        className: 'custom-station-leaflet-icon',
        iconSize: [160, 60],
        iconAnchor: [80, 30],
      });

      const m = L.marker(station.coords, { icon: stationIcon }).addTo(map);
      m.bindPopup(`
        <div style="direction: ${lang === 'fa' ? 'rtl' : 'ltr'}; color: #fff; padding: 2px;">
          <div style="color: #C5A059; font-size: 13px; font-weight: 700; margin-bottom: 2px;">⚡ ${station.name}</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${t.stationPower}: ${station.power}</div>
          <div style="font-size: 10px; color: #10B981; margin-top: 4px; font-weight: 600;">${t.stationAvailable}</div>
        </div>
      `);
    });

    // 3. Add 10 AleenCar Mobile Charging Vans & find nearest van to user
    let nearestVan = mobileChargingVans[0];
    let minDistance = Math.hypot(userCoords[0] - mobileChargingVans[0].coords[0], userCoords[1] - mobileChargingVans[0].coords[1]);

    mobileChargingVans.forEach((van) => {
      const dist = Math.hypot(userCoords[0] - van.coords[0], userCoords[1] - van.coords[1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestVan = van;
      }

      const vanHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="width: 34px; height: 34px; border-radius: 9999px; background: #06150C; border: 2px solid #10B981; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(16,185,129,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
          </div>
          <div style="margin-top: 3px; padding: 1px 6px; background: rgba(6,21,12,0.92); border: 1px solid rgba(16,185,129,0.4); border-radius: 6px; color: #34D399; font-size: 9px; font-weight: 600; white-space: nowrap; backdrop-filter: blur(6px); direction: rtl;">
            🚐 ${van.id} (${van.eta})
          </div>
        </div>
      `;

      const vanIcon = L.divIcon({
        html: vanHtml,
        className: 'custom-van-leaflet-icon',
        iconSize: [140, 55],
        iconAnchor: [70, 27],
      });

      const vanMarker = L.marker(van.coords, { icon: vanIcon }).addTo(map);
      vanMarker.bindPopup(`
        <div style="direction: ${lang === 'fa' ? 'rtl' : 'ltr'}; color: #fff; padding: 2px;">
          <div style="color: #34D399; font-size: 13px; font-weight: 700; margin-bottom: 2px;">🚐 ${van.name}</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.7);">${t.vanEta}: <strong>${van.eta}</strong></div>
          <div style="font-size: 10px; color: #F59E0B; margin-top: 4px; font-weight: 600;">${t.vanTank}: ${van.battery}</div>
        </div>
      `);
    });

    // 4. Connect a dynamic polyline with theme color from user position to nearest mobile van
    L.polyline([userCoords, nearestVan.coords], {
      color: currentTheme.primaryHex,
      weight: 3.5,
      opacity: 0.85,
      dashArray: '8, 10',
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentTheme, userCoords, lang]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userCoords, 14, { duration: 1 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-dvh bg-obsidian overflow-hidden select-none">
      {/* Real Interactive Leaflet Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Map Control Floating Action Buttons */}
      <div className="absolute left-4 top-20 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="icon-btn shadow-xl"
          title={t.myLocation}
        >
          <Locate className="w-4 h-4 text-gold" />
        </button>

        <button
          onClick={handleZoomIn}
          className="icon-btn shadow-xl text-sm font-bold"
          title={t.zoomIn}
        >
          +
        </button>

        <button
          onClick={handleZoomOut}
          className="icon-btn shadow-xl text-sm font-bold"
          title={t.zoomOut}
        >
          -
        </button>
      </div>

      {/* Seamless Integrated Map Expansion Panel (Zero Page-Jump Booking) */}
      {isMapExpanded && (
        <div className="absolute inset-x-0 bottom-32 z-30 px-4 max-w-lg mx-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          <div className="panel p-5 relative">
            {/* Header close btn */}
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-2 border border-white/[0.09]"
                  style={{ color: currentTheme.primaryHex }}
                >
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">{t.smartChargeTitle}</h3>
                  <p className="text-[11px] text-ink-4 font-mono">{t.currentCharge.replace('{pct}', String(userBatteryPercent))}</p>
                </div>
              </div>
              {onCloseMapExpansion && (
                <button
                  onClick={onCloseMapExpansion}
                  className="btn-ghost text-[11px] px-2.5 py-1.5"
                >
                  {t.close}
                </button>
              )}
            </div>

            {/* Smart Suggestions options right inside the map */}
            <div className="space-y-3">
              {/* Option A: Use 7 kWh from active package */}
              <div
                onClick={() => onSelectChargeOption && onSelectChargeOption('package_7kw')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  chargeOptionSelected === 'package_7kw'
                    ? 'bg-surface-3 border-white/20 shadow-lg'
                    : 'border-white/[0.07] bg-surface-1/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    {chargeOptionSelected === 'package_7kw' && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }}></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink flex items-center gap-2">
                      <span>{t.package7kw}</span>
                      <span className="text-[10px] bg-ok/15 text-ok px-2 py-0.5 rounded-full border border-ok/30">
                        {t.creditFree}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-4 mt-0.5">
                      {t.package7kwDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Option B: Fast Charger 2 km away */}
              <div
                onClick={() => onSelectChargeOption && onSelectChargeOption('fast_charger_2km')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  chargeOptionSelected === 'fast_charger_2km'
                    ? 'bg-surface-3 border-white/20 shadow-lg'
                    : 'border-white/[0.07] bg-surface-1/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    {chargeOptionSelected === 'fast_charger_2km' && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }}></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink flex items-center gap-2">
                      <span>{t.fastChargerTitle}</span>
                      <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                        شارژ DC 150kW
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-4 mt-0.5">{t.fastChargerDesc}</p>
                  </div>
                </div>
              </div>

              {/* Option C: Buy 20 kWh extra */}
              <div
                onClick={() => onSelectChargeOption && onSelectChargeOption('buy_20kw')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  chargeOptionSelected === 'buy_20kw'
                    ? 'bg-surface-3 border-white/20 shadow-lg'
                    : 'border-white/[0.07] bg-surface-1/70 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    {chargeOptionSelected === 'buy_20kw' && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.primaryHex }}></div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink flex items-center gap-2">
                      <span>{t.buy20kwTitle}</span>
                      <span className="text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                        {t.buy20kwBadge}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-4 mt-0.5">{t.buy20kwDesc}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Bundling Checkbox */}
              <div className="pt-2 border-t border-white/[0.07]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-ink-2 hover:text-ink transition">
                  <input
                    type="checkbox"
                    checked={includeDryWash}
                    onChange={(e) => setIncludeDryWash(e.target.checked)}
                    className="w-4 h-4 rounded bg-surface-2 border-white/15 accent-gold cursor-pointer"
                  />
                  <span className="flex-1 text-[11px] leading-relaxed">
                    {t.dryWashAdd} <strong className="text-gold">{t.dryWashName}</strong> {t.dryWashDuring}
                  </span>
                </label>
              </div>

              {/* Confirm Booking CTA */}
              <button
                onClick={() => {
                  if (onConfirmBooking) {
                    const title =
                      chargeOptionSelected === 'fast_charger_2km'
                        ? t.bookFastStation
                        : chargeOptionSelected === 'buy_20kw'
                        ? t.book20kwVan
                        : t.book7kwVan;
                    const kwh = chargeOptionSelected === 'buy_20kw' ? 20 : 7;
                    onConfirmBooking(title, kwh, includeDryWash);
                  }
                }}
                className="btn-accent w-full mt-3 py-3 text-xs"
                style={{ backgroundColor: currentTheme.primaryHex }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.confirmBookingCta}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
