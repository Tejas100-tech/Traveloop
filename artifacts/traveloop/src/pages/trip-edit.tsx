import { useGetTrip, getGetTripQueryKey, useUpdateTrip, getListTripsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { TripForm, TripFormValues } from "./trip-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripEdit() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: trip, isLoading } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });
  const updateTrip = useUpdateTrip();

  function handleSubmit(values: TripFormValues) {
    updateTrip.mutate({
      tripId: id,
      data: {
        name: values.name,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        totalBudget: values.totalBudget,
        isPublic: values.isPublic,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
        toast({ title: "Trip updated!" });
        setLocation(`/trips/${id}`);
      },
      onError: () => toast({ title: "Error", description: "Could not update trip.", variant: "destructive" }),
    });
  }

  if (isLoading) return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );

  if (!trip) return <div className="p-8 text-center text-muted-foreground">Trip not found.</div>;

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Trip</h1>
        <p className="text-muted-foreground text-sm mt-1">Update details for "{trip.name}"</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <TripForm
          defaultValues={{
            name: trip.name,
            description: trip.description ?? "",
            startDate: trip.startDate,
            endDate: trip.endDate,
            totalBudget: trip.totalBudget ?? undefined,
            isPublic: trip.isPublic,
          }}
          onSubmit={handleSubmit}
          isPending={updateTrip.isPending}
          submitLabel="Save Changes"
          onCancel={() => setLocation(`/trips/${id}`)}
        />
      </div>
    </div>
  );
}
