import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { differenceInDays, parseISO } from "date-fns";
import { IndianRupee, Globe, Lock, Camera, Check, ImageIcon, X } from "lucide-react";

const COVER_PRESETS = [
  { label: "Taj Mahal", url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80" },
  { label: "Jaipur", url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80" },
  { label: "Kerala", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80" },
  { label: "Goa", url: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=800&q=80" },
  { label: "Varanasi", url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80" },
  { label: "Mumbai", url: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80" },
];

const schema = z.object({
  name: z.string().min(1, "Trip name is required"),
  description: z.string().optional(),
  coverPhoto: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalBudget: z.coerce.number().positive("Budget must be a positive number").optional(),
  isPublic: z.boolean().default(false),
}).refine(d => !d.startDate || !d.endDate || d.endDate >= d.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type TripFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<TripFormValues>;
  onSubmit: (values: TripFormValues) => void;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export function TripForm({ defaultValues, onSubmit, isPending, submitLabel, onCancel }: Props) {
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      coverPhoto: "",
      startDate: "",
      endDate: "",
      isPublic: false,
      ...defaultValues,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const coverPhoto = form.watch("coverPhoto");

  const tripDays = startDate && endDate && endDate >= startDate
    ? differenceInDays(new Date(endDate), new Date(startDate)) + 1
    : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Trip Name */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Trip Name <span className="text-red-400">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Golden Triangle Adventure"
                className="rounded-xl h-11 text-sm focus-visible:ring-orange-300"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Description */}
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </FormLabel>
            <FormControl>
              <textarea
                placeholder="What's this trip about? Add highlights, goals, or notes..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm resize-none min-h-[90px] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all placeholder:text-muted-foreground"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Dates */}
        <div>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="startDate" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Start Date <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl h-11 text-sm focus-visible:ring-orange-300" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="endDate" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">End Date <span className="text-red-400">*</span></FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl h-11 text-sm focus-visible:ring-orange-300" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          {tripDays != null && tripDays > 0 && (
            <p className="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              {tripDays} {tripDays === 1 ? "day" : "days"} trip
            </p>
          )}
        </div>

        {/* Budget */}
        <FormField control={form.control} name="totalBudget" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              Total Budget <span className="text-muted-foreground font-normal">(optional)</span>
            </FormLabel>
            <FormControl>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 50000"
                  className="rounded-xl h-11 pl-9 text-sm focus-visible:ring-orange-300"
                  {...field}
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">Set a budget in ₹ to track spending across all stops.</p>
            <FormMessage />
          </FormItem>
        )} />

        {/* Cover Photo */}
        <FormField control={form.control} name="coverPhoto" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              Cover Photo <span className="text-muted-foreground font-normal">(optional)</span>
            </FormLabel>

            {/* Preset grid */}
            <div className="grid grid-cols-3 gap-2">
              {COVER_PRESETS.map((preset) => {
                const selected = field.value === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      field.onChange(selected ? "" : preset.url);
                      setShowCustomUrl(false);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] group transition-all duration-150 ring-offset-1 ${
                      selected ? "ring-2 ring-orange-500 scale-[0.97]" : "ring-1 ring-border hover:ring-orange-300"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className={`absolute inset-0 transition-colors ${selected ? "bg-orange-500/20" : "bg-black/10 group-hover:bg-black/0"}`} />
                    {selected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="absolute bottom-1.5 left-0 right-0 text-center text-white text-[10px] font-semibold drop-shadow">{preset.label}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom URL toggle */}
            <div className="mt-2">
              {!showCustomUrl ? (
                <button
                  type="button"
                  onClick={() => setShowCustomUrl(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Use a custom image URL
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-xl h-9 text-xs focus-visible:ring-orange-300 flex-1"
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => { field.onChange(""); setShowCustomUrl(false); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <FormMessage />
          </FormItem>
        )} />

        {/* Public toggle */}
        <FormField control={form.control} name="isPublic" render={({ field }) => (
          <FormItem className="flex items-center justify-between bg-muted/50 border border-border rounded-xl px-4 py-3.5">
            <div className="flex items-center gap-3">
              {field.value
                ? <Globe className="w-4 h-4 text-green-600 shrink-0" />
                : <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
              }
              <div>
                <FormLabel className="text-sm font-medium mb-0 cursor-pointer">
                  {field.value ? "Public trip" : "Private trip"}
                </FormLabel>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {field.value ? "Anyone with the link can view your itinerary" : "Only you can see this trip"}
                </p>
              </div>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" className="flex-1 rounded-xl h-11 font-medium" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-xl h-11 font-semibold bg-orange-500 hover:bg-orange-600 border-0 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isPending ? "Saving..." : submitLabel}
          </Button>
        </div>

      </form>
    </Form>
  );
}
