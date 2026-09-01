import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Library = Database["public"]["Tables"]["libraries"]["Row"];
export type ItemType = Database["public"]["Enums"]["item_type"];
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type BookWithLibrary = Book & { libraries: Library | null };

export async function fetchLibraries(): Promise<Library[]> {
  const { data, error } = await supabase.from("libraries").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchLibraryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("books").select("library_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) counts[row.library_id] = (counts[row.library_id] ?? 0) + 1;
  return counts;
}

export async function fetchLibrary(id: string): Promise<Library | null> {
  const { data, error } = await supabase.from("libraries").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchBooksByLibrary(libraryId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("library_id", libraryId)
    .order("title");
  if (error) throw error;
  return data ?? [];
}

export async function fetchBook(id: string): Promise<BookWithLibrary | null> {
  const { data, error } = await supabase
    .from("books")
    .select("*, libraries(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as BookWithLibrary) ?? null;
}

export async function fetchAllBooks(): Promise<BookWithLibrary[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*, libraries(*)")
    .order("title");
  if (error) throw error;
  return (data ?? []) as BookWithLibrary[];
}

export type BookInput = {
  title: string;
  author: string;
  type: ItemType;
  available: boolean;
  library_id: string;
};

export async function createBook(input: BookInput) {
  const { error } = await supabase.from("books").insert(input);
  if (error) throw error;
}

export async function updateBook(id: string, input: BookInput) {
  const { error } = await supabase.from("books").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteBook(id: string) {
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw error;
}
