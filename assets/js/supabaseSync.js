import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let cachedClient = null;
let cachedKey = "";

function configKey(state){ return `${state.settings.supabaseUrl || ""}|${state.settings.supabaseAnonKey || ""}`; }
export function isSupabaseConfigured(state){ return Boolean(state.settings.supabaseUrl?.trim() && state.settings.supabaseAnonKey?.trim()); }

export function getSupabase(state){
  if(!isSupabaseConfigured(state)) throw new Error("Configure URL e anon key do Supabase primeiro.");
  const key = configKey(state);
  if(!cachedClient || cachedKey !== key){
    cachedClient = createClient(state.settings.supabaseUrl.trim(), state.settings.supabaseAnonKey.trim(), {
      auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
    });
    cachedKey = key;
  }
  return cachedClient;
}

export async function supabaseCurrentUser(state){
  const { data, error } = await getSupabase(state).auth.getUser();
  if(error) throw error;
  return data.user;
}

export async function supabaseSignUp(state, email, password){
  const { data, error } = await getSupabase(state).auth.signUp({ email, password });
  if(error) throw error;
  return data.user;
}

export async function supabaseSignIn(state, email, password){
  const { data, error } = await getSupabase(state).auth.signInWithPassword({ email, password });
  if(error) throw error;
  return data.user;
}

export async function supabaseSignOut(state){
  const { error } = await getSupabase(state).auth.signOut();
  if(error) throw error;
}

function cleanState(state){
  const copy = JSON.parse(JSON.stringify(state));
  copy.settings.supabaseAnonKey = "";
  copy.settings.supabaseUrl = "";
  return copy;
}

export async function supabasePush(state){
  const supabase = getSupabase(state);
  const { data:userData, error:userError } = await supabase.auth.getUser();
  if(userError) throw userError;
  const user = userData.user;
  if(!user) throw new Error("Entre no Supabase antes de sincronizar.");
  const payload = { user_id:user.id, state:cleanState(state), updated_at:new Date().toISOString() };
  const { error } = await supabase.from("trip_states").upsert(payload, { onConflict:"user_id" });
  if(error) throw error;
  return payload;
}

export async function supabasePull(state){
  const supabase = getSupabase(state);
  const { data:userData, error:userError } = await supabase.auth.getUser();
  if(userError) throw userError;
  const user = userData.user;
  if(!user) throw new Error("Entre no Supabase antes de baixar.");
  const { data, error } = await supabase.from("trip_states").select("state, updated_at").eq("user_id", user.id).single();
  if(error) throw error;
  return data;
}
