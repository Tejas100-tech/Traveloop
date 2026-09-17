import { useRef, useState } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, LogOut, Mail, MapPin, Shield, Star, User, Wifi } from "lucide-react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATS = [
  { icon: MapPin, label: "Saved Places", value: 4 },
  { icon: Star, label: "Reviews Written", value: 1 },
  { icon: Wifi, label: "Offline Packs", value: 4 },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImageUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initials = (firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  async function handlePhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please choose an image file", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${API}/api/users/me/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dataUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      const { url } = (await res.json()) as { url: string };
      setAvatarUrl(url);
      toast({ title: "Photo updated" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e?.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) throw new Error("Could not save profile");
      toast({ title: "Profile saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar card */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
        <div className="relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/20" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl font-bold">
              {initials}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors disabled:opacity-60"
            title="Change photo"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handlePhoto(f);
            }}
          />
        </div>

        <h2 className="text-xl font-bold mt-4">{firstName || user?.firstName} {lastName || user?.lastName}</h2>
        {user?.email && <p className="text-muted-foreground text-sm mt-1">{user.email}</p>}

        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-border w-full">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit details */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold">Account details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">First name</label>
            <Input className="rounded-xl" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Last name</label>
            <Input className="rounded-xl" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </div>
        </div>
        <Button
          onClick={saveProfile}
          disabled={saving}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-0"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* Info */}
      <div className="bg-card border border-border rounded-2xl divide-y divide-border">
        <div className="flex items-center gap-3 px-5 py-4">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{firstName || user?.firstName} {lastName || user?.lastName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Authentication</p>
            <p className="text-sm font-medium">Email &amp; password (session cookie)</p>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full rounded-xl h-11 text-destructive border-destructive/30 hover:bg-destructive/5 gap-2" onClick={logout}>
        <LogOut className="w-4 h-4" /> Log out
      </Button>
    </div>
  );
}
