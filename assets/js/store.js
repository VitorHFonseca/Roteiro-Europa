import { START_ROUTE, CHECKS, PACK } from "./data.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SESSION_KEY = "roteiroEuropaCustomAuth.session";
const STATE_KEY = "roteiroEuropaCustomAuth.state";
const ADMIN_CACHE_KEY = "roteiroEuropaCustomAuth.adminUsers";
const REQUEST_CACHE_KEY = "roteiroEuropaCustomAuth.requests";

export const DEFAULT_SUPABASE_URL = "https://kkohubqxekingkcaqrlr.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_UuITrkQf1277L8OzXLPYrA_4GwJcrm8";

export const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
  auth:{
    persistSession:false,
    autoRefreshToken:false,
    detectSessionInUrl:false
  }
});

function normalizeUsername(value){
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9_]+/g,"");
}

function saveSession(profile){
  const session = {
    id: profile.id,
    name: profile.name || profile.username || "Usuário",
    username: profile.username || "",
    role: profile.role || "user",
    status: profile.status || "active",
    token: profile.token || profile.token_hash || profile.session_token || profile.token,
    loggedAt: new Date().toISOString()
  };

  if(!session.token) {
    const old = getSession();
    session.token = old?.token || "";
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export async function initializePresetUsers(){
  const session = getSession();

  if(!session?.token){
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  const { data, error } = await supabase.rpc("app_current_user", {
    p_token: session.token
  });

  if(error || !data?.[0]){
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  return saveSession({...data[0], token:session.token});
}

export async function register({name,user,password,password2}){
  const username = normalizeUsername(name || user);

  if(!username) throw new Error("Digite um nome válido.");
  if(String(password || "").length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  if(password !== password2) throw new Error("As senhas não conferem.");

  const { data, error } = await supabase.rpc("app_register", {
    p_username: username,
    p_name: username,
    p_password: password
  });

  if(error) throw error;

  const profile = data?.[0];
  if(!profile) throw new Error("Não foi possível criar a conta.");

  return saveSession(profile);
}

export async function login({user,password}){
  const username = normalizeUsername(user);

  if(!username) throw new Error("Digite seu nome.");

  const { data, error } = await supabase.rpc("app_login", {
    p_username: username,
    p_password: password
  });

  if(error) throw error;

  const profile = data?.[0];
  if(!profile) throw new Error("Usuário ou senha inválidos.");

  return saveSession(profile);
}

export async function logout(){
  const session = getSession();

  if(session?.token){
    await supabase.rpc("app_logout", { p_token: session.token }).catch(()=>{});
  }

  localStorage.removeItem(SESSION_KEY);
}

function requireToken(){
  const session = getSession();
  if(!session?.token) throw new Error("Sessão expirada. Entre novamente.");
  return session.token;
}

export async function adminRefreshUsers(adminSession){
  if(adminSession?.role !== "admin") return [];

  const { data, error } = await supabase.rpc("admin_list_app_users", {
    p_token: requireToken()
  });

  if(error) throw error;

  localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(data || []));
  return data || [];
}

export function adminListUsers(adminSession){
  if(adminSession?.role !== "admin") return [];

  try { return JSON.parse(localStorage.getItem(ADMIN_CACHE_KEY) || "[]"); }
  catch { return []; }
}

export async function adminCreateUser(adminSession,{name,user,password,password2,role="user"}){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode criar usuários.");

  const username = normalizeUsername(user || name);

  if(!username) throw new Error("Digite um nome de usuário válido.");
  if(String(password || "").length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  if(password2 !== undefined && password !== password2) throw new Error("As senhas não conferem.");

  const { data, error } = await supabase.rpc("admin_create_app_user", {
    p_token: requireToken(),
    p_username: username,
    p_name: name || username,
    p_password: password,
    p_role: role === "admin" ? "admin" : "user"
  });

  if(error) throw error;

  await adminRefreshUsers(adminSession);
  return data;
}

export async function adminSetUserStatus(adminSession,userId,status){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  const { error } = await supabase.rpc("admin_set_app_user", {
    p_token: requireToken(),
    p_user_id:userId,
    p_role:null,
    p_status: status === "blocked" ? "blocked" : "active"
  });

  if(error) throw error;

  await adminRefreshUsers(adminSession);
}

export async function adminSetUserRole(adminSession,userId,role){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  const { error } = await supabase.rpc("admin_set_app_user", {
    p_token: requireToken(),
    p_user_id:userId,
    p_role: role === "admin" ? "admin" : "user",
    p_status:null
  });

  if(error) throw error;

  await adminRefreshUsers(adminSession);
}

export async function adminResetPassword(adminSession,userId,password){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode trocar senha.");
  if(String(password || "").length < 6) throw new Error("A senha precisa ter pelo menos 6 caracteres.");

  const { error } = await supabase.rpc("admin_change_app_password", {
    p_token: requireToken(),
    p_user_id:userId,
    p_password:password
  });

  if(error) throw error;

  await adminRefreshUsers(adminSession);
}

export async function adminDeleteUser(adminSession,userId){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode excluir usuários.");

  const { error } = await supabase.rpc("admin_delete_app_user", {
    p_token: requireToken(),
    p_user_id:userId
  });

  if(error) throw error;

  localStorage.removeItem(`${STATE_KEY}.${userId}`);
  await adminRefreshUsers(adminSession);
}


export async function submitChangeRequest(appSession,{type,title,reason,suggestedState}){
  if(!appSession || appSession.role === "admin") throw new Error("Apenas usuários comuns enviam solicitações.");

  const { data, error } = await supabase.rpc("app_submit_change_request", {
    p_token: requireToken(),
    p_type:type || "geral",
    p_title:title,
    p_reason:reason || "",
    p_suggested_state:suggestedState
  });

  if(error) throw error;
  return data;
}

export async function adminRefreshRequests(adminSession){
  if(adminSession?.role !== "admin") return [];

  const { data, error } = await supabase.rpc("admin_list_change_requests", {
    p_token: requireToken()
  });

  if(error) throw error;

  localStorage.setItem(REQUEST_CACHE_KEY, JSON.stringify(data || []));
  return data || [];
}

export function adminListRequests(adminSession){
  if(adminSession?.role !== "admin") return [];

  try { return JSON.parse(localStorage.getItem(REQUEST_CACHE_KEY) || "[]"); }
  catch { return []; }
}

export async function adminApproveRequest(adminSession,requestId,comment=""){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode aprovar solicitações.");

  const { error } = await supabase.rpc("admin_approve_change_request", {
    p_token: requireToken(),
    p_request_id:requestId,
    p_comment:comment || null
  });

  if(error) throw error;
  await adminRefreshRequests(adminSession);
}

export async function adminRejectRequest(adminSession,requestId,comment=""){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode rejeitar solicitações.");

  const { error } = await supabase.rpc("admin_reject_change_request", {
    p_token: requireToken(),
    p_request_id:requestId,
    p_comment:comment || null
  });

  if(error) throw error;
  await adminRefreshRequests(adminSession);
}


export function demoSession(){
  throw new Error("Modo demonstração removido.");
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
      phraseLang:"EN",
      emergencyName:"",
      emergencyPhone:"",
      emergencyInsurance:"",
      emergencyPolicy:"",
      emergencyPassport:"",
      emergencyEmbassy:"",
      emergencyHotel:"",
      emergencyNotes:"",
      tripStartDate:"",
      tripEndDate:""
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
  state.settings.emergencyName ||= "";
  state.settings.emergencyPhone ||= "";
  state.settings.emergencyInsurance ||= "";
  state.settings.emergencyPolicy ||= "";
  state.settings.emergencyPassport ||= "";
  state.settings.emergencyEmbassy ||= "";
  state.settings.emergencyHotel ||= "";
  state.settings.emergencyNotes ||= "";
  state.settings.tripStartDate ||= "";
  state.settings.tripEndDate ||= "";
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
