export const KEY="mochilaoEuropaFinal.v2";
export const base=()=>({profile:{name:"Mochilão Europa",traveler:"",start:"",end:"",currency:"EUR",daily:80},cities:[],expenses:[],checks:[{id:crypto.randomUUID(),text:"Passaporte válido",cat:"Documentos",done:false},{id:crypto.randomUUID(),text:"Seguro viagem",cat:"Documentos",done:false},{id:crypto.randomUUID(),text:"Reservas de hospedagem",cat:"Reservas",done:false}],diary:[]});
export function load(){try{return {...base(),...(JSON.parse(localStorage.getItem(KEY)||"{}"))}}catch{return base()}}
export function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
export function wipe(){localStorage.removeItem(KEY)}
