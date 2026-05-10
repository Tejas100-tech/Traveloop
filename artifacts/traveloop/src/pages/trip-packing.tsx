import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListPackingItems, getListPackingItemsQueryKey,
  useCreatePackingItem, useUpdatePackingItem, useDeletePackingItem,
  useGetTrip, getGetTripQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Plus, Trash2, Package, CheckCircle2, Circle } from "lucide-react";

const CATEGORIES = ["clothing", "documents", "electronics", "toiletries", "health", "entertainment", "food", "other"];

const categoryColors: Record<string, string> = {
  clothing: "bg-pink-100 text-pink-700",
  documents: "bg-blue-100 text-blue-700",
  electronics: "bg-indigo-100 text-indigo-700",
  toiletries: "bg-cyan-100 text-cyan-700",
  health: "bg-green-100 text-green-700",
  entertainment: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  other: "bg-muted text-muted-foreground",
};

export default function TripPacking() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("clothing");
  const [filter, setFilter] = useState("all");

  const { data: trip } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });
  const { data: items, isLoading } = useListPackingItems(id, { query: { enabled: !!id, queryKey: getListPackingItemsQueryKey(id) } });
  const createItem = useCreatePackingItem();
  const updateItem = useUpdatePackingItem();
  const deleteItem = useDeletePackingItem();

  function invalidate() { queryClient.invalidateQueries({ queryKey: getListPackingItemsQueryKey(id) }); }

  function addItem() {
    if (!newName.trim()) return;
    createItem.mutate({ tripId: id, data: { name: newName.trim(), category: newCategory, isPacked: false } }, {
      onSuccess: () => { invalidate(); setNewName(""); toast({ title: "Item added" }); },
    });
  }

  function togglePacked(item: any) {
    updateItem.mutate({ tripId: id, itemId: item.id, data: { isPacked: !item.isPacked } }, { onSuccess: invalidate });
  }

  function removeItem(itemId: number) {
    deleteItem.mutate({ tripId: id, itemId }, { onSuccess: () => { invalidate(); toast({ title: "Item removed" }); } });
  }

  const grouped = (items || []).reduce((acc: Record<string, any[]>, item: any) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const filtered = filter === "all" ? grouped : filter === "packed"
    ? Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.filter((i: any) => i.isPacked)]).filter(([, v]) => v.length > 0))
    : Object.fromEntries(Object.entries(grouped).map(([k, v]) => [k, v.filter((i: any) => !i.isPacked)]).filter(([, v]) => v.length > 0));

  const totalItems = items?.length || 0;
  const packedItems = items?.filter((i: any) => i.isPacked).length || 0;
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => setLocation(`/trips/${id}`)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> {trip?.name || "Trip"}
        </button>
        <h1 className="text-2xl font-bold">Packing Checklist</h1>
        <p className="text-muted-foreground text-sm mt-1">Stay organized, never forget a thing.</p>
      </div>

      {/* Progress */}
      {totalItems > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">{packedItems} of {totalItems} packed</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          {progress === 100 && <p className="text-xs text-green-600 font-medium mt-2">You're all packed!</p>}
        </div>
      )}

      {/* Add item */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Add item..."
          className="rounded-xl h-10 flex-1"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addItem()}
        />
        <select
          className="rounded-xl h-10 border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-40"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <Button className="rounded-xl h-10 gap-2 shadow-sm shadow-primary/20 shrink-0" onClick={addItem} disabled={createItem.isPending}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "unpacked", "packed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
      ) : Object.keys(filtered).length > 0 ? (
        <div className="space-y-5">
          {Object.entries(filtered).map(([cat, catItems]) => (
            <div key={cat} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[cat] || categoryColors.other}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
                <span className="text-xs text-muted-foreground">{(catItems as any[]).filter(i => i.isPacked).length}/{(catItems as any[]).length}</span>
              </div>
              {(catItems as any[]).map((item: any) => (
                <div key={item.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${item.isPacked ? "bg-muted/50 border-border/50" : "bg-card border-border"}`}>
                  <button onClick={() => togglePacked(item)} className={`shrink-0 transition-colors ${item.isPacked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                    {item.isPacked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <span className={`flex-1 text-sm font-medium transition-all ${item.isPacked ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                  <button onClick={() => removeItem(item.id)} className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">{filter === "all" ? "Nothing to pack yet" : `No ${filter} items`}</p>
          <p className="text-xs text-muted-foreground">Add items using the form above</p>
        </div>
      )}
    </div>
  );
}
