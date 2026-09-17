import { useState } from "react";
import { Wifi, WifiOff, Download, Check, CheckCheck, MapPin, Clock, Cloud, Trash2, HardDrive, Signal, Battery, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAVED_DESTINATIONS = [
  { id: "1", name: "Spiti Valley", region: "Himachal Pradesh", saved: true, size: "12 MB", lastSync: "2 hours ago", mapCached: true, infoCached: true },
  { id: "2", name: "Mawlynnong Village", region: "Meghalaya", saved: true, size: "8 MB", lastSync: "5 hours ago", mapCached: true, infoCached: true },
  { id: "3", name: "Gokarna Beach", region: "Karnataka", saved: true, size: "6 MB", lastSync: "1 day ago", mapCached: false, infoCached: true },
  { id: "4", name: "Orchha", region: "Madhya Pradesh", saved: true, size: "5 MB", lastSync: "3 days ago", mapCached: false, infoCached: true },
  { id: "5", name: "Chopta Valley", region: "Uttarakhand", saved: false, size: "—", lastSync: "Never", mapCached: false, infoCached: false },
  { id: "6", name: "Ziro Valley", region: "Arunachal Pradesh", saved: false, size: "—", lastSync: "Never", mapCached: false, infoCached: false },
];

const OFFLINE_FEATURES = [
  { feature: "Destination Info", desc: "Name, description, ratings, reviews", available: true },
  { feature: "Map Tiles", desc: "Cached map area around destination", available: true },
  { feature: "Route Data", desc: "Saved route calculations", available: true },
  { feature: "Weather Data", desc: "Last known weather conditions", available: true },
  { feature: "Emergency Contacts", desc: "Local police, hospital, embassy", available: true },
  { feature: "Photo Gallery", desc: "Selected photos of destination", available: false },
];

export default function OfflineMode() {
  const [destinations, setDestinations] = useState(SAVED_DESTINATIONS);
  const [isOnline, setIsOnline] = useState(true);

  const toggleSave = (id: string) => {
    setDestinations(prev => prev.map(d =>
      d.id === id ? { ...d, saved: !d.saved, mapCached: !d.saved ? true : false } : d
    ));
  };

  const totalSize = destinations.filter(d => d.saved).reduce((sum, d) => sum + parseInt(d.size) || 0, 0);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=1200&q=80" alt="Offline" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/40" />
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white">Offline & Low Bandwidth Mode</h1>
          <p className="text-white/70 text-sm mt-1">Save destinations for access in remote areas with poor connectivity</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? "bg-emerald-100" : "bg-red-100"}`}>
              {isOnline ? <Wifi className="w-5 h-5 text-emerald-600" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            </div>
            <div>
              <p className="text-sm font-bold">{isOnline ? "Online" : "Offline Mode"}</p>
              <p className="text-xs text-muted-foreground">
                {isOnline ? "Connected to network" : "Working with cached data only"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {isOnline ? "Simulate Offline" : "Go Online"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <HardDrive className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{totalSize} MB</p>
            <p className="text-[10px] text-muted-foreground">Storage Used</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <MapPin className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{destinations.filter(d => d.saved).length}</p>
            <p className="text-[10px] text-muted-foreground">Saved Places</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold">2h</p>
            <p className="text-[10px] text-muted-foreground">Last Sync</p>
          </div>
        </div>
      </div>

      {/* Available Offline Features */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-3">Available Offline</h3>
        <div className="space-y-2">
          {OFFLINE_FEATURES.map(f => (
            <div key={f.feature} className="flex items-center gap-3 p-2.5 rounded-xl">
              {f.available ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="w-2 h-0.5 bg-muted-foreground rounded-full" />
                </div>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${f.available ? "" : "text-muted-foreground"}`}>{f.feature}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              {f.available && <span className="text-xs text-emerald-600 font-semibold">✓ Cached</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Saved Destinations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Saved Destinations</h2>
          <Button variant="outline" size="sm" className="rounded-lg gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Sync All
          </Button>
        </div>
        <div className="space-y-3">
          {destinations.map(dest => (
            <div key={dest.id} className={`bg-card border rounded-2xl p-4 flex items-center gap-4 transition-all ${dest.saved ? "border-emerald-200" : "border-border"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dest.saved ? "bg-emerald-100" : "bg-muted"}`}>
                <MapPin className={`w-5 h-5 ${dest.saved ? "text-emerald-600" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">{dest.name}</h3>
                  {dest.saved && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full">Saved</span>}
                </div>
                <p className="text-xs text-muted-foreground">{dest.region}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{dest.size !== "—" ? dest.size : "Not downloaded"}</span>
                  <span className="text-xs text-muted-foreground">Synced: {dest.lastSync}</span>
                  {dest.mapCached && <span className="text-xs text-emerald-600">🗺️ Map</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {dest.saved ? (
                  <Button size="sm" variant="outline" className="rounded-lg text-xs h-8 border-emerald-200 text-emerald-600" onClick={() => toggleSave(dest.id)}>
                    <CheckCheck className="w-3 h-3 mr-1" /> Saved
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="rounded-lg text-xs h-8" onClick={() => toggleSave(dest.id)}>
                    <Download className="w-3 h-3 mr-1" /> Save
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-blue-900 mb-2">💡 Offline Tips</h3>
        <ul className="space-y-1.5 text-xs text-blue-800">
          <li className="flex items-start gap-2"><span>•</span> Save destinations before heading to remote areas with poor connectivity.</li>
          <li className="flex items-start gap-2"><span>•</span> Cached data includes maps, directions, emergency contacts, and destination info.</li>
          <li className="flex items-start gap-2"><span>•</span> Sync when you have WiFi to get the latest weather and crowd data.</li>
          <li className="flex items-start gap-2"><span>•</span> Approximate data usage: ~2-5 MB per saved destination with map tiles.</li>
        </ul>
      </div>
    </div>
  );
}
