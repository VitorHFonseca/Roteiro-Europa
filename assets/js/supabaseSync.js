import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEFAULT_SUPABASE_URL = "https://kkohubqxekingkcaqrlr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_UuITrkQf1277L8OzXLPYrA_4GwJcrm8";
const SESSION_KEY = "roteiroEuropaCustomAuth.session";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
  auth:{ persistSession:false, autoRefreshToken:false, detectSessionInUrl:false }
});

function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function token(){
  const session = getSession();
  if(!session?.token) throw new Error("Sessão expirada. Entre novamente.");
  return session.token;
}

export function isSupabaseConfigured(){
  return true;
}

export async function supabaseCurrentUser(){
  const { data, error } = await supabase.rpc("app_current_user", { p_token: token() });
  if(error) throw error;
  return data?.[0];
}

export async function supabaseSignUp(){
  throw new Error("Cadastro online separado foi removido. Use a tela principal.");
}

export async function supabaseSignIn(){
  throw new Error("Login online separado foi removido. Use a tela principal.");
}

export async function supabaseSignOut(){
  return true;
}

export async function supabasePush(state){
  const clean = JSON.parse(JSON.stringify(state));
  const { error } = await supabase.rpc("app_save_state", {
    p_token: token(),
    p_state: clean
  });
  if(error) throw error;
  return { updated_at:new Date().toISOString() };
}

export async function supabasePull(){
  const { data, error } = await supabase.rpc("app_get_state", {
    p_token: token()
  });
  if(error) throw error;
  return { state:data || null, updated_at:new Date().toISOString() };
}
