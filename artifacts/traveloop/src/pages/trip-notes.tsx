import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListNotes, getListNotesQueryKey,
  useCreateNote, useUpdateNote, useDeleteNote,
  useGetTrip, getGetTripQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Plus, Trash2, Edit2, Check, X, BookOpen } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function TripNotes() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const { data: trip } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });
  const { data: notes, isLoading } = useListNotes(id, { query: { enabled: !!id, queryKey: getListNotesQueryKey(id) } });
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  function invalidate() { queryClient.invalidateQueries({ queryKey: getListNotesQueryKey(id) }); }

  function addNote() {
    if (!newContent.trim()) return;
    createNote.mutate({ tripId: id, data: { content: newContent.trim() } }, {
      onSuccess: () => { invalidate(); setNewContent(""); toast({ title: "Note added" }); },
    });
  }

  function saveEdit(noteId: number) {
    if (!editContent.trim()) return;
    updateNote.mutate({ tripId: id, noteId, data: { content: editContent.trim() } }, {
      onSuccess: () => { invalidate(); setEditingId(null); toast({ title: "Note updated" }); },
    });
  }

  function startEdit(note: any) { setEditingId(note.id); setEditContent(note.content); }

  function del(noteId: number) {
    deleteNote.mutate({ tripId: id, noteId }, { onSuccess: () => { invalidate(); toast({ title: "Note deleted" }); } });
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <button onClick={() => setLocation(`/trips/${id}`)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> {trip?.name || "Trip"}
        </button>
        <h1 className="text-2xl font-bold">Trip Notes</h1>
        <p className="text-muted-foreground text-sm mt-1">Jot down important details, contacts, reminders.</p>
      </div>

      {/* Add note */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <textarea
          placeholder="Write a note..."
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
        <div className="flex justify-end">
          <Button className="rounded-xl gap-2 shadow-sm shadow-primary/20" onClick={addNote} disabled={createNote.isPending || !newContent.trim()}>
            <Plus className="w-4 h-4" /> Add Note
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note: any) => (
            <div key={note.id} className="bg-card border border-border rounded-2xl p-5 group">
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-xl gap-1.5 h-9" onClick={() => saveEdit(note.id)} disabled={updateNote.isPending}>
                      <Check className="w-3.5 h-3.5" /> Save
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl gap-1.5 h-9" onClick={() => setEditingId(null)}>
                      <X className="w-3.5 h-3.5" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">{format(parseISO(note.createdAt), "MMM d, yyyy · h:mm a")}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(note)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => del(note.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">No notes yet</p>
          <p className="text-xs text-muted-foreground">Use notes to remember hotel check-ins, local contacts, and reminders.</p>
        </div>
      )}
    </div>
  );
}
