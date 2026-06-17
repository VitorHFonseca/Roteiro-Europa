import { START_ROUTE, CHECKS, PACK } from "./data.js";

const USERS_KEY = "roteiroEuropaAdmin.users";
const SESSION_KEY = "roteiroEuropaAdmin.session";
const STATE_KEY = "roteiroEuropaAdmin.state";

const normalize = value => String(value || "").trim().toLowerCase();
const rand = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());

const DEFAULT_USERS = [
  {
    id:"admin",
    name:"Administrador",
    role:"admin",
    status:"active",
    salt:"default-admin-salt-v1",
    passwordHash:"126b9b5069cba0066521c1574f43251c75047fb6ead2e3e6947465bd988282b4",
    createdAt:"2026-01-01T00:00:00.000Z",
    updatedAt:"2026-01-01T00:00:00.000Z",
    systemDefault:true
  },
  {
    id:"usuario",
    name:"Usuário Padrão",
    role:"user",
    status:"active",
    salt:"default-user-salt-v1",
    passwordHash:"fc1bfb888e6fee44838d3c937c8b13edec0841fc710a1f2ca4c6c9499f40f9c0",
    createdAt:"2026-01-01T00:00:00.000Z",
    updatedAt:"2026-01-01T00:00:00.000Z",
    systemDefault:true
  }
];

function ensureDefaultUsers(users){
  const list = Array.isArray(users) ? users : [];
  let changed = false;
  for(const def of DEFAULT_USERS){
    const existing = list.find(u => u.id === def.id);
    if(!existing){
      list.push({...def});
      changed = true;
    }else{
      // Garante que as contas padrão continuem ativas e com os papéis corretos.
      existing.role = def.role;
      existing.status = existing.status || "active";
      existing.systemDefault = true;
    }
  }
  if(changed) localStorage.setItem(USERS_KEY, JSON.stringify(list));
  return list;
}

async function sha256(text){
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,"0")).join("");
}

async function hashPassword(password, salt){
  return sha256(`${salt}:${password}:roteiro-europa`);
}

export function getUsers(){
  try { return ensureDefaultUsers(JSON.parse(localStorage.getItem(USERS_KEY) || "[]")); }
  catch { return ensureDefaultUsers([]); }
}

function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
export function hasUsers(){ return getUsers().length > 0; }

export async function register({name,user,password}){
  const users = getUsers();
  const id = normalize(user);
  if(users.some(u => u.id === id)) throw new Error("Este usuário já existe.");
  const salt = rand();
  const role = "user";
  const account = {
    id,
    name: String(name || user).trim(),
    role,
    status:"active",
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(account);
  saveUsers(users);
  setSession(account);
  return publicUser(account);
}

export async function login({user,password}){
  const id = normalize(user);
  const users = getUsers();
  const account = users.find(u => u.id === id);
  if(!account) throw new Error("Usuário ou senha inválidos.");
  if(account.status === "blocked") throw new Error("Usuário bloqueado pelo administrador.");

  let valid = false;
  if(account.passwordHash && account.salt){
    valid = account.passwordHash === await hashPassword(password, account.salt);
  }else if(account.pass){
    // compatibilidade com versões antigas que usavam base64
    const old = btoa(unescape(encodeURIComponent(String(password))));
    valid = account.pass === old;
    if(valid){
      account.salt = rand();
      account.passwordHash = await hashPassword(password, account.salt);
      delete account.pass;
      account.updatedAt = new Date().toISOString();
      saveUsers(users);
    }
  }

  if(!valid) throw new Error("Usuário ou senha inválidos.");
  setSession(account);
  return publicUser(account);
}

function publicUser(account){
  return {id:account.id,name:account.name,role:account.role,status:account.status};
}

export function setSession(account){
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id:account.id, name:account.name, role:account.role || "user", loggedAt:new Date().toISOString()
  }));
}

export function demoSession(){
  const account = { id:"demo", name:"Modo Demonstração", role:"user", status:"active" };
  setSession(account);
  return account;
}

export function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export function logout(){ localStorage.removeItem(SESSION_KEY); }

export async function adminCreateUser(adminSession,{name,user,password,role="user"}){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode criar usuários.");
  const users = getUsers();
  const id = normalize(user);
  if(users.some(u => u.id === id)) throw new Error("Este usuário já existe.");
  const salt = rand();
  const account = {
    id,
    name: String(name || user).trim(),
    role: role === "admin" ? "admin" : "user",
    status:"active",
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
  users.push(account);
  saveUsers(users);
  return publicUser(account);
}

export function adminListUsers(adminSession){
  if(adminSession?.role !== "admin") return [];
  return getUsers().map(u => ({
    id:u.id,name:u.name,role:u.role || "user",status:u.status || "active",
    createdAt:u.createdAt,updatedAt:u.updatedAt
  }));
}

export function adminSetUserStatus(adminSession,userId,status){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(!u) throw new Error("Usuário não encontrado.");
  if(u.id === adminSession.id && status === "blocked") throw new Error("ADM não pode bloquear a própria conta.");
  u.status = status === "blocked" ? "blocked" : "active";
  u.updatedAt = new Date().toISOString();
  saveUsers(users);
}

export function adminSetUserRole(adminSession,userId,role){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(!u) throw new Error("Usuário não encontrado.");
  if(u.id === adminSession.id && role !== "admin") throw new Error("ADM não pode remover o próprio perfil ADM.");
  u.role = role === "admin" ? "admin" : "user";
  u.updatedAt = new Date().toISOString();
  saveUsers(users);
}

export async function adminResetPassword(adminSession,userId,password){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode resetar senha.");
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if(!u) throw new Error("Usuário não encontrado.");
  u.salt = rand();
  u.passwordHash = await hashPassword(password,u.salt);
  delete u.pass;
  u.updatedAt = new Date().toISOString();
  saveUsers(users);
}

export function defaultState(){
  const checklist = [];
  Object.entries(CHECKS).forEach(([cat,items]) => items.forEach(text => checklist.push({id:crypto.randomUUID(), cat, text, done:false})));
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
      supabaseUrl:"",
      supabaseAnonKey:"",
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
  state.settings.supabaseUrl ||= "";
  state.settings.supabaseAnonKey ||= "";
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

export function clearState(userId){ localStorage.removeItem(`${STATE_KEY}.${userId}`); }
