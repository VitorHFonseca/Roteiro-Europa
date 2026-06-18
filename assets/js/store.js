import { START_ROUTE, CHECKS, PACK } from "./data.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SESSION_KEY = "roteiroEuropaDbAuth.session";
const STATE_KEY = "roteiroEuropaDbAuth.state";
const ADMIN_CACHE_KEY = "roteiroEuropaDbAuth.adminUsers";

export const DEFAULT_SUPABASE_URL = "https://kkohubqxekingkcaqrlr.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_UuITrkQf1277L8OzXLPYrA_4GwJcrm8";

export const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
  auth:{
    persistSession:true,
    autoRefreshToken:true,
    detectSessionInUrl:true
  }
});

function normalizeEmail(value){
  return String(value || "").trim().toLowerCase();
}

function saveSession(profile){
  const session = {
    id: profile.id,
    name: profile.name || profile.email || "Usuário",
    email: profile.email || "",
    role: profile.role || "user",
    status: profile.status || "active",
    loggedAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export async function initializePresetUsers(){
  const { data } = await supabase.auth.getSession();

  if(!data.session?.user){
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  const profile = await ensureProfile(data.session.user);
  return saveSession(profile);
}

export async function register({name,user,password}){
  const email = normalizeEmail(user);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options:{ data:{ name: name || email } }
  });

  if(error) throw error;

  if(!data.session?.user){
    throw new Error("Conta criada. Confirme seu e-mail, se o Supabase pedir, e depois faça login.");
  }

  const profile = await ensureProfile(data.session.user, name);
  return saveSession(profile);
}

export async function login({user,password}){
  const email = normalizeEmail(user);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if(error) throw error;

  const profile = await ensureProfile(data.user);

  if(profile.status === "blocked") {
    await logout();
    throw new Error("Conta bloqueada pelo administrador.");
  }

  if(profile.status === "deleted") {
    await logout();
    throw new Error("Conta excluída pelo administrador.");
  }

  return saveSession(profile);
}

export async function logout(){
  await supabase.auth.signOut();
  localStorage.removeItem(SESSION_KEY);
}

async function ensureProfile(user, name=""){
  if(!user) throw new Error("Usuário Supabase não encontrado.");

  await supabase.rpc("claim_first_admin").catch(()=>{});

  let { data: profile, error } = await supabase
    .from("profiles")
    .select("id,email,name,role,status,created_at,updated_at")
    .eq("id", user.id)
    .single();

  if(error || !profile){
    const insert = {
      id: user.id,
      email: user.email,
      name: name || user.user_metadata?.name || user.email,
      role: "user",
      status: "active"
    };

    await supabase.from("profiles").upsert(insert);

    const result = await supabase
      .from("profiles")
      .select("id,email,name,role,status,created_at,updated_at")
      .eq("id", user.id)
      .single();

    if(result.error) throw result.error;
    profile = result.data;
  }

  return profile;
}

export async function adminRefreshUsers(adminSession){
  if(adminSession?.role !== "admin") return [];

  const { data, error } = await supabase.rpc("admin_list_profiles");

  if(error) throw error;

  localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(data || []));
  return data || [];
}

export function adminListUsers(adminSession){
  if(adminSession?.role !== "admin") return [];

  try { return JSON.parse(localStorage.getItem(ADMIN_CACHE_KEY) || "[]"); }
  catch { return []; }
}

export async function adminCreateUser(adminSession,{name,user,password,role="user"}){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode criar usuários.");

  const email = normalizeEmail(user);

  const tempClient = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
    auth:{
      persistSession:false,
      autoRefreshToken:false,
      detectSessionInUrl:false,
      storageKey:"roteiro-temp-create-user"
    }
  });

  const { data, error } = await tempClient.auth.signUp({
    email,
    password,
    options:{ data:{ name: name || email } }
  });

  if(error) throw error;

  if(data.user){
    await supabase.rpc("admin_set_profile", {
      target_id: data.user.id,
      new_role: role === "admin" ? "admin" : "user",
      new_status: "active"
    }).catch(()=>{});
  }

  await adminRefreshUsers(adminSession);
  return data.user;
}

export async function adminSetUserStatus(adminSession,userId,status){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  await supabase.rpc("admin_set_profile", {
    target_id:userId,
    new_role:null,
    new_status: status === "blocked" ? "blocked" : "active"
  });

  await adminRefreshUsers(adminSession);
}

export async function adminSetUserRole(adminSession,userId,role){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  await supabase.rpc("admin_set_profile", {
    target_id:userId,
    new_role: role === "admin" ? "admin" : "user",
    new_status:null
  });

  await adminRefreshUsers(adminSession);
}

export async function adminResetPassword(adminSession,userId){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode enviar reset de senha.");

  const users = adminListUsers(adminSession);
  const target = users.find(u => u.id === userId);

  if(!target?.email) throw new Error("E-mail do usuário não encontrado.");

  const { error } = await supabase.auth.resetPasswordForEmail(target.email, {
    redirectTo: location.origin + location.pathname
  });

  if(error) throw error;
}

export async function adminDeleteUser(adminSession,userId){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode excluir usuários.");

  await supabase.rpc("admin_soft_delete_profile", {
    target_id:userId
  });

  localStorage.removeItem(`${STATE_KEY}.${userId}`);
  await adminRefreshUsers(adminSession);
}

export function demoSession(){
  throw new Error("Modo demonstração removido. Use conta Supabase.");
}

export function setSession(profile){
  return saveSession(profile);
}

export function defaultState(){
  const checklist = [];
  Object.entries(CHECKS).forEach(([cat,items]) => items.forEach(text => checklist.push({
    id:crypto.randomUUID(),
    cat,
    text,
    done:false
  })));

  return {
    route:[...START_ROUTE],
    cityDays:{lisboa:2,barcelona:3,zurique:2,paris:4,berlim:3,copenhague:2,veneza:2},
    dayDone:{},
    dayNotes:{},
    daySuggestions:{},
    openDay:null,
    vehicles:[],
    lodgings:[],
    expenses:[],
    checklist,
    pack: PACK.map((p,i)=>({id:"p"+i, cat:p[0], icon:p[1], name:p[2], weight:p[3], done:false})),
    diary:[],
    settings:{
      traveler:"",
      startDate:"",
      aiEndpoint:"",
      supabaseUrl:DEFAULT_SUPABASE_URL,
      supabaseAnonKey:DEFAULT_SUPABASE_ANON_KEY,
      supabaseEmail:"",
      currencyFrom:"EUR",
      currencyTo:"BRL",
      phraseLang:"EN"
    },
    aiHistory:[]
  };
}

function migrate(state){
  state.daySuggestions ||= {};
  state.vehicles ||= [];
  state.lodgings ||= [];
  state.expenses ||= [];
  state.settings ||= {};
  state.settings.supabaseUrl ||= DEFAULT_SUPABASE_URL;
  state.settings.supabaseAnonKey ||= DEFAULT_SUPABASE_ANON_KEY;
  state.settings.supabaseEmail ||= "";
  state.settings.aiEndpoint ||= "";
  return state;
}

export function loadState(userId){
  try{
    const raw = localStorage.getItem(`${STATE_KEY}.${userId}`);
    if(!raw) return defaultState();
    return migrate({...defaultState(), ...JSON.parse(raw)});
  }catch{
    return defaultState();
  }
}

export function saveState(userId,state){
  localStorage.setItem(`${STATE_KEY}.${userId}`, JSON.stringify(state));
}

export function clearState(userId){
  localStorage.removeItem(`${STATE_KEY}.${userId}`);
}
