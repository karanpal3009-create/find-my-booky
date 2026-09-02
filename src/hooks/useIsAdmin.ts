import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export async function fetchIsAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return false;
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export function useIsAdmin() {
  const query = useQuery({ queryKey: ["is-admin"], queryFn: fetchIsAdmin });
  return { isAdmin: query.data === true, isLoading: query.isPending };
}
