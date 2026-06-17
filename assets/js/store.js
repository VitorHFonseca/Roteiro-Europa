import { START_ROUTE, CHECKS, PACK } from "./data.js";

const USERS_KEY = "roteiroEuropaAdmin.users";
const SESSION_KEY = "roteiroEuropaAdmin.session";
const STATE_KEY = "roteiroEuropaAdmin.state";

const normalize = value => String(value || "").trim().toLowerCase();

async function sha256(text){
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,"0")).join("");
}

async function hashPassword(password, salt){
  return sha256(`${salt}:${password}:roteiro-europa`);
}

const PRESET_USERS = [
  {
    id:"admin",
    name:"Administrador",
    role:"admin",
    status:"active",
    password:"Admin@2026!",
    salt:"preset-admin-salt-v2"
  },
  {
    id:"usuario",
    name:"Usuário Padrão",
    role:"user",
    status:"active",
    password:"Usuario@2026!",
    salt:"preset-user-salt-v2"
  }
];

let seedPromise = null;

async function ensurePresetUsers(){
  if(seedPromise) return seedPromise;

  seedPromise = (async () => {
    const users = rawUsers();
    let changed = false;

    for(const preset of PRESET_USERS){
      let existing = users.find(u => u.id === preset.id);

      if(!existing){
        existing = {
          id:preset.id,
          name:preset.name,
          role:preset.role,
          status:preset.status,
          salt:preset.salt,
          passwordHash: await hashPassword(preset.password, preset.salt),
          createdAt:new Date().toISOString(),
          updatedAt:new Date().toISOString(),
          preset:true
        };
        users.push(existing);
        changed = true;
      }else{
        existing.name ||= preset.name;
        existing.role = preset.role;
        existing.status = "active";
        existing.salt = preset.salt;
        existing.passwordHash = await hashPassword(preset.password, preset.salt);
        existing.preset = true;
        delete existing.pass;
        existing.updatedAt = new Date().toISOString();
        changed = true;
      }
    }

    if(changed) saveUsers(users);
    return users;
  })();

  return seedPromise;
}

function rawUsers(){
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function getUsers(){
  return rawUsers();
}

export async function initializePresetUsers(){
  return ensurePresetUsers();
}

export function hasUsers(){
  return getUsers().length > 0;
}

export async function register({name,user,password}){
  await ensurePresetUsers();

  const users = rawUsers();
  const id = normalize(user);

  if(users.some(u => u.id === id)){
    throw new Error("Este usuário já existe.");
  }

  const salt = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  const account = {
    id,
    name: String(name || user).trim(),
    role:"user",
    status:"active",
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };

  users.push(account);
  saveUsers(users);
  setSession(account);
  return publicUser(account);
}

export async function login({user,password}){
  await ensurePresetUsers();

  const id = normalize(user);
  const users = rawUsers();
  const account = users.find(u => u.id === id);

  if(!account) throw new Error("Usuário ou senha inválidos.");
  if(account.status === "blocked") throw new Error("Usuário bloqueado pelo administrador.");

  // Fallback forte para os usuários padrão, mesmo se o LocalStorage antigo estiver corrompido.
  if(id === "admin" && String(password) === "Admin@2026!"){
    account.role = "admin";
    account.status = "active";
    account.name = account.name || "Administrador";
    setSession(account);
    return publicUser(account);
  }

  if(id === "usuario" && String(password) === "Usuario@2026!"){
    account.role = "user";
    account.status = "active";
    account.name = account.name || "Usuário Padrão";
    setSession(account);
    return publicUser(account);
  }

  let valid = false;

  if(account.passwordHash && account.salt){
    valid = account.passwordHash === await hashPassword(password, account.salt);
  }else if(account.pass){
    const old = btoa(unescape(encodeURIComponent(String(password))));
    valid = account.pass === old;
    if(valid){
      account.salt = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
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
    id:account.id,
    name:account.name,
    role:account.role || "user",
    loggedAt:new Date().toISOString()
  }));
}

export function demoSession(){
  // mantido só para compatibilidade; botão foi removido.
  const account = { id:"usuario", name:"Usuário Padrão", role:"user", status:"active" };
  setSession(account);
  return account;
}

export function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export function logout(){ localStorage.removeItem(SESSION_KEY); }

export async function adminCreateUser(adminSession,{name,user,password,role="user"}){
  await ensurePresetUsers();

  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode criar usuários.");

  const users = rawUsers();
  const id = normalize(user);

  if(users.some(u => u.id === id)) throw new Error("Este usuário já existe.");

  const salt = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
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
  return rawUsers().map(u => ({
    id:u.id,
    name:u.name,
    role:u.role || "user",
    status:u.status || "active",
    preset:!!u.preset,
    createdAt:u.createdAt,
    updatedAt:u.updatedAt
  }));
}

export function adminSetUserStatus(adminSession,userId,status){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  const users = rawUsers();
  const u = users.find(x => x.id === userId);

  if(!u) throw new Error("Usuário não encontrado.");
  if(u.id === "admin" && status === "blocked") throw new Error("O ADM padrão não pode ser bloqueado.");
  if(u.id === adminSession.id && status === "blocked") throw new Error("ADM não pode bloquear a própria conta.");

  u.status = status === "blocked" ? "blocked" : "active";
  u.updatedAt = new Date().toISOString();
  saveUsers(users);
}

export function adminSetUserRole(adminSession,userId,role){
  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode alterar usuários.");

  const users = rawUsers();
  const u = users.find(x => x.id === userId);

  if(!u) throw new Error("Usuário não encontrado.");
  if(u.id === "admin" && role !== "admin") throw new Error("O ADM padrão não pode perder perfil ADM.");
  if(u.id === adminSession.id && role !== "admin") throw new Error("ADM não pode remover o próprio perfil ADM.");

  u.role = role === "admin" ? "admin" : "user";
  u.updatedAt = new Date().toISOString();
  saveUsers(users);
}

export async function adminResetPassword(adminSession,userId,password){
  await ensurePresetUsers();

  if(adminSession?.role !== "admin") throw new Error("Apenas ADM pode resetar senha.");

  const users = rawUsers();
  const u = users.find(x => x.id === userId);

  if(!u) throw new Error("Usuário não encontrado.");

  u.salt = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  u.passwordHash = await hashPassword(password,u.salt);
  delete u.pass;
  u.updatedAt = new Date().toISOString();
  u.preset = false;
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

export function clearState(userId){
  localStorage.removeItem(`${STATE_KEY}.${userId}`);
}
