import { useState, useCallback, useEffect } from 'react';
import { SEED_CASES, EMP as SEED_EMP, OFFENCES as SEED_OFF, CATS as SEED_CATS } from '../data/model';
import { occurrenceFor } from './logic';

/* Persistent store for the review build.
   Cases, employees and the Table of Charges are all editable (add/edit/delete)
   and saved to localStorage so changes survive a refresh. The production app
   will persist these to MongoDB via the API instead. */

const LS = 'fsmpc_disc_v2';

function load() {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

export function useStore() {
  const initial = load();
  const [cases, setCases] = useState(() => initial?.cases ?? SEED_CASES.map(c => ({ ...c })));
  const [emps,  setEmps]  = useState(() => initial?.emps  ?? SEED_EMP.map(e => ({ ...e })));
  const [cats,  setCats]  = useState(() => initial?.cats ?? [...SEED_CATS]);
  const [offs,  setOffs]  = useState(() => initial?.offs  ?? SEED_OFF.map(o => ({ ...o })));
  const [logs,  setLogs]  = useState(() => initial?.logs  ?? []);
  const [couns, setCouns] = useState(() => initial?.couns ?? [
    { id:'CN-2001', empId:341, topic:'Repeated late arrivals over two weeks', discussed:'Agreed to adjust commute; verbal reminder given.', outcome:'Resolved', date:'2026-06-10', by:'Wayne Narruhn' },
    { id:'CN-2002', empId:447, topic:'Incomplete handover notes at end of shift', discussed:'Explained the handover standard and showed the template; employee acknowledged.', outcome:'Verbal admonishment', date:'2026-06-14', by:'Lesivou Bulabalavu' },
    { id:'CN-2003', empId:628, topic:'Raised voice toward a colleague during shift handover', discussed:'Discussed workplace conduct expectations; employee apologised to the colleague.', outcome:'Verbal admonishment', date:'2026-05-30', by:'Sireli Sovau' },
    { id:'CN-2004', empId:446, topic:'Not wearing anti-static PPE in the server room', discussed:'Reminded of PPE requirement and shown the storage point at the entrance.', outcome:'Escalated', date:'2026-06-05', by:'Lesivou Bulabalavu', escalatedTo:'DC-1048' },
    { id:'CN-2005', empId:440, topic:'Personal browsing during working hours', discussed:'Went through the acceptable-use policy; employee agreed to limit use to breaks.', outcome:'Resolved', date:'2026-05-20', by:'Johnny Adolph' },
    { id:'CN-2006', empId:441, topic:'Monthly progress report submitted late twice', discussed:'Agreed a reminder in the calendar and a draft-by date three days ahead.', outcome:'Resolved', date:'2026-06-02', by:'Neil Halstead' },
  ]);

  const log = useCallback((role, caseId, action) => {
    setLogs(prev => [{
      id: 'LOG-' + (prev.length + 1),
      ts: new Date().toISOString(), role, caseId, action,
    }, ...prev]);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ cases, emps, offs, cats, logs, couns })); } catch (e) { /* ignore */ }
  }, [cases, emps, offs, logs, couns]);

  /* ---- CASES ---- */
  const nextCaseId = useCallback((list) => {
    let max = 1060;
    list.forEach(c => { const m = /DC-(\d+)/.exec(c.id); if (m) max = Math.max(max, +m[1]); });
    return 'DC-' + (max + 1);
  }, []);

  const submitCase = useCallback((empId, offN, rec, desc, date, asDraft, serious) => {
    let newId;
    setCases(prev => {
      const occ = occurrenceFor(+empId, +offN, prev);
      newId = nextCaseId(prev);
      return [{
        id: newId, empId: +empId, off: +offN, occ, rec,
        status: asDraft ? 'Draft' : 'With HR', raised: date || '2026-06-21', desc: desc || '',
        serious: !!serious,
      }, ...prev];
    });
    log('lm', newId, (serious ? 'Raised SERIOUS case — HR alerted immediately' : (asDraft ? 'Saved case as draft' : 'Raised case and submitted to HR')));
  }, [nextCaseId, log]);

  const submitCaseMulti = useCallback((empId, offences, desc, date, asDraft, serious, lmFiles) => {
    // offences: [{off, rec}] — compute occurrence per offence
    let newId;
    setCases(prev => {
      newId = nextCaseId(prev);
      const list = offences.map(o => {
        const occ = occurrenceFor(+empId, +o.off, prev);
        return { off: +o.off, occ, rec: o.rec };
      });
      const first = list[0] || {};
      return [{
        id: newId, empId: +empId,
        off: first.off, occ: first.occ, rec: first.rec,   // mirror first offence (back-compat)
        offences: list,
        status: asDraft ? 'Draft' : 'With HR',
        raised: date || '2026-06-21', desc: desc || '', serious: !!serious,
        lmFiles: lmFiles || [],
      }, ...prev];
    });
    log('lm', newId, (asDraft ? 'Saved draft case' : 'Raised case') + ' with ' + offences.length + ' offence(s)' + (serious ? ' — flagged serious' : ''));
  }, [nextCaseId, log]);

  const updateCase = useCallback((id, patch) =>
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c)), []);

  const deleteCase = useCallback((id) =>
    setCases(prev => prev.filter(c => c.id !== id)), []);

  /* lifecycle transitions (per the PDF process) */
  const saveInvestigation = useCallback((id, inv) => {
    updateCase(id, { investigation: inv });
    log('hr', id, 'Recorded investigation notes' + (inv.witnesses && inv.witnesses.length ? ' (' + inv.witnesses.length + ' witness' + (inv.witnesses.length>1?'es':'') + ')' : '') + (inv.files && inv.files.length ? ' + ' + inv.files.length + ' file(s)' : ''));
  }, [updateCase, log]);

  const saveProperty = useCallback((id, property) => {
    updateCase(id, { property });
    const done = (property.items || []).filter(i => i.returned).length;
    const total = (property.items || []).length;
    log('lm', id, 'Updated company-property retrieval (' + done + '/' + total + ' returned)' + (property.complete ? ' — complete' : ''));
  }, [updateCase, log]);

  const saveJury = useCallback((id, jury) => {
    updateCase(id, { jury });
    log('hr', id, 'Jury of Peers ' + (jury.active ? 'activated' : 'updated') + (jury.members && jury.members.length ? ' (' + jury.members.length + ' member' + (jury.members.length>1?'s':'') + ')' : '') + (jury.finding ? ' — finding: ' + jury.finding : ''));
  }, [updateCase, log]);

  const forwardToCEO = useCallback((id, note, hrRec) => {
    updateCase(id, { status: 'With CEO', referredBy: 'HR', hrNote: note || '', hrRec: hrRec || '' });
    log('hr', id, 'Forwarded case directly to the CEO' + (hrRec ? ' — HR recommends ' + hrRec : ''));
  }, [updateCase, log]);

  const forwardToSMT = useCallback((id, note, smtMember, hrRec) => {
    updateCase(id, { status: 'With SMT', referredBy: 'HR', hrNote: note || '', smtMember: smtMember || '', hrRec: hrRec || '' });
    log('hr', id, 'Forwarded case to SMT' + (smtMember ? ' member ' + smtMember : '') + ' for recommendation' + (hrRec ? ' — HR recommends ' + hrRec : ''));
  }, [updateCase, log]);

  const smtRecommend = useCallback((id, action, rationale) => {
    updateCase(id, { status: 'With CEO', smtRec: action, smtRationale: rationale || '' });
    log('smt', id, 'SMT recommended ' + action + ' to the CEO');
  }, [updateCase, log]);

  const ceoDecideReferral = useCallback((id, decision, outcome) => {
    updateCase(id, { status: 'Closed', decision, outcome: outcome || 'Decided by CEO' });
    log('ceo', id, 'CEO decision on referred case: ' + decision + (outcome ? ' (' + outcome + ')' : ''));
  }, [updateCase, log]);

  const issueNotice = useCallback((id, date) => { updateCase(id, { status: 'Awaiting Response', noticeDate: date || '2026-06-21' }); log('hr', id, 'Issued official notice — 5 working-day response window started'); }, [updateCase, log]);
  const recordResponse = useCallback((id, response) => { updateCase(id, { status: 'Awaiting Decision', response }); log('staff', id, 'Employee submitted response'); }, [updateCase, log]);
  const recordDecision = useCallback((id, decision, outcome) => { updateCase(id, { status: 'Closed', decision, outcome: outcome || 'Upheld' }); log('hr', id, 'Recorded decision: ' + decision); }, [updateCase, log]);
  const lodgeAppeal = useCallback((id, appeal, date) => { updateCase(id, { status: 'Under Appeal', appeal, appealDate: date || '2026-06-21' }); log('staff', id, 'Employee lodged an appeal'); }, [updateCase, log]);
  const ceoRuling = useCallback((id, decision, outcome) => { updateCase(id, { status: 'Closed', decision, outcome: outcome || 'Upheld by CEO' }); log('ceo', id, 'CEO final ruling: ' + decision + ' (' + (outcome || 'Upheld by CEO') + ')'); }, [updateCase, log]);

  /* ---- EMPLOYEES ---- */
  const addEmp = useCallback((e) => setEmps(prev => {
    const id = e.id || (Math.max(0, ...prev.map(x => x.id)) + 1);
    return [{ ...e, id: +id }, ...prev];
  }), []);
  const updateEmp = useCallback((id, patch) =>
    setEmps(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e)), []);
  const deleteEmp = useCallback((id) =>
    setEmps(prev => prev.filter(e => e.id !== id)), []);

  /* ---- OFFENCES (Table of Charges) ---- */
  const addOff = useCallback((o) => setOffs(prev => {
    const n = o.n || (Math.max(0, ...prev.map(x => x.n)) + 1);
    return [...prev, { ...o, n: +n }].sort((a, b) => a.n - b.n);
  }), []);
  const updateOff = useCallback((n, patch) =>
    setOffs(prev => prev.map(o => o.n === n ? { ...o, ...patch } : o)), []);
  const deleteOff = useCallback((n) =>
    setOffs(prev => prev.filter(o => o.n !== n)), []);

  const nextCounsId = useCallback((list) => {
    let max = 2000; list.forEach(c => { const m = /CN-(\d+)/.exec(c.id); if (m) max = Math.max(max, +m[1]); });
    return 'CN-' + (max + 1);
  }, []);

  const addCounselling = useCallback((rec) => {
    let newId;
    setCouns(prev => { newId = nextCounsId(prev); return [{ id:newId, ...rec }, ...prev]; });
    log('lm', newId, 'Logged counselling (' + rec.outcome + ') for employee');
  }, [nextCounsId, log]);

  const updateCounselling = useCallback((id, patch) =>
    setCouns(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c)), []);

  const deleteCounselling = useCallback((id) =>
    setCouns(prev => prev.filter(c => c.id !== id)), []);

  /* escalate a counselling record into a formal case (carries notes forward) */
  const escalateCounselling = useCallback((counsId, offN, rec, date) => {
    let newCaseId;
    const cn = couns.find(c => c.id === counsId);
    if (!cn) return;
    setCases(prev => {
      const occ = occurrenceFor(cn.empId, +offN, prev);
      newCaseId = nextCaseId(prev);
      return [{
        id: newCaseId, empId: cn.empId, off: +offN, occ, rec,
        status: 'With HR', raised: date || '2026-06-21',
        desc: 'Escalated from counselling ' + counsId + '. ' + (cn.topic || '') + (cn.discussed ? ' — ' + cn.discussed : ''),
        fromCounselling: counsId,
      }, ...prev];
    });
    setCouns(prev => prev.map(c => c.id === counsId ? { ...c, outcome: 'Escalated', escalatedTo: newCaseId } : c));
    log('lm', newCaseId, 'Escalated counselling ' + counsId + ' to a formal case');
  }, [couns, nextCaseId, log]);

  const escalateCounsellingMulti = useCallback((counsId, offences, date) => {
    let newCaseId;
    const cn = couns.find(c => c.id === counsId); if (!cn) return;
    setCases(prev => {
      newCaseId = nextCaseId(prev);
      const list = offences.map(o => ({ off: +o.off, occ: occurrenceFor(cn.empId, +o.off, prev), rec: o.rec }));
      const first = list[0] || {};
      return [{
        id: newCaseId, empId: cn.empId, off: first.off, occ: first.occ, rec: first.rec, offences: list,
        status: 'With HR', raised: date || '2026-06-21',
        desc: 'Escalated from counselling ' + counsId + '. ' + (cn.topic || '') + (cn.discussed ? ' — ' + cn.discussed : ''),
        fromCounselling: counsId,
      }, ...prev];
    });
    setCouns(prev => prev.map(c => c.id === counsId ? { ...c, outcome: 'Escalated', escalatedTo: newCaseId } : c));
    log('lm', newCaseId, 'Escalated counselling ' + counsId + ' to a formal case with ' + offences.length + ' offence(s)');
  }, [couns, nextCaseId, log]);

  const flagSerious = useCallback((id, on) => {
    updateCase(id, { serious: on });
    if (on) log('lm', id, 'Flagged as a SERIOUS offence — HR notified immediately (investigation ongoing)');
  }, [updateCase, log]);

  const acknowledgeSerious = useCallback((id) => {
    updateCase(id, { seriousAck: true });
    log('hr', id, 'HR acknowledged the serious-offence alert');
  }, [updateCase, log]);

  const reinstateEmployee = useCallback((id, reason, date) => {
    updateCase(id, { reinstated: true, reinstateReason: reason || '', reinstateDate: date || '2026-06-21' });
    log('ceo', id, 'CEO re-established employee to payroll (reversed dismissal)' + (reason ? ' — ' + reason : ''));
  }, [updateCase, log]);

  const submitToHR = useCallback((id) => { updateCase(id, { status: 'With HR' }); log('lm', id, 'Submitted draft case to HR'); }, [updateCase, log]);

  const addCat = useCallback((name) => {
    const n = (name||'').trim(); if (!n) return;
    setCats(prev => prev.some(c => c.toLowerCase() === n.toLowerCase()) ? prev : [...prev, n]);
  }, []);

  const resetAll = useCallback(() => {
    if (confirm('Reset all cases, employees and charges back to the sample data?')) {
      setCases(SEED_CASES.map(c => ({ ...c })));
      setEmps(SEED_EMP.map(e => ({ ...e })));
      setOffs(SEED_OFF.map(o => ({ ...o })));
      setLogs([]);
      setCouns([]);
      setCats([...SEED_CATS]);
    }
  }, []);

  return {
    cases, emps, offs, cats, logs, couns,
    submitCase, submitCaseMulti, updateCase, deleteCase,
    issueNotice, recordResponse, recordDecision, lodgeAppeal, ceoRuling, submitToHR, saveInvestigation, saveJury, saveProperty,
    forwardToCEO, forwardToSMT, smtRecommend, ceoDecideReferral, reinstateEmployee,
    addCounselling, updateCounselling, deleteCounselling, escalateCounselling, escalateCounsellingMulti,
    flagSerious, acknowledgeSerious,
    addEmp, updateEmp, deleteEmp,
    addOff, updateOff, deleteOff, addCat,
    resetAll,
  };
}
