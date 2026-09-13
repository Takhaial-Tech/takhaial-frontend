export function normalisePath(pathname){
 try{return decodeURI(pathname).replace(/\/+$/,'')||'/';}
 catch{return '/invalid-address';}
}
