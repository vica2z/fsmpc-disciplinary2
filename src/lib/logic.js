import { OFFENCES, PEN_ORDER, EMP } from '../data/model';

export function addWorkingDays(dateStr,n){ var d=new Date(dateStr); var added=0; while(added<n){ d.setDate(d.getDate()+1); var wd=d.getDay(); if(wd!==0&&wd!==6)added++; } return d; }

export function workingDaysLeft(noticeStr,n){ var deadline=addWorkingDays(noticeStr,n); var today=new Date('2026-06-21'); var ms=deadline-today; return Math.ceil(ms/86400000); }

export function offByN(n,list){return (list||OFFENCES).find(function(o){return o.n===n;});}

/* Active-window / clean-slate rules.
   Written warning (R) = 3 months active; suspension/final warning (S#) = 6 months.
   Admonishment (A) is informal — not counted. Dismissal (D) closes employment.
   After the window with no new case, the warning expires and no longer counts. */
export var TODAY = '2026-09-15';
export function windowMonths(code){
  if(!code) return 0;
  if(code==='R') return 3;
  if(code[0]==='S') return 6;
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

export function occurrenceFor(empId,offN,CASES){
  // count only prior closed cases whose warning is still active (not expired)
  var prior=CASES.filter(function(c){
    return c.empId===empId && c.off===offN && c.status==='Closed' && activeWarning(c);
  }).length;
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

