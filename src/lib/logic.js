import { OFFENCES, PEN_ORDER, EMP } from '../data/model';

export function addWorkingDays(dateStr,n){ var d=new Date(dateStr); var added=0; while(added<n){ d.setDate(d.getDate()+1); var wd=d.getDay(); if(wd!==0&&wd!==6)added++; } return d; }

export function workingDaysLeft(noticeStr,n){ var deadline=addWorkingDays(noticeStr,n); var today=new Date(TODAY); var ms=deadline-today; return Math.ceil(ms/86400000); }
/* working days remaining (negative = overdue) for a notice */
export function responseDue(noticeStr){ if(!noticeStr) return null; var d=new Date(noticeStr), t=new Date(TODAY), left=0; var dl=addWorkingDays(noticeStr,5); if(t<=dl){ var x=new Date(t); while(x<dl){ x.setDate(x.getDate()+1); var w=x.getDay(); if(w!==0&&w!==6) left++; } return left; } var o=0, y=new Date(dl); while(y<t){ y.setDate(y.getDate()+1); var w2=y.getDay(); if(w2!==0&&w2!==6) o++; } return -o; }

export function offByN(n,list){return (list||OFFENCES).find(function(o){return o.n===n;});}

/* Active-window / clean-slate rules.
   Written warning (R) = 3 months active; suspension/final warning (S#) = 6 months.
   Admonishment (A) is informal — not counted. Dismissal (D) closes employment.
   After the window with no new case, the warning expires and no longer counts. */
export var TODAY = '2026-06-21';
export var EXPIRY = { written: 3, suspension: 6 };
export function setExpiry(cfg){ if(cfg){ if(cfg.written!=null) EXPIRY.written=+cfg.written; if(cfg.suspension!=null) EXPIRY.suspension=+cfg.suspension; } }
export function windowMonths(code){
  if(!code) return 0;
  if(code==='R') return EXPIRY.written;
  if(code[0]==='S') return EXPIRY.suspension;
  return 0; // A = informal, D = terminal
}
export function caseExpiry(c){
  var action = c.decision || c.rec;
  var m = windowMonths(action);
  if(!m) return null;
  var base = c.decisionDate || c.noticeDate || c.raised;
  if(!base) return null;
  var d = new Date(base); d.setMonth(d.getMonth()+m);
  return d;
}
export function isExpired(c, today){
  var exp = caseExpiry(c); if(!exp) return false;
  return new Date(today||TODAY) > exp;
}
export function activeWarning(c, today){
  // a closed warning that is still within its active window
  if(c.status!=='Closed') return false;
  var action = c.decision || c.rec;
  if(windowMonths(action)===0) return false;
  return !isExpired(c, today);
}

export function offList(c){
  if(c.offences && c.offences.length) return c.offences;
  return [{ off:c.off, occ:c.occ, rec:c.rec, decision:c.decision, smtRec:c.smtRec }];
}
export function worstCode(codes){
  var best=null, bi=-1;
  (codes||[]).forEach(function(x){ var i=PEN_ORDER.indexOf(x); if(i>bi){bi=i;best=x;} });
  return best;
}
function entryActive(c,e,today){
  var code = e.decision || c.decision; var m = windowMonths(code);
  if(!m) return false;
  var base = c.decisionDate || c.noticeDate || c.raised; if(!base) return false;
  var d = new Date(base); d.setMonth(d.getMonth()+m);
  return new Date(today||TODAY) <= d;
}
export function occurrenceFor(empId,offN,CASES){
  // count prior Closed cases (any offence line) for this offence whose warning is still in its active window
  var prior=0;
  CASES.forEach(function(c){
    if(c.empId!==empId || c.status!=='Closed') return;
    offList(c).forEach(function(e){ if(+e.off===+offN && entryActive(c,e)) prior++; });
  });
  return prior+1;
}

export function occLabel(o){ return o===1?'1st':o===2?'2nd':o===3?'3rd':o+'th'; }

export function rangeForOcc(off,occ){ var idx=Math.min(occ,off.p.length)-1; return off.p[idx]; }

export function penRank(c){ if(c==='A')return 0; if(c==='R')return 1; if(c==='D')return 99; return parseInt(c.substring(1),10); }

export function penClass(code){ if(code==='A')return'pen-A'; if(code==='R')return'pen-R'; if(code==='D')return'pen-D'; return'pen-S'; }

export function penFull(code){ if(code==='A')return'Admonishment (verbal warning)'; if(code==='R')return'Written warning'; if(code==='D')return'Dismissal'; return code.substring(1)+'-day suspension (unpaid)'; }

export function penChip(code){ return '<span class="pen '+penClass(code)+'">'+code+'</span>'; }

export function optionsInRange(pair){
  if(!pair)return[]; var lo=pair[0],hi=pair[1];
  return PEN_ORDER.filter(function(c){ return penRank(c)>=penRank(lo)&&penRank(c)<=penRank(hi); });
}

export function rangeChips(pair){ if(!pair)return'<span style="color:#9CA3AF">—</span>'; if(pair[0]===pair[1])return penChip(pair[0]); return penChip(pair[0])+' <span class="parrow">&rarr;</span> '+penChip(pair[1]); }

export function empById(id,list){return (list||EMP).find(function(e){return e.id===id;});}

export function initials(name){var p=name.split(' ');return ((p[0]||'')[0]+(p[1]||'')[0]||'').toUpperCase();}

export function fmtDate(s){ if(!s)return'—'; var d=new Date(s); return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }

export function stageState(c,key){
    if(!c) return 'idle';
    if(c.status==='Closed'){ if(key==='appeal')return c.appealDate?'done':'idle'; return 'done'; }
    if(c.status==='Under Appeal'){ if(key==='appeal')return'active'; if(key==='decision')return'done'; return'done'; }
    if(c.status==='Awaiting Response'){ if(key==='resp')return'active'; if(key==='hr')return'done'; if(key==='sup')return'done'; return'idle'; }
    if(c.status==='With HR'){ if(key==='hr')return'active'; if(key==='sup')return'done'; return'idle'; }
    if(c.status==='Draft'){ if(key==='sup')return'active'; return'idle'; }
    return'idle';
  }

export function statusClass(s){ return s==='Draft'?'st-draft':s==='With HR'?'st-hr':s==='Awaiting Response'?'st-resp':s==='Under Appeal'?'st-appeal':s==='With SMT'?'st-smt':s==='With CEO'?'st-ceo':'st-closed'; }

