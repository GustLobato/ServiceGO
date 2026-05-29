import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle2, MapPin, Shield, Star, Play, RotateCcw, Compass, Search, Eye, X, Send } from "lucide-react";

interface LiveTrackerMapProps {
  userLocation: [number, number] | null;
  isLocating: boolean;
}

interface Professional {
  id: string;
  name: string;
  category: string;
  coordsOffset: [number, number];
  rating: number;
  services: number;
  iconBg: string;
  iconColor: string;
  iconHtml: string;
}

const NEARBY_PROFESSIONALS: Professional[] = [];

const LiveTrackerMap = ({ userLocation, isLocating }: LiveTrackerMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Active Order state: null means nearby mode; otherwise tracking mode
  const [activeOrder, setActiveOrder] = useState<{
    name: string;
    category: string;
    coords: [number, number];
  } | null>(null);

  // Simulation States
  const [routeIndex, setRouteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  
  // Coordinates for simulation
  const [coords, setCoords] = useState<{
    client: [number, number];
    provider: [number, number];
    route: [number, number][];
  }>(() => {
    // Default: Paulista, São Paulo
    const client: [number, number] = [-23.5595, -46.6624];
    const provider: [number, number] = [-23.5492, -46.6534];
    const route = generateMockRoute(provider, client);
    return { client, provider, route };
  });

  // Markers and Layer Refs
  const clientMarkerRef = useRef<L.Marker | null>(null);
  const providerMarkerRef = useRef<L.Marker | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const nearbyMarkersRef = useRef<L.Marker[]>([]);

  // Generate curved bezier path
  function generateMockRoute(start: [number, number], end: [number, number]): [number, number][] {
    const points: [number, number][] = [];
    const steps = 100;
    
    const corner1: [number, number] = [
      start[0] + (end[0] - start[0]) * 0.35 + 0.0016,
      start[1] + (end[1] - start[1]) * 0.35 - 0.0010
    ];
    const corner2: [number, number] = [
      start[0] + (end[0] - start[0]) * 0.70 - 0.0010,
      start[1] + (end[1] - start[1]) * 0.70 + 0.0016
    ];
    
    const s1 = Math.floor(steps * 0.35);
    for (let i = 0; i < s1; i++) {
      const t = i / s1;
      points.push([start[0] + (corner1[0] - start[0]) * t, start[1] + (corner1[1] - start[1]) * t]);
    }
    const s2 = Math.floor(steps * 0.35);
    for (let i = 0; i < s2; i++) {
      const t = i / s2;
      points.push([corner1[0] + (corner2[0] - corner1[0]) * t, corner1[1] + (corner2[1] - corner1[1]) * t]);
    }
    const s3 = steps - s1 - s2;
    for (let i = 0; i <= s3; i++) {
      const t = i / s3;
      points.push([corner2[0] + (end[0] - corner2[0]) * t, corner2[1] + (end[1] - corner2[1]) * t]);
    }
    return points;
  }

  // Calculate ETA and Distance
  const totalDistance = 2.4;
  const totalETA = 12;
  const progress = activeOrder ? routeIndex / (coords.route.length - 1 || 1) : 0;
  
  const distanceRemaining = Math.max(0.1, Number((totalDistance * (1 - progress)).toFixed(1)));
  const etaRemaining = Math.max(1, Math.round(totalETA * (1 - progress)));
  
  let currentStep = 0;
  if (activeOrder) {
    if (progress > 0.05 && progress < 0.85) currentStep = 1;
    else if (progress >= 0.85 && progress < 0.99) currentStep = 2;
    else if (progress >= 0.99) currentStep = 3;
  }

  // Handle geolocation or address change
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const client = userLocation;
      // Position default Carlos Silva starting position
      const provider: [number, number] = [userLocation[0] + 0.0048, userLocation[1] - 0.0052];
      const route = generateMockRoute(provider, client);
      
      setCoords({ client, provider, route });
      
      // Invalidate active order when client moves to new geolocated space
      setActiveOrder(null);
      setRouteIndex(0);
      setIsPlaying(false);
      
      mapRef.current.flyTo(client, 14, { duration: 1.5 });
    }
  }, [userLocation]);

  // Map Instance Init
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: false,
      boxZoom: false,
      dragRotate: false
    }).setView(coords.client, 14);

    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Global listener for "hire-professional" events
    const handleHireEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; category: string }>;
      const { name, category } = customEvent.detail;
      
      // Find coordinates of target or set default offset
      const profMeta = NEARBY_PROFESSIONALS.find(p => p.name === name);
      const offset = profMeta?.coordsOffset || [0.0048, -0.0052];
      const providerCoords: [number, number] = [coords.client[0] + offset[0], coords.client[1] + offset[1]];
      const route = generateMockRoute(providerCoords, coords.client);

      setCoords(p => ({ ...p, provider: providerCoords, route }));
      setActiveOrder({
        name,
        category,
        coords: providerCoords
      });
      setRouteIndex(0);
      setIsPlaying(true);

      if (mapRef.current) {
        mapRef.current.flyTo(coords.client, 14, { duration: 1.2 });
      }
    };

    window.addEventListener("hire-professional", handleHireEvent);

    return () => {
      window.removeEventListener("hire-professional", handleHireEvent);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coords.client]);

  // Sync state between Search Mode (nearby) and Tracking Mode (route polyline)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old nearby markers
    nearbyMarkersRef.current.forEach(m => m.remove());
    nearbyMarkersRef.current = [];

    // Custom client icon
    const clientHtmlIcon = L.divIcon({
      className: "",
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-12 w-12 rounded-full bg-green-400 opacity-25 animate-ping"></span>
          <div class="relative w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    if (!clientMarkerRef.current) {
      clientMarkerRef.current = L.marker(coords.client, { icon: clientHtmlIcon }).addTo(map);
    } else {
      clientMarkerRef.current.setLatLng(coords.client);
    }

    if (activeOrder === null) {
      // ──────────────────────────────────────────────────────────
      // 🟢 MODE A: Search Mode (Show 4 nearby professionals)
      // ──────────────────────────────────────────────────────────
      
      // Clean up tracking layers
      if (providerMarkerRef.current) { providerMarkerRef.current.remove(); providerMarkerRef.current = null; }
      if (carMarkerRef.current) { carMarkerRef.current.remove(); carMarkerRef.current = null; }
      if (routePolylineRef.current) { routePolylineRef.current.remove(); routePolylineRef.current = null; }

      NEARBY_PROFESSIONALS.forEach((prof) => {
        const profCoords: [number, number] = [
          coords.client[0] + prof.coordsOffset[0],
          coords.client[1] + prof.coordsOffset[1]
        ];

        const profIcon = L.divIcon({
          className: "",
          html: `
            <div class="relative flex items-center justify-center">
              <span class="absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-20 animate-pulse"></span>
              <div class="relative w-9 h-9 rounded-2xl bg-white border-2 border-primary flex items-center justify-center text-primary shadow-md hover:scale-110 transition-transform duration-200">
                ${prof.iconHtml}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        // Beautiful styled popup with contratar simulator
        const popupContent = `
          <div class="p-3 w-44 font-sans text-left">
            <h5 class="font-extrabold text-sm text-gray-900 leading-tight">${prof.name}</h5>
            <p class="text-xs text-gray-400 mt-1 font-semibold">${prof.category}</p>
            <div class="flex items-center gap-1 mt-2">
              <span class="text-xs font-bold text-amber-500 flex items-center">⭐ ${prof.rating}</span>
              <span class="text-[10px] text-gray-400 font-medium">(${prof.services} serv.)</span>
            </div>
            <button 
              id="pop-btn-${prof.id}"
              class="w-full mt-3 bg-primary hover:bg-orange-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm shadow-orange-100 transition-colors pointer-events-auto"
            >
              Simular Contratação
            </button>
          </div>
        `;

        const marker = L.marker(profCoords, { icon: profIcon }).addTo(map).bindPopup(popupContent, {
          closeButton: false,
          offset: [0, -10]
        });

        // Listen for popup open to bind the click button event handler
        marker.on("popupopen", () => {
          const btn = document.getElementById(`pop-btn-${prof.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("hire-professional", {
                detail: { name: prof.name, category: prof.category }
              }));
            };
          }
        });

        nearbyMarkersRef.current.push(marker);
      });

    } else {
      // ──────────────────────────────────────────────────────────
      // 🔴 MODE B: Tracking Mode (Show path and moving car)
      // ──────────────────────────────────────────────────────────
      
      const providerHtmlIcon = L.divIcon({
        className: "",
        html: `
          <div class="relative w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const carHtmlIcon = L.divIcon({
        className: "",
        html: `
          <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary shadow-md transform rotate-[12deg] relative">
            <span class="absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-25 animate-ping -z-10"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h8"/><path d="M13 11h3"/></svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Hired starting pin
      if (!providerMarkerRef.current) {
        providerMarkerRef.current = L.marker(coords.provider, { icon: providerHtmlIcon }).addTo(map);
      } else {
        providerMarkerRef.current.setLatLng(coords.provider);
      }

      // Curved dashed path
      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(coords.route, {
          color: "#f97316",
          weight: 4.5,
          dashArray: "6, 6",
          opacity: 0.85
        }).addTo(map);
      } else {
        routePolylineRef.current.setLatLngs(coords.route);
      }

      // Moving car
      const carPos = coords.route[routeIndex] || coords.provider;
      setCurrentCoords(carPos);
      
      if (!carMarkerRef.current) {
        carMarkerRef.current = L.marker(carPos, { icon: carHtmlIcon }).addTo(map);
      } else {
        carMarkerRef.current.setLatLng(carPos);
      }
    }

  }, [coords, activeOrder, routeIndex]);

  // Car Drive Simulation Loop
  useEffect(() => {
    if (!isPlaying || !activeOrder) return;

    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        if (prev >= coords.route.length - 1) {
          setIsPlaying(false);
          // Briefly display finished notification, then hold
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, activeOrder, coords]);

  const handleCancelOrder = () => {
    setActiveOrder(null);
    setRouteIndex(0);
    setIsPlaying(false);
    if (mapRef.current) {
      mapRef.current.flyTo(coords.client, 14, { duration: 1 });
    }
  };

  const handleRestart = () => {
    setRouteIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-white rounded-[32px] border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-[540px]">
      
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-none">
              {activeOrder ? "Acompanhamento em tempo real" : "Profissionais na sua área"}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-none">
              {activeOrder 
                ? (currentStep === 3 ? `${activeOrder.name} chegou ao destino!` : `${activeOrder.name} está a caminho`) 
                : "Aguardando cadastro de prestadores na sua área"}
            </p>
          </div>
        </div>

        {activeOrder ? (
          <button 
            onClick={handleCancelOrder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 hover:bg-red-50 text-[10px] sm:text-xs font-bold text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Voltar ao Mapa
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-gray-100 text-[10px] sm:text-xs font-extrabold text-gray-500 border border-gray-200 uppercase tracking-wide">
            Nenhum Ativo
          </div>
        )}
      </div>

      {/* 2. Map View Area */}
      <div className="relative flex-grow min-h-0 w-full z-0">
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Overlay cards */}
        {activeOrder ? (
          /* ACTIVE TRACKING OVERLAY */
          <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2 pointer-events-none">
            {/* Card 1: Prestador a caminho */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-150 p-3 flex items-center gap-3 w-[180px] pointer-events-auto transform translate-y-0 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h8"/><path d="M13 11h3"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5 leading-none">
                  {currentStep === 3 ? "Chegou!" : `Chegada em ${etaRemaining} min`}
                </p>
              </div>
            </div>

            {/* Card 2: Distância */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-150 p-3 flex items-center gap-3 w-[180px] pointer-events-auto transform translate-y-0 hover:-translate-y-0.5 transition-transform duration-200">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distância</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5 leading-none">
                  {currentStep === 3 ? "Destino" : `${distanceRemaining} km`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* NEARBY SERVICES MODE OVERLAY */
          <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2 pointer-events-none">
            {/* Card 1: Active professionals count */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-150 p-3 flex items-center gap-3 w-[180px] pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Serviços Próximos</p>
                <p className="text-xs font-extrabold text-gray-500 mt-0.5 leading-none">Nenhum na sua área</p>
              </div>
            </div>

            {/* Card 2: Geolocation preference status */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-150 p-3 flex items-center gap-3 w-[180px] pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Região de busca</p>
                <p className="text-xs font-extrabold text-gray-900 mt-0.5 leading-none truncate">
                  {userLocation ? "Localização GPS" : "São Paulo, SP"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic tracking compass / loading */}
        {isLocating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[500] flex flex-col items-center justify-center gap-3">
            <Compass className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-bold text-gray-800">Obtendo sua localização real...</p>
          </div>
        )}
      </div>

      {/* 3. Bottom Stepper Progress Bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 shrink-0 z-10">
        {activeOrder ? (
          /* ACTIVE ORDER STEPPER */
          <div className="grid grid-cols-4 gap-2 text-center relative">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                currentStep >= 0 
                  ? "bg-green-500 border-green-500 text-white shadow-sm shadow-green-100" 
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}>
                {currentStep > 0 ? "✓" : "1"}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 mt-1.5 block leading-tight">Solicitação</span>
              <span className="text-[8px] text-gray-400 mt-0.5 block leading-none">Confirmada</span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                currentStep >= 1 
                  ? "bg-primary border-primary text-white shadow-sm shadow-orange-100" 
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}>
                {currentStep > 1 ? "✓" : "2"}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 mt-1.5 block leading-tight">A caminho</span>
              <span className="text-[8px] text-primary mt-0.5 block font-bold leading-none">
                {currentStep === 1 ? `${etaRemaining} min` : currentStep > 1 ? "Ok" : "Aguardando"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                currentStep >= 2 
                  ? "bg-primary border-primary text-white shadow-sm shadow-orange-100" 
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}>
                {currentStep > 2 ? "✓" : "3"}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 mt-1.5 block leading-tight">Chegando</span>
              <span className="text-[8px] text-gray-400 mt-0.5 block leading-none">
                {currentStep === 2 ? "Em breve" : currentStep > 2 ? "Ok" : "Pendente"}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                currentStep >= 3 
                  ? "bg-green-500 border-green-500 text-white shadow-sm shadow-green-100" 
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}>
                {currentStep === 3 ? "✓" : "4"}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 mt-1.5 block leading-tight">Concluído</span>
              <span className="text-[8px] text-gray-400 mt-0.5 block leading-none">
                {currentStep === 3 ? (
                  <button onClick={handleRestart} className="text-primary font-bold hover:underline">Reiniciar</button>
                ) : "Avaliar serviço"}
              </span>
            </div>
          </div>
        ) : (
          /* READY / INSTRUCTIONS MODE STEPPER */
          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-150 flex items-center justify-center text-primary flex-shrink-0">
              <Search className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-gray-900 leading-tight">Sem profissionais cadastrados nesta região ainda</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">
                Cadastre-se como prestador de serviço para ser o primeiro profissional a aparecer na sua cidade!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Info Banner */}
      <div className="bg-orange-50/50 border-t border-orange-100/40 px-5 py-3.5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100/60 flex items-center justify-center text-primary flex-shrink-0">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-gray-900 leading-tight">Seguro e verificado</p>
            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
              Todos os profissionais são verificados e avaliados pela comunidade
            </p>
          </div>
        </div>
        <a 
          href="#how-it-works"
          className="text-[10px] sm:text-xs font-bold text-primary hover:text-orange-600 hover:translate-x-0.5 transition-all flex items-center gap-0.5 whitespace-nowrap"
        >
          Saiba mais
          <span>➔</span>
        </a>
      </div>

    </div>
  );
};

export default LiveTrackerMap;
