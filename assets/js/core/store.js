import { START_ROUTE, CHECKS, PACK } from "./data.js";

const USERS_KEY = "roteiroEuropaOnline.users";
const SESSION_KEY = "roteiroEuropaOnline.session";
const STATE_KEY = "roteiroEuropaOnline.state";

const encode = value => btoa(unescape(encodeURIComponent(String(value))));
const normalize = value => String(value || "").trim().toLowerCase();

export function getUsers(){
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

export function register({name,user,password}){
  const users = getUsers();
  const id = normalize(user);
  if(users.some(u => u.id === id)) throw new Error("Este usuário já existe.");
  const account = { id, name: String(name || user).trim(), pass: encode(password), createdAt: new Date().toISOString() };
  users.push(account);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setSession(account);
  return account;
}

export function login({user,password}){
  const id = normalize(user);
  const pass = encode(password);
  const account = getUsers().find(u => u.id === id && u.pass === pass);
  if(!account) throw new Error("Usuário ou senha inválidos.");
  setSession(account);
  return account;
}

export function setSession(account){
  localStorage.setItem(SESSION_KEY, JSON.stringify({id:account.id, name:account.name, loggedAt:new Date().toISOString()}));
}

export function demoSession(){
  const account = { id:"demo", name:"Modo Demonstração" };
  setSession(account);
  return account;
}

export function getSession(){
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

export function logout(){
  localStorage.removeItem(SESSION_KEY);
}

export function defaultState(){
  const checklist = [];
  Object.entries(CHECKS).forEach(([cat,items]) => items.forEach(text => checklist.push({id:crypto.randomUUID(), cat, text, done:false})));
  return {
    route:[...START_ROUTE],
    cityDays:{lisboa:2,barcelona:3,zurique:2,paris:4,berlim:3,copenhague:2,veneza:2},
    dayDone:{},
    dayNotes:{},
    openDay:null,
    expenses:[
      {id:crypto.randomUUID(),cat:"Transporte",desc:"Trens internos",amount:390},
      {id:crypto.randomUUID(),cat:"Hospedagem",desc:"Hostels e hotéis",amount:620},
      {id:crypto.randomUUID(),cat:"Alimentação",desc:"Comida e mercado",amount:360},
      {id:crypto.randomUUID(),cat:"Passeios",desc:"Museus e atrações",amount:180}
    ],
    checklist,
    pack: PACK.map((p,i)=>({id:"p"+i, cat:p[0], icon:p[1], name:p[2], weight:p[3], done:false})),
    diary:[],
    settings:{
      traveler:"",
      startDate:"",
      aiEndpoint:"",
      syncEndpoint:"",
      onlineMode:false,
      currencyFrom:"EUR",
      currencyTo:"BRL",
      phraseLang:"EN"
    },
    aiHistory:[]
  };
}

export function loadState(userId){
  try{
    const raw = localStorage.getItem(`${STATE_KEY}.${userId}`);
    if(!raw) return defaultState();
    return {...defaultState(), ...JSON.parse(raw)};
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
