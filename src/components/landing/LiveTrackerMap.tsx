import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle2, MapPin, Shield, Star, Play, RotateCcw, Compass } from "lucide-react";

interface LiveTrackerMapProps {
  userLocation: [number, number] | null;
  isLocating: boolean;
}

const LiveTrackerMap = ({ userLocation, isLocating }: LiveTrackerMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Simulation States
  const [routeIndex, setRouteIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  
  // Coordinates for simulation
  const [coords, setCoords] = useState<{
    client: [number, number];
    provider: [number, number];
    route: [number, number][];
  }>(() => {
    // Default: Av. Paulista, São Paulo
    const client: [number, number] = [-23.5595, -46.6624];
    const provider: [number, number] = [-23.5492, -46.6534];
    const route = generateMockRoute(provider, client);
    return { client, provider, route };
  });

  // Markers Refs
  const clientMarkerRef = useRef<L.Marker | null>(null);
  const providerMarkerRef = useRef<L.Marker | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Generate a realistic street-like curved route
  function generateMockRoute(start: [number, number], end: [number, number]): [number, number][] {
    const points: [number, number][] = [];
    const steps = 120;
    
    // Add two street-style corners to avoid a straight line
    const corner1: [number, number] = [
      start[0] + (end[0] - start[0]) * 0.35 + 0.0018,
      start[1] + (end[1] - start[1]) * 0.35 - 0.0012
    ];
    
    const corner2: [number, number] = [
      start[0] + (end[0] - start[0]) * 0.70 - 0.0012,
      start[1] + (end[1] - start[1]) * 0.70 + 0.0018
    ];
    
    // Segment 1: start -> corner1
    const s1 = Math.floor(steps * 0.35);
    for (let i = 0; i < s1; i++) {
      const t = i / s1;
      points.push([start[0] + (corner1[0] - start[0]) * t, start[1] + (corner1[1] - start[1]) * t]);
    }
    
    // Segment 2: corner1 -> corner2
    const s2 = Math.floor(steps * 0.35);
    for (let i = 0; i < s2; i++) {
      const t = i / s2;
      points.push([corner1[0] + (corner2[0] - corner1[0]) * t, corner1[1] + (corner2[1] - corner1[1]) * t]);
    }
    
    // Segment 3: corner2 -> end
    const s3 = steps - s1 - s2;
    for (let i = 0; i <= s3; i++) {
      const t = i / s3;
      points.push([corner2[0] + (end[0] - corner2[0]) * t, corner2[1] + (end[1] - corner2[1]) * t]);
    }
    
    return points;
  }

  // Calculate Distance and ETA dynamically based on route index
  const totalDistance = 2.4; // km
  const totalETA = 12; // minutes
  const progress = routeIndex / (coords.route.length - 1 || 1);
  
  const distanceRemaining = Math.max(0.1, Number((totalDistance * (1 - progress)).toFixed(1)));
  const etaRemaining = Math.max(1, Math.round(totalETA * (1 - progress)));
  
  // Stepper state helper
  let currentStep = 0; // Solicitação
  if (progress > 0.05 && progress < 0.85) {
    currentStep = 1; // A caminho
  } else if (progress >= 0.85 && progress < 0.99) {
    currentStep = 2; // Chegando
  } else if (progress >= 0.99) {
    currentStep = 3; // Concluído
  }

  // Handle Location changes (triggered when user clicks "Usar minha localização")
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const client = userLocation;
      // Position provider about 1.2km north-east
      const provider: [number, number] = [userLocation[0] + 0.0075, userLocation[1] + 0.0075];
      const route = generateMockRoute(provider, client);
      
      setCoords({ client, provider, route });
      setRouteIndex(0);
      setIsPlaying(true);
      
      // Fly map to new coordinates
      mapRef.current.flyTo(client, 15, { duration: 2 });
    }
  }, [userLocation]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Map instance
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: false,
      boxZoom: false,
      dragRotate: false
    }).setView(coords.client, 14);

    mapRef.current = map;

    // 2. Add ultra-clean CartoDB Positron tiles (looks premium light-gray)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19
    }).addTo(map);

    // 3. Move zoom control to bottom right so it doesn't overlap header
    L.control.zoom({ position: "bottomright" }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Markers and Path with coords and routeIndex
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Create Custom HTML Marker Icons using L.divIcon
    const clientHtmlIcon = L.divIcon({
      className: "",
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-12 w-12 rounded-full bg-green-400 opacity-30 animate-ping"></span>
          <div class="relative w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

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
        <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary shadow-md transform rotate-[15deg]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h8"/><path d="M13 11h3"/></svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // 1. Client Marker (Sua Localização)
    if (!clientMarkerRef.current) {
      clientMarkerRef.current = L.marker(coords.client, { icon: clientHtmlIcon }).addTo(map);
    } else {
      clientMarkerRef.current.setLatLng(coords.client);
    }

    // 2. Provider Marker (Prestador)
    if (!providerMarkerRef.current) {
      providerMarkerRef.current = L.marker(coords.provider, { icon: providerHtmlIcon }).addTo(map);
    } else {
      providerMarkerRef.current.setLatLng(coords.provider);
    }

    // 3. Route Polyline
    if (!routePolylineRef.current) {
      routePolylineRef.current = L.polyline(coords.route, {
        color: "#f97316",
        weight: 4,
        dashArray: "6, 6",
        opacity: 0.8
      }).addTo(map);
    } else {
      routePolylineRef.current.setLatLngs(coords.route);
    }

    // 4. Moving Car Marker
    const carPos = coords.route[routeIndex] || coords.provider;
    setCurrentCoords(carPos);
    
    if (!carMarkerRef.current) {
      carMarkerRef.current = L.marker(carPos, { icon: carHtmlIcon }).addTo(map);
    } else {
      carMarkerRef.current.setLatLng(carPos);
    }

  }, [coords, routeIndex]);

  // Car Tracking Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRouteIndex((prev) => {
        if (prev >= coords.route.length - 1) {
          // Pause at arrival briefly, then loop back
          setIsPlaying(false);
          setTimeout(() => {
            setRouteIndex(0);
            setIsPlaying(true);
          }, 3500);
          return prev;
        }
        return prev + 1;
      });
    }, 280); // Speed of animation

    return () => clearInterval(interval);
  }, [isPlaying, coords]);

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
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-none">Acompanhamento em tempo real</h4>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {currentStep === 3 ? "Prestador chegou ao destino!" : "Prestador a caminho do cliente"}
            </p>
          </div>
        </div>
        <button 
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-[10px] sm:text-xs font-semibold text-gray-600 transition-colors"
        >
          {isPlaying ? (
            <>
              <RotateCcw className="h-3 w-3 text-primary animate-spin" style={{ animationDuration: '4s' }} />
              Simulando
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-primary text-primary" />
              Reiniciar
            </>
          )}
        </button>
      </div>

      {/* 2. Map View Area */}
      <div className="relative flex-grow min-h-0 w-full z-0">
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Floating status cards inside the map (Mock overlay) */}
        <div className="absolute right-4 top-4 z-[400] flex flex-col gap-2 pointer-events-none">
          {/* Card 1: Prestador a caminho */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-150 p-3 flex items-center gap-3 w-[180px] pointer-events-auto transform translate-y-0 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-primary flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h8"/><path d="M13 11h3"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prestador a caminho</p>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">
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
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                {currentStep === 3 ? "Destino" : `${distanceRemaining} km`}
              </p>
            </div>
          </div>
        </div>

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
        <div className="grid grid-cols-4 gap-2 text-center relative">
          
          {/* Stepper items */}
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
              4
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 mt-1.5 block leading-tight">Concluído</span>
            <span className="text-[8px] text-gray-400 mt-0.5 block leading-none">Avalie o serviço</span>
          </div>
        </div>
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
