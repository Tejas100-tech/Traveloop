import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { useListTrips, getListTripsQueryKey } from "@workspace/api-client-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: trips } = useListTrips({ query: { queryKey: getListTripsQueryKey() } });

  const publicTrips = trips?.filter((t: any) => t.isPublic).length || 0;
  const totalTrips = trips?.length || 0;

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar & name */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="" className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary/20" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4">
            {(user?.firstName?.[0] || "U").toUpperCase()}
          </div>
        )}
        <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
        {user?.email && <p className="text-muted-foreground text-sm mt-1">{user.email}</p>}

        <div className="flex gap-6 mt-5 pt-5 border-t border-border w-full justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{totalTrips}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Trips</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{publicTrips}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Public Trips</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-card border border-border rounded-2xl divide-y divide-border">
        {user?.firstName && (
          <div className="flex items-center gap-3 px-5 py-4">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            </div>
          </div>
        )}
        {user?.email && (
          <div className="flex items-center gap-3 px-5 py-4">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Authentication</p>
            <p className="text-sm font-medium">Replit SSO</p>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full rounded-xl h-11 text-destructive border-destructive/30 hover:bg-destructive/5 gap-2" onClick={logout}>
        <LogOut className="w-4 h-4" /> Log out
      </Button>
    </div>
  );
}
