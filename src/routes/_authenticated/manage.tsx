import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, LoadingRows, StateBlock, StatusPill } from "@/components/AppShell";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import {
  createBook,
  deleteBook,
  fetchAllBooks,
  fetchLibraries,
  updateBook,
  type BookInput,
  type ItemType,
} from "@/lib/libfind";

export const Route = createFileRoute("/_authenticated/manage")({
  head: () => ({
    meta: [
      { title: "Manage books — LibFind" },
      {
        name: "description",
        content: "Add, edit and remove books and magazines in the LibFind catalogue.",
      },
      { property: "og:title", content: "Manage books — LibFind" },
      {
        property: "og:description",
        content: "Add, edit and remove titles in the LibFind catalogue.",
      },
    ],
  }),
  component: ManageBooks,
});

const emptyForm = (libraryId: string): BookInput => ({
  title: "",
  author: "",
  type: "Book",
  available: true,
  library_id: libraryId,
});

function ManageBooks() {
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const queryClient = useQueryClient();
  const librariesQuery = useQuery({ queryKey: ["libraries"], queryFn: fetchLibraries });
  const booksQuery = useQuery({ queryKey: ["books", "all"], queryFn: fetchAllBooks });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookInput>(emptyForm(""));


  const libraries = librariesQuery.data ?? [];
  const libraryId = form.library_id || libraries[0]?.id || "";

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["books"] });
    queryClient.invalidateQueries({ queryKey: ["library-counts"] });
    queryClient.invalidateQueries({ queryKey: ["book"] });
  }

  const saveMutation = useMutation({
    mutationFn: async (input: BookInput) =>
      editingId ? updateBook(editingId, input) : createBook(input),
    onSuccess: () => {
      toast.success(editingId ? "Title updated" : "Title added");
      setEditingId(null);
      setForm(emptyForm(libraries[0]?.id ?? ""));
      invalidate();
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Couldn't save the title"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      toast.success("Title deleted");
      invalidate();
    },
    onError: (error: unknown) =>
      toast.error(error instanceof Error ? error.message : "Couldn't delete the title"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!libraryId) {
      toast.error("Pick a library first");
      return;
    }
    saveMutation.mutate({ ...form, library_id: libraryId });
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "font-mono text-[11px] uppercase tracking-wider text-muted-foreground";

  if (roleLoading) {
    return (
      <AppShell>
        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <LoadingRows count={3} />
          </div>
        </section>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <section className="bg-cream">
          <div className="mx-auto max-w-2xl px-5 py-20">
            <StateBlock
              tone="error"
              title="Admins only"
              description="This account has view-only access. Browsing and searching the catalogue is available from Home and Search."
            />
          </div>
        </section>
      </AppShell>
    );
  }

  return (

    <AppShell>
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-azure-deep">
            Manage books
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold">Keep the drawer tidy</h1>

          <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
            <form
              onSubmit={handleSubmit}
              className="h-fit space-y-4 rounded-2xl bg-card p-6 ring-1 ring-border"
            >
              <h2 className="font-display text-xl font-bold">
                {editingId ? "Edit title" : "Add a title"}
              </h2>

              <div>
                <label className={labelClass} htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="author">
                  Author
                </label>
                <input
                  id="author"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as ItemType })}
                  className={inputClass}
                >
                  <option value="Book">Book</option>
                  <option value="Magazine">Magazine</option>
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="library">
                  Library
                </label>
                <select
                  id="library"
                  value={libraryId}
                  onChange={(e) => setForm({ ...form, library_id: e.target.value })}
                  className={inputClass}
                >
                  {libraries.map((library) => (
                    <option key={library.id} value={library.id}>
                      {library.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="size-4 accent-ochre"
                />
                Available on the shelf
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-lg bg-azure px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-azure-deep disabled:opacity-60"
                >
                  {saveMutation.isPending ? "Saving…" : editingId ? "Save changes" : "Add title"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm(libraries[0]?.id ?? ""));
                    }}
                    className="rounded-lg border border-input px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <h2 className="mb-4 font-display text-xl font-bold">Catalogue</h2>
              {booksQuery.isPending ? (
                <LoadingRows count={4} />
              ) : booksQuery.isError ? (
                <StateBlock
                  tone="error"
                  title="Couldn't load the catalogue"
                  description="Refresh the page to try again."
                />
              ) : booksQuery.data.length === 0 ? (
                <StateBlock
                  title="Nothing catalogued yet"
                  description="Add your first book or magazine using the form."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="pb-2 font-medium">Title</th>
                        <th className="pb-2 font-medium">Author</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Library</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {booksQuery.data.map((book) => (
                        <tr key={book.id}>
                          <td className="py-3 pr-3 font-display font-semibold">{book.title}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{book.author}</td>
                          <td className="py-3 pr-3 text-muted-foreground">{book.type}</td>
                          <td className="py-3 pr-3 text-muted-foreground">
                            {book.libraries?.name ?? "—"}
                          </td>
                          <td className="py-3 pr-3">
                            <StatusPill available={book.available} />
                          </td>
                          <td className="py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingId(book.id);
                                setForm({
                                  title: book.title,
                                  author: book.author,
                                  type: book.type,
                                  available: book.available,
                                  library_id: book.library_id,
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="mr-2 text-azure-deep hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${book.title}"?`)) {
                                  deleteMutation.mutate(book.id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="text-destructive hover:underline disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
