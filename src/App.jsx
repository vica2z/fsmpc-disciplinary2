import React, { useState, useMemo, useEffect } from 'react';
import { OFFENCES, CATS, CAT_ICON, EMP, EXECUTIVES, SMT_MEMBERS, APPRAISAL_STATUSES, appraisalStatus, apprStatusClass, COUNSEL_OUTCOMES, PROPERTY_ITEMS, PEN_ORDER, ROLES, STEPS, PANEL_GUIDE, ROLE_NAV, ROLE_ORDER } from './data/model';
import {
  offByN, occurrenceFor, occLabel, rangeForOcc,
  penClass, penFull, optionsInRange, rangeChips, empById,
  fmtDate, statusClass, activeWarning, isExpired, caseExpiry, windowMonths, offList, worstCode, responseDue,
} from './lib/logic';
import { useStore } from './lib/store';

export default function App() {
  const store = useStore();
  const [role, setRole] = useState('lm');
  const [execId, setExecId] = useState(EXECUTIVES[0].id);
  const nav = ROLE_NAV[role];
  const [view, setView] = useState(nav[0].id);
  const [tour, setTour] = useState(0);   // 0 = off, else step number (1-based)
  const [spot, setSpot] = useState(null);
  const [draftId, setDraftId] = useState(null); // {top,left,width,height} of highlighted button

  function switchRole(r) { setRole(r); setView(ROLE_NAV[r][0].id); }

  const roleInfo = ROLES[role];

  // Guided tour steps — each can jump to a role/view
  const TOUR = [
    { t: 'Welcome', d: 'This guided tour walks through every panel and action in the system, role by role. Use Next and Back to move; you can skip anytime. The highlighted menu item shows where you are.' },
    { t: 'Switching roles', d: 'Everyone works from one shared set of cases. Use the “Viewing as” bar at the top to switch between the seven roles. In real use each person sees only their own role.' },

    // ICT ADMIN
    { t: 'ICT Admin', d: 'ICT sets up and maintains the system. We’ll look at each of its panels.', role: 'ict', view: 'setup', nav: 'System Setup' },
    { t: 'ICT · System Setup', d: 'A one-time configuration checklist — charges, roles, working-day timers and audit logging. Confirms the system is ready. Read-only.', role: 'ict', view: 'setup', nav: 'System Setup' },
    { t: 'ICT · Table of Charges', d: 'The master list of offences and their penalties by occurrence (A = verbal, R = written, S# = suspension days, D = dismissal). Add offences with “+ Add offence” and new categories with “+ Add category”. Shows 10 per page.', role: 'ict', view: 'charges', nav: 'Table of Charges' },
    { t: 'ICT · Audit Log', d: 'A permanent record of every action taken in the system — role, timestamp and case reference. Read-only.', role: 'ict', view: 'audit', nav: 'Audit Log' },

    // LINE MANAGER
    { t: 'Line Manager', d: 'The supervisor. Cases begin here. We’ll go through each panel.', role: 'lm', view: 'lm-queue', nav: 'My Team' },
    { t: 'LM · My Team', d: 'Your drafted and submitted cases, with their status. Drafts can be submitted to HR or deleted, and you can flag/unflag serious. On a dismissal, a “Retrieve property” card appears to record returned company property.', role: 'lm', view: 'lm-queue', nav: 'My Team' },
    { t: 'Button · Raise a case', d: 'Starts a new formal case for a team member.', role: 'lm', view: 'lm-queue', sel: '[data-tour=\"lm-raise-btn\"]' },
    { t: 'LM · Counselling', d: 'The informal first step. Log a counselling chat (issue, discussion, outcome: Resolved or Verbal admonishment). If it doesn’t resolve, “Escalate” turns it into a formal case — carrying the notes and offences forward.', role: 'lm', view: 'lm-counsel', nav: 'Counselling' },
    { t: 'Button · Log counselling', d: 'Records an informal counselling chat with an employee.', role: 'lm', view: 'lm-counsel', sel: '[data-tour=\"log-counsel\"]' },
    { t: 'LM · Raise a Case', d: 'Raise a formal case. Pick the employee — a red flag shows if they already have an open case, and you’ll see their open + past cases with “View history”. Add one or more offences (each with its own occurrence, range and recommendation), attach evidence, and flag serious offences. A reminder suggests counselling first for minor matters.', role: 'lm', view: 'lm-raise', nav: 'Raise a Case' },
    { t: 'LM · Table of Charges', d: 'A read-only reference of every offence and its penalty range, so the LM can check before raising a case.', role: 'lm', view: 'charges', nav: 'Table of Charges' },

    // HR MANAGER
    { t: 'HR Manager', d: 'The core engine — HR investigates and decides, or forwards serious cases up.', role: 'hr', view: 'hr-queue', nav: 'HR Queue' },
    { t: 'HR · HR Queue', d: 'Cases needing action, in order: Investigate → Issue notice → Record response → Record decision. A red banner appears if a serious offence is reported. Serious cases can be forwarded to the CEO or SMT.', role: 'hr', view: 'hr-queue', nav: 'HR Queue' },
    { t: 'Button · Investigate / action', d: 'This is the main action button for the case at the top of the queue. Depending on the case stage it reads Investigate, Issue notice, Record response, or Record decision — the next step HR must take.', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"hr-action\"]' },
    { t: 'Button · Jury of Peers', d: 'On an investigated serious case, this convenes the impartial peer panel and records its finding and recommendation.', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"jury\"]' },
    { t: 'Button · Forward to CEO', d: 'Sends the case directly to the CEO for a final decision (HR recommendation required).', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"fwd-ceo\"]' },
    { t: 'Button · Forward to SMT', d: 'Sends the case to a chosen SMT member for a recommendation to the CEO (HR recommendation required).', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"fwd-smt\"]' },
    { t: 'Button · Issue notice', d: 'After the investigation, HR issues the official notice. The employee sees it in My Notices and has 5 working days to respond (their response is considered before the decision).', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"issue-notice\"]' },
    { t: 'Button · Letter', d: 'Generates the formatted disciplinary notice for the case — auto-filled and printable.', role: 'hr', view: 'hr-queue', sel: '[data-tour=\"letter\"]' },
    { t: 'HR · Investigation', d: 'Before any notice, HR investigates: findings, discussion with the line manager and employee, witnesses (name + statement), and uploaded document/image evidence. Only after saving can a notice be issued.', role: 'hr', view: 'hr-queue', nav: 'HR Queue' },
    { t: 'HR · Jury of Peers', d: 'For a serious case, HR can convene an impartial peer panel: members, a finding (substantiated / partly / not), and a recommended action. It’s advisory and travels with the case.', role: 'hr', view: 'hr-queue', nav: 'HR Queue' },
    { t: 'HR · Forward to CEO / SMT', d: 'Serious cases can be forwarded straight to the CEO, or to a chosen SMT member for a recommendation. HR must give an overall recommendation (mandatory). The CEO makes the final decision.', role: 'hr', view: 'hr-queue', nav: 'HR Queue' },
    { t: 'HR · All Cases', d: 'Every case in one place, with a Documents column. “View” opens the full case history; “Letter” generates the disciplinary notice; on closed cases, “Personnel Form” generates the PAF for payroll.', role: 'hr', view: 'hr-all', nav: 'All Cases' },
    { t: 'Button · View', d: 'Opens the full case history for any case — counselling, investigation, witnesses, evidence, recommendations, decision and the audit trail.', role: 'hr', view: 'hr-all', sel: '[data-tour=\"view\"]' },
    { t: 'Button · Personnel Form (PAF)', d: 'On a closed case, generates the Personnel Action Form for payroll.', role: 'hr', view: 'hr-all', sel: '[data-tour=\"paf\"]' },
    { t: 'HR · Counselling Log', d: 'A read-only view of all counselling recorded by line managers — so HR sees issues being managed early.', role: 'hr', view: 'counsel-log', nav: 'Counselling Log' },
    { t: 'HR · Weekly CEO Report', d: 'A summary of all disciplinary activity — open, closed and dismissals — for executive review.', role: 'hr', view: 'report', nav: 'Weekly CEO Report' },

    // STAFF
    { t: 'Staff', d: 'The employee’s view.', role: 'staff', view: 'staff-notices', nav: 'My Notices' },
    { t: 'Staff · My Notices', d: 'The employee receives the charge and gives their response within 5 working days. This response is part of the decision-making process — considered before management decides. It is not an appeal.', role: 'staff', view: 'staff-notices', nav: 'My Notices' },

    // EXECUTIVE
    { t: 'Executive Member', d: 'Oversight of a portfolio of departments — read-only. Pick which executive from the selector at the top.', role: 'exec', view: 'exec-portfolio', nav: 'My Portfolio' },
    { t: 'Exec · My Portfolio', d: 'The staff in your portfolio, grouped by department, with open-case counts.', role: 'exec', view: 'exec-portfolio', nav: 'My Portfolio' },
    { t: 'Exec · Portfolio Appraisals', d: 'The appraisal status of your portfolio staff by quarter (Pending / Submitted / With HR / CEO Approved).', role: 'exec', view: 'exec-appraisals', nav: 'Portfolio Appraisals' },
    { t: 'Exec · Portfolio Counselling', d: 'Informal counselling records for your portfolio staff.', role: 'exec', view: 'exec-counsel', nav: 'Portfolio Counselling' },
    { t: 'Exec · Portfolio Discipline', d: 'Every disciplinary case for your portfolio staff, filterable by status.', role: 'exec', view: 'exec-discipline', nav: 'Portfolio Discipline' },

    // SMT
    { t: 'SMT (Senior Management Team)', d: 'Reviews cases HR forwards and recommends to the CEO.', role: 'smt', view: 'smt-queue', nav: 'SMT Referrals' },
    { t: 'SMT · SMT Referrals', d: 'Cases HR forwarded to you, showing HR’s recommendation and all offences. “View full case history” shows everything; then recommend an action + rationale to the CEO (both mandatory).', role: 'smt', view: 'smt-queue', nav: 'SMT Referrals' },
    { t: 'Button · Recommend to CEO', d: 'Records the SMT’s recommended action and rationale and sends the case to the CEO.', role: 'smt', view: 'smt-queue', sel: '[data-tour=\"smt-rec\"]' },
    { t: 'SMT · Recommended', d: 'Cases the SMT has already recommended on, with the CEO’s final decision once made.', role: 'smt', view: 'smt-decided', nav: 'Recommended' },

    // CEO
    { t: 'CEO', d: 'The final decision-maker.', role: 'ceo', view: 'ceo-referrals', nav: 'Referrals' },
    { t: 'CEO · Referrals', d: 'Cases forwarded by HR (directly) or via the SMT, showing both recommendations. “View full case history”, then “Make final decision” within range — which closes the case.', role: 'ceo', view: 'ceo-referrals', nav: 'Referrals' },
    { t: 'Button · View full case history', d: 'Opens the complete record of the referred case before you decide.', role: 'ceo', view: 'ceo-referrals', sel: '[data-tour=\"view-hist\"]' },
    { t: 'Button · Make final decision', d: 'Records the CEO’s final action within the offence range and closes the case.', role: 'ceo', view: 'ceo-referrals', sel: '[data-tour=\"ceo-decide\"]' },
    { t: 'CEO · Re-instatement', d: 'Re-establish a previously dismissed employee back into payroll — record a reason and effective date. Only the CEO can do this.', role: 'ceo', view: 'ceo-reinstate', nav: 'Re-instatement' },
    { t: 'Button · Re-establish to payroll', d: 'Reverses a dismissal and restores the employee to payroll.', role: 'ceo', view: 'ceo-reinstate', sel: '[data-tour=\"reestablish\"]' },
    { t: 'CEO · Reports & Audit', d: 'The CEO also has the Weekly Report, the Counselling Log and the full Audit Log for oversight.', role: 'ceo', view: 'report', nav: 'Weekly Report' },

    // WRAP
    { t: 'How it works & Help', d: 'Every role has a “How it works” walkthrough. You can also use the 💬 Help chatbox (bottom-right) to ask questions anytime.', role: 'lm', view: 'howto', nav: 'How it works' },
    { t: 'That’s the whole system', d: 'Serious flow: LM raises → HR investigates (+jury) → forward → SMT recommends → CEO decides → Letter + PAF. Routine flow: LM raises → HR investigates → notice → Staff responds → HR decides. Every action is logged; hover any “i” for on-screen help.' },
  ];

  function spotBoxStyle(sp) {
    const vw = window.innerWidth, vh = window.innerHeight, bw = 360, bh = 210, gap = 14;
    const style = { position: 'fixed', width: bw, margin: 0 };
    const spaceRight = vw - (sp.left + sp.width);
    const spaceLeft = sp.left;
    // Prefer placing to the SIDE of the button (so it clearly points at it)
    if (spaceLeft >= bw + gap) {
      // to the left of the button
      style.left = sp.left - bw - gap;
      style.top = Math.min(Math.max(12, sp.top + sp.height / 2 - bh / 2), vh - bh - 12);
    } else if (spaceRight >= bw + gap) {
      // to the right of the button
      style.left = sp.left + sp.width + gap;
      style.top = Math.min(Math.max(12, sp.top + sp.height / 2 - bh / 2), vh - bh - 12);
    } else {
      // stack below or above, centered on button, clamped to viewport
      style.left = Math.min(Math.max(12, sp.left + sp.width / 2 - bw / 2), vw - bw - 12);
      const below = sp.top + sp.height + gap;
      if (below + bh < vh) style.top = below;
      else style.top = Math.max(12, sp.top - bh - gap);
    }
    return style;
  }
  useEffect(() => {
    if (!tour) { setSpot(null); return; }
    const step = TOUR[tour - 1];
    if (!step.sel) { setSpot(null); return; }
    let tries = 0;
    const find = () => {
      const el = document.querySelector(step.sel);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => { const r = el.getBoundingClientRect(); setSpot({ top: r.top, left: r.left, width: r.width, height: r.height }); }, 250);
      } else if (tries++ < 12) { setTimeout(find, 100); }
      else setSpot(null);
    };
    const id = setTimeout(find, 200);
    return () => clearTimeout(id);
  }, [tour]);

  function startTour() { const s = TOUR[0]; setTour(1); if (s.role) switchRole(s.role); }
  function goTour(n) {
    if (n < 1) { setTour(0); return; }
    if (n > TOUR.length) { setTour(0); return; }
    const s = TOUR[n - 1];
    if (s.role) { setRole(s.role); setView(s.view || ROLE_NAV[s.role][0].id); }
    setTour(n);
  }

  return (
    <>
      {tour > 0 && spot && (
        <div className="tour-spot" style={{ top: spot.top - 6, left: spot.left - 6, width: spot.width + 12, height: spot.height + 12 }} />
      )}
      {tour > 0 && (
        <div className={"tour-wrap" + (TOUR[tour - 1].nav && !spot ? " anchored" : "") + (spot ? " has-spot" : "")}>
          <div className="tour-box" style={spot ? spotBoxStyle(spot) : undefined}>
            {TOUR[tour - 1].nav && <div className="tour-pointer">◀ {TOUR[tour - 1].nav}</div>}
            <div className="tour-step">Step {tour} of {TOUR.length}</div>
            <h3 className="tour-title">{TOUR[tour - 1].t}</h3>
            <p className="tour-desc">{TOUR[tour - 1].d}</p>
            <div className="tour-dots">{TOUR.map((_, i) => <span key={i} className={'tour-dot' + (i === tour - 1 ? ' on' : '')} />)}</div>
            <div className="tour-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setTour(0)}>Skip tour</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" disabled={tour === 1} onClick={() => goTour(tour - 1)}>← Back</button>
                {tour < TOUR.length
                  ? <button className="btn btn-navy btn-sm" onClick={() => goTour(tour + 1)}>Next →</button>
                  : <button className="btn btn-navy btn-sm" onClick={() => setTour(0)}>Finish ✓</button>}
              </div>
            </div>
          </div>
        </div>
      )}
      <button className="tour-fab" onClick={startTour} title="Guided tour">? Guided tour</button>
      <HelpChat />
      <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div><div className="brand-name">FSMPC</div><div className="brand-sub">Disciplinary Management</div></div>
        </div>
        <nav className="nav">
          {nav.map(n => (
            <button key={n.id} className={'nav-item' + (view === n.id ? ' active' : '') + (tour > 0 && TOUR[tour - 1].nav === n.label ? ' tour-hl' : '')} onClick={() => { setDraftId(null); setView(n.id); }}>
              <span className="nav-ico">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={store.resetAll}>↺ Reset sample data</button>
          <div className="demo-tag" style={{ marginTop: 8 }}>Review build · saved locally</div>
        </div>
      </aside>

      <main className="main">
        <div className="role-bar">
          <span className="role-bar-label">Viewing as</span>
          <div className="role-switch">
            {ROLE_ORDER.map(r => (
              <button key={r} className={'role-pill' + (role === r ? ' on' : '')}
                style={role === r ? { background: ROLES[r].c, color: '#fff' } : {}}
                onClick={() => switchRole(r)}>{ROLES[r].name}</button>
            ))}
          </div>
          <span className="role-current" style={{ color: roleInfo.c, background: roleInfo.bg }}>{roleInfo.name} view</span>
        </div>
        {role === 'exec' && (
          <div className="exec-bar">
            <span className="role-bar-label">Executive</span>
            <select className="input exec-select" value={execId} onChange={e => setExecId(e.target.value)}>
              {EXECUTIVES.map(x => <option key={x.id} value={x.id}>{x.name} — {x.title}</option>)}
            </select>
          </div>
        )}

        {/* ICT */}
        {view === 'ict-settings' && <ICTSettings store={store} />}
        {view === 'setup' && <Setup store={store} />}
        {view === 'employees' && <Employees store={store} />}
        {view === 'audit' && <AuditLog store={store} />}
        {/* Line Manager */}
        {view === 'lm-queue' && <LMQueue store={store} setView={setView} setDraftId={setDraftId} />}
        {view === 'lm-raise' && <LMRaise key={draftId || 'new'} store={store} setView={setView} draftId={draftId} setDraftId={setDraftId} />}
        {view === 'lm-counsel' && <LMCounselling store={store} />}
        {view === 'counsel-log' && <CounsellingLog store={store} />}
        {view === 'exec-counsel' && <ExecCounselling store={store} execId={execId} />}
        {/* HR */}
        {view === 'hr-queue' && <HRQueue store={store} />}
        {view === 'hr-all' && <HRAll store={store} />}
        {/* Staff */}
        {view === 'staff-notices' && <StaffNotices store={store} />}
        {/* CEO */}
        {view === 'ceo-referrals' && <CEOReferrals store={store} />}
        {view === 'ceo-reinstate' && <CEOReinstate store={store} />}
        {view === 'smt-queue' && <SMTQueue store={store} />}
        {view === 'smt-decided' && <SMTDecided store={store} />}
        {/* Executive */}
        {view === 'exec-portfolio' && <ExecPortfolio store={store} execId={execId} />}
        {view === 'exec-appraisals' && <ExecAppraisals store={store} execId={execId} />}
        {view === 'exec-discipline' && <ExecDiscipline store={store} execId={execId} />}
        {/* shared */}
        {view === 'charges' && <Charges store={store} role={role} />}
        {view === 'report' && <Report store={store} />}
        {view === 'howto' && <HowItWorks />}
      </main>
    </div>
    </>
  );
}

/* Guide banner (per panel) */
function GuideBanner({ view }) {
  const [open, setOpen] = useState(true);
  const g = PANEL_GUIDE[view];
  if (!g) return null;
  const role = ROLES[g.role] || { name: '', c: '#667085', bg: '#F3F1EC' };
  return (
    <div className="guide">
      <div className="guide-head" onClick={() => setOpen(o => !o)}>
        <span className="guide-ico">ℹ️</span><b>{g.title}</b>
        <span className="role-badge" style={{ color: role.c, background: role.bg, marginLeft: 8 }}>{role.name}</span>
        <span className="guide-toggle">{open ? 'Hide' : 'Show'}</span>
      </div>
      {open && <ul className="guide-list">{g.points.map((p, i) => <li key={i}>{p}</li>)}</ul>}
    </div>
  );
}

/* ═══════════ ICT ADMIN ═══════════ */
function Setup({ store }) {
  const { cases, emps, offs, logs } = store;
  const rows = [
    ['Table of Charges', offs.length + ' offences loaded', true],
    ['Employees on file', emps.length + ' staff records', true],
    ['Roles & permissions', 'LM raises · HR reviews · CEO approves · Staff responds', true],
    ['Working-day timers', '5 days to respond · 10 days to appeal', true],
    ['Audit logging', logs.length + ' actions recorded — ON', true],
  ];
  return (
    <div className="page">
      <PageHead title="System Setup" info="One-time configuration of the disciplinary module: charges, employees, roles, timers and audit logging." sub="One-time configuration of the disciplinary module" />
      <GuideBanner view="setup" />
      <div className="stat-grid">
        <Stat n={cases.length} label="Total cases" color="#0891B2" />
        <Stat n={emps.length} label="Employees" color="#1E40AF" />
        <Stat n={offs.length} label="Offences" color="#B45309" />
        <Stat n={logs.length} label="Audit entries" color="#6D28D9" />
      </div>
      <Card title="Configuration checklist" sub="Everything the module needs to run">
        {rows.map(([t, s], i) => (
          <div key={i} className="setup-row">
            <span className="setup-check">✓</span>
            <div><div className="setup-t">{t}</div><div className="sub">{s}</div></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AuditLog({ store }) {
  const { logs } = store;
  return (
    <div className="page">
      <PageHead title="Audit Log" info="A permanent record of every action taken in the system — who did what, when, and on which case." sub="Every action taken in the disciplinary system, most recent first" />
      <Card>
        {logs.length ? (
          <table className="table">
            <thead><tr><th>When</th><th>Role</th><th>Case</th><th>Action</th></tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td className="sub">{new Date(l.ts).toLocaleString('en-GB')}</td>
                  <td><span className="role-badge" style={{ color: (ROLES[l.role] || {}).c, background: (ROLES[l.role] || {}).bg }}>{(ROLES[l.role] || {}).name || l.role}</span></td>
                  <td className="mono">{l.caseId || '—'}</td>
                  <td>{l.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No actions recorded yet. Raise or progress a case to see the trail.</Empty>}
      </Card>
    </div>
  );
}

/* ═══════════ LINE MANAGER ═══════════ */
function LMQueue({ store, setView, setDraftId }) {
  const { cases, emps, offs } = store;
  const mine = cases.filter(c => c.status === 'Draft' || c.status === 'With HR');
  const dismissals = cases.filter(c => c.status === 'Closed' && (c.decision || c.rec) === 'D');
  const [propCase, setPropCase] = useState(null);
  const propDone = c => { const it = c.property?.items || []; return it.length ? it.filter(i => i.returned).length : 0; };
  return (
    <div className="page">
      <PageHead title="My Team — Disciplinary" info="The cases you have raised or are drafting, and property to retrieve when staff are dismissed." sub="Cases you have raised or are drafting"
        right={<button className="btn btn-navy" data-tour="lm-raise-btn" onClick={() => setView('lm-raise')}>+ Raise a case</button>} />
      <GuideBanner view="lm-queue" />
      <Card title="Your cases" sub="Drafts and cases now with HR">
        {mine.length ? (
          <table className="table">
            <thead><tr><th>Case</th><th>Employee</th><th>Offence</th><th>Recommended</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {mine.map(c => {
                const e = empById(c.empId, emps), o = offByN(c.off, offs);
                return (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
                    <td><OffenceCell c={c} offs={offs} /></td>
                    <td><span className={'chip ' + penClass(c.rec)}>{c.rec}</span> {penFull(c.rec)}</td>
                    <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span>{c.serious && <div style={{ marginTop: 4 }}><span className="pill st-serious">⚠ Serious</span></div>}</td>
                    <td className="row-actions">
                      {c.status === 'Draft' && <TipBtn tip="Open this draft to change the employee, offences, statement or evidence." className="btn btn-sm btn-ghost" dt="edit-draft" onClick={() => { setDraftId(c.id); setView('lm-raise'); }}>Edit</TipBtn>}
                      {c.status === 'Draft' && <TipBtn tip="Send this draft case to HR for review." className="btn btn-sm btn-navy" onClick={() => store.submitToHR(c.id)}>Submit to HR</TipBtn>}
                      {c.status === 'Draft' && <TipBtn tip="Permanently delete this draft case. This cannot be undone." className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete draft ' + c.id + '?')) store.deleteCase(c.id); }}>Delete</TipBtn>}
                      {!c.serious && <TipBtn tip="Mark this case as a serious offence — HR is alerted immediately while the investigation continues." className="btn btn-sm btn-ghost" onClick={() => store.flagSerious(c.id, true)}>Flag serious</TipBtn>}
                      {c.serious && <TipBtn tip="Remove the serious-offence flag from this case." className="btn btn-sm btn-ghost" onClick={() => store.flagSerious(c.id, false)}>Unflag</TipBtn>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>No active cases. Use “Raise a case” to start one.</Empty>}
      </Card>

      {dismissals.length > 0 && (
        <Card title="Company property to retrieve" sub="On dismissal, retrieve all company property from the employee">
          <table className="table">
            <thead><tr><th>Case</th><th>Employee</th><th>Department</th><th>Property returned</th><th></th></tr></thead>
            <tbody>
              {dismissals.map(c => {
                const e = empById(c.empId, emps);
                const items = c.property?.items || [];
                const done = propDone(c);
                const complete = c.property?.complete;
                return (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
                    <td>{e?.dept}</td>
                    <td>
                      {complete ? <span className="pill st-closed">✓ All returned</span>
                        : items.length ? <span className="pill st-hr">{done}/{items.length} returned</span>
                        : <span className="pill st-draft">Not started</span>}
                    </td>
                    <td className="row-actions">
                      <TipBtn tip="Open the checklist to record return of company property on dismissal." className="btn btn-sm btn-navy" onClick={() => setPropCase(c)}>Retrieve property</TipBtn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      {propCase && <PropertyModal store={store} c={propCase} onClose={() => setPropCase(null)} />}
    </div>
  );
}

/* Company-property retrieval checklist (on dismissal) */
function PropertyModal({ store, c, onClose }) {
  const { emps } = store;
  const e = empById(c.empId, emps);
  const existing = c.property?.items;
  const [items, setItems] = useState(
    Array.isArray(existing) && existing.length
      ? [...existing, ...(store.propItems || []).filter(l => !existing.some(x => x.label === l)).map(label => ({ label, returned: false, note: '' }))]
      : (store.propItems || PROPERTY_ITEMS).map(label => ({ label, returned: false, note: '' }))
  );
  const [ackName, setAckName] = useState(c.property?.ackName || '');
  const toggle = i => setItems(list => list.map((it, idx) => idx === i ? { ...it, returned: !it.returned } : it));
  const setNote = (i, v) => setItems(list => list.map((it, idx) => idx === i ? { ...it, note: v } : it));
  const done = items.filter(i => i.returned).length;
  const complete = done === items.length;

  function save() {
    store.saveProperty(c.id, { items, complete, ackName, savedAt: '2026-06-21' });
    onClose();
  }
  return (
    <Modal title={`Property retrieval — ${e?.name}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Save the company-property retrieval checklist." className="btn btn-navy" onClick={save}>Save checklist</TipBtn></>}>
      <div className="penalty-box">
        <div className="penalty-title">{e?.name} — {e?.title}</div>
        <div className="sub">On dismissal, retrieve all company property from the employee. Tick each item as it is returned; add a note for anything outstanding.</div>
      </div>
      <div className="prop-list">
        {items.map((it, i) => (
          <div key={i} className={'prop-row' + (it.returned ? ' done' : '')}>
            <label className="prop-check">
              <input type="checkbox" checked={it.returned} onChange={() => toggle(i)} />
              <span>{it.label}</span>
            </label>
            <input className="input prop-note" placeholder="Note (e.g. serial no., or outstanding)" value={it.note} onChange={ev => setNote(i, ev.target.value)} />
          </div>
        ))}
      </div>
      <div className="prop-summary">
        <span className={complete ? 'pill st-closed' : 'pill st-hr'}>{done}/{items.length} returned</span>
        {complete && <span className="sub" style={{ marginLeft: 8 }}>All company property retrieved.</span>}
      </div>
      <Field label="Received / checked by"><input className="input" value={ackName} onChange={ev => setAckName(ev.target.value)} placeholder="Line manager name" /></Field>
    </Modal>
  );
}



/* ═══════════ COUNSELLING (LM) — the informal pre-case step ═══════════ */
function counselOutcomeClass(o){
  return o === 'Resolved' ? 'st-closed' : o === 'Verbal admonishment' ? 'st-hr' : o === 'Escalated' ? 'st-appeal' : 'st-draft';
}

function LMCounselling({ store }) {
  const { couns, emps } = store;
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [escalating, setEscalating] = useState(null);
  return (
    <div className="page">
      <PageHead title="Counselling" info="The informal first step: record a counselling chat before any formal case. Can be escalated later." sub="The informal first step — counsel and record before any formal case"
        right={<button className="btn btn-navy" onClick={() => setAdding(true)}>+ Log counselling</button>} />
      <GuideBanner view="lm-counsel" />
      <Card>
        {couns.length ? (
          <table className="table">
            <thead><tr><th>Ref</th><th>Employee</th><th>Issue</th><th>Date</th><th>Outcome</th><th>Manage</th></tr></thead>
            <tbody>
              {couns.map(c => {
                const e = empById(c.empId, emps);
                return (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
                    <td>{c.topic}<div className="sub">{c.discussed}</div></td>
                    <td>{c.date}</td>
                    <td><span className={'pill ' + counselOutcomeClass(c.outcome)}>{c.outcome}</span>{c.escalatedTo && <div className="sub">→ {c.escalatedTo}</div>}</td>
                    <td className="row-actions">
                      {c.outcome !== 'Escalated' && <TipBtn tip="Turn this counselling record into a formal case, carrying the notes forward." className="btn btn-sm btn-navy" onClick={() => setEscalating(c)}>Escalate</TipBtn>}
                      {c.outcome !== 'Escalated' && <TipBtn tip="Edit this record." className="btn btn-sm btn-ghost" onClick={() => setEditing(c)}>Edit</TipBtn>}
                      {c.outcome !== 'Escalated' && <TipBtn tip="Permanently delete this draft case. This cannot be undone." className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete counselling ' + c.id + '?')) store.deleteCounselling(c.id); }}>Delete</TipBtn>}
                      {c.outcome === 'Escalated' && <span className="sub">Now a formal case</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>No counselling recorded yet. Log the informal step here before raising a case.</Empty>}
      </Card>
      {(adding || editing) && <CounsellingModal store={store} rec={editing} onClose={() => { setAdding(false); setEditing(null); }} />}
      {escalating && <EscalateModal store={store} cn={escalating} onClose={() => setEscalating(null)} />}
    </div>
  );
}

function CounsellingModal({ store, rec, onClose }) {
  const { emps } = store;
  const isNew = !rec;
  const [f, setF] = useState({
    empId: rec?.empId || '', topic: rec?.topic || '', discussed: rec?.discussed || '',
    outcome: rec?.outcome || 'Resolved', date: rec?.date || '2026-06-21', by: rec?.by || '',
  });
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  function save() {
    if (!f.empId) { alert('Select an employee.'); return; }
    if (!f.topic.trim()) { alert('Describe the issue.'); return; }
    const sup = empById(+f.empId, emps)?.sup || f.by;
    const payload = { ...f, empId: +f.empId, by: f.by || sup };
    if (isNew) store.addCounselling(payload); else store.updateCounselling(rec.id, payload);
    onClose();
  }
  return (
    <Modal title={isNew ? 'Log counselling' : `Edit ${rec.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={save}>{isNew ? 'Save' : 'Save changes'}</button></>}>
      <Field label={<>Employee <InfoTip text="A red circle next to an employee’s name means they already have one or more open disciplinary cases." /></>}>
        <select className="input" value={f.empId} onChange={set('empId')} disabled={!isNew}>
          <option value="">— Select employee —</option>
          {emps.map(e => { const open = store.cases.filter(c => c.empId === e.id && c.status !== 'Closed').length; return (
            <option key={e.id} value={e.id}>{open ? '🔴 ' : ''}{e.name} — {e.title}{open ? ` (${open} open case${open > 1 ? 's' : ''})` : ''}</option>
          ); })}
        </select>
      </Field>
      <Field label="Issue / concern"><textarea className="input" rows={2} value={f.topic} onChange={set('topic')} placeholder="What performance or conduct problem occurred…" /></Field>
      <Field label="What was discussed"><textarea className="input" rows={2} value={f.discussed} onChange={set('discussed')} placeholder="The counselling conversation, and any agreement reached…" /></Field>
      <div className="form-grid">
        <Field label="Outcome">
          <select className="input" value={f.outcome} onChange={set('outcome')}>
            <option value="Resolved">Resolved — no further action</option>
            <option value="Verbal admonishment">Verbal admonishment (oral warning on file)</option>
          </select>
        </Field>
        <Field label="Date"><input type="date" className="input" value={f.date} onChange={set('date')} /></Field>
      </div>
      <p className="hint">To take this further, save it and use “Escalate” to raise a formal case — the notes carry forward.</p>
    </Modal>
  );
}

function EscalateModal({ store, cn, onClose }) {
  const { offs, emps } = store;
  const [rows, setRows] = useState([{ off: '', rec: '' }]);
  const [date, setDate] = useState('2026-06-21');
  const e = empById(cn.empId, emps);

  function rowInfo(off, offset) {
    if (!off) return null;
    const o = offByN(+off, offs); if (!o) return null;
    const occ = occurrenceFor(cn.empId, +off, store.cases) + offset;
    const pair = rangeForOcc(o, occ);
    return { o, occ, pair, opts: optionsInRange(pair) };
  }
  function setRow(i, patch) { setRows(rs => rs.map((r, idx) => idx === i ? { ...r, ...patch } : r)); }
  function addRow() { setRows(rs => [...rs, { off: '', rec: '' }]); }
  function removeRow(i) { setRows(rs => rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs); }

  function go() {
    const chosen = rows.filter(r => r.off);
    if (!chosen.length) { alert('Select at least one offence.'); return; }
    const seen = new Set();
    for (const r of chosen) { if (seen.has(r.off)) { alert('The same offence is selected more than once.'); return; } seen.add(r.off); }
    for (const r of chosen) if (!r.rec) { alert('Select a recommended action for every offence.'); return; }
    store.escalateCounsellingMulti(cn.id, chosen, date);
    onClose();
  }
  return (
    <Modal title={`Escalate ${cn.id} to a formal case`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Create a formal case from this counselling, carrying the notes and offences forward." className="btn btn-navy" onClick={go}>Escalate to case</TipBtn></>}>
      <div className="penalty-box">
        <div className="sub">Carrying forward from counselling</div>
        <div className="penalty-title">{e?.name} — {cn.topic}</div>
        {cn.discussed && <div className="notice-quote" style={{ marginTop: 6 }}>{cn.discussed}</div>}
      </div>
      <div className="offences-head">
        <span>Offences <span className="sub">(one incident may involve more than one)</span></span>
        <TipBtn tip="Add another offence to the escalated case. Each offence keeps its own occurrence, range and recommendation." className="btn btn-sm btn-ghost" onClick={addRow}>+ Add offence</TipBtn>
      </div>
      {rows.map((r, i) => {
        const info = rowInfo(r.off, rows.slice(0, i).filter(x => x.off && x.off === r.off).length);
        return (
          <div key={i} className="off-row">
            <div className="off-row-head"><b>Offence {i + 1}</b>{rows.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRow(i)}>Remove</button>}</div>
            <div className="form-grid">
              <Field label="Offence">
                <select className="input" value={r.off} onChange={e => setRow(i, { off: e.target.value, rec: '' })}>
                  <option value="">— Select offence —</option>
                  {offs.map(o => <option key={o.n} value={o.n}>{o.n}. {o.name}</option>)}
                </select>
              </Field>
              <Field label="Recommended action">
                <select className="input" value={r.rec} onChange={e => setRow(i, { rec: e.target.value })} disabled={!info}>
                  <option value="">— Select action —</option>
                  {info && info.opts.map(c => <option key={c} value={c}>{c} — {penFull(c)}</option>)}
                </select>
              </Field>
            </div>
            {info && <div className="penalty-box"><div className="penalty-title">{occLabel(info.occ)} occurrence — <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(info.pair) }} /></div>{info.o.note && <div className="penalty-note">⚠ {info.o.note}</div>}</div>}
          </div>
        );
      })}
      <div className="form-grid"><Field label="Date raised"><input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} /></Field></div>
      <p className="hint">This creates a formal case (status: With HR) linked to {cn.id}, and marks the counselling as Escalated.</p>
    </Modal>
  );
}
/* Shared read-only counselling log (HR / CEO). Optionally scoped by a filter fn. */
function CounsellingTable({ store, filterFn }) {
  const { couns, emps } = store;
  const rows = filterFn ? couns.filter(filterFn) : couns;
  return rows.length ? (
    <table className="table">
      <thead><tr><th>Ref</th><th>Employee</th><th>Dept</th><th>Issue</th><th>Discussed</th><th>Date</th><th>Outcome</th></tr></thead>
      <tbody>
        {rows.map(c => {
          const e = empById(c.empId, emps);
          return (
            <tr key={c.id}>
              <td className="mono">{c.id}</td>
              <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
              <td>{e?.dept}</td>
              <td>{c.topic}</td>
              <td className="sub">{c.discussed}</td>
              <td>{c.date}</td>
              <td><span className={'pill ' + counselOutcomeClass(c.outcome)}>{c.outcome}</span>{c.escalatedTo && <div className="sub">→ {c.escalatedTo}</div>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : <Empty>No counselling records.</Empty>;
}

function CounsellingLog({ store }) {
  const { couns } = store;
  const n = o => couns.filter(c => c.outcome === o).length;
  return (
    <div className="page">
      <PageHead title="Counselling Log" info="A read-only record of all informal counselling logged by line managers." sub="Informal counselling recorded before formal cases — oversight" />
      <GuideBanner view="counsel-log" />
      <div className="stat-grid">
        <Stat n={couns.length} label="Total logged" color="#134E4A" />
        <Stat n={n('Resolved')} label="Resolved" color="#059669" />
        <Stat n={n('Verbal admonishment')} label="Verbal admonishment" color="#B45309" />
        <Stat n={n('Escalated')} label="Escalated to case" color="#6D28D9" />
      </div>
      <Card><CounsellingTable store={store} /></Card>
    </div>
  );
}

function ExecCounselling({ store, execId }) {
  const { emps } = store;
  const { exec, inPortfolio } = useExec(execId, emps);
  const ids = new Set(inPortfolio.map(e => e.id));
  return (
    <div className="page">
      <PageHead title="Portfolio Counselling" info="Informal counselling records for your portfolio staff. Read-only oversight." sub={`Informal counselling across ${exec.title} — oversight`} />
      <GuideBanner view="exec-counsel" />
      <Card><CounsellingTable store={store} filterFn={c => ids.has(c.empId)} /></Card>
    </div>
  );
}

function LMRaise({ store, setView, draftId, setDraftId }) {
  const { emps, offs } = store;
  const draft = draftId ? store.cases.find(x => x.id === draftId) : null;
  const cases = draft ? store.cases.filter(x => x.id !== draftId) : store.cases;
  const [empId, setEmpId] = useState(draft ? String(draft.empId) : '');
  const [rows, setRows] = useState(draft ? offList(draft).map(x => ({ off: String(x.off), rec: x.rec || '' })) : [{ off: '', rec: '' }]);   // multiple offences
  const [desc, setDesc] = useState(draft?.desc || '');
  const [date, setDate] = useState(draft?.raised || '2026-06-21');
  const [serious, setSerious] = useState(!!draft?.serious);
  const [files, setFiles] = useState(draft?.lmFiles || []);
  const [history, setHistory] = useState(null);

  function onFiles(ev) {
    const list = Array.from(ev.target.files || []);
    list.forEach(f => { const r = new FileReader(); r.onload = () => setFiles(prev => [...prev, { name: f.name, type: f.type, size: f.size, data: r.result }]); r.readAsDataURL(f); });
    ev.target.value = '';
  }
  function removeFile(i) { setFiles(f => f.filter((_, idx) => idx !== i)); }

  const priorCounselling = useMemo(() => {
    if (!empId) return [];
    return store.couns.filter(c => c.empId === +empId);
  }, [empId, store.couns]);

  const openCases = useMemo(() => {
    if (!empId) return [];
    return cases.filter(c => c.empId === +empId && c.status !== 'Closed');
  }, [empId, cases]);

  const pastCases = useMemo(() => {
    if (!empId) return [];
    return cases.filter(c => c.empId === +empId && c.status === 'Closed');
  }, [empId, cases]);

  // per-row penalty info (occurrence + range), counting earlier rows in this case as history
  function rowInfo(off, idxOffsetSameOff) {
    if (!empId || !off) return null;
    const o = offByN(+off, offs); if (!o) return null;
    let occ = occurrenceFor(+empId, +off, cases) + idxOffsetSameOff;
    const pair = rangeForOcc(o, occ);
    return { o, occ, pair, opts: optionsInRange(pair) };
  }

  function setRow(i, patch) { setRows(rs => rs.map((r, idx) => idx === i ? { ...r, ...patch } : r)); }
  function addRow() { setRows(rs => [...rs, { off: '', rec: '' }]); }
  function removeRow(i) { setRows(rs => rs.length > 1 ? rs.filter((_, idx) => idx !== i) : rs); }

  function submit(asDraft) {
    if (!empId) { alert('Select an employee.'); return; }
    const chosen = rows.filter(r => r.off);
    if (!chosen.length) { alert('Select at least one offence.'); return; }
    // duplicate offence check
    const seen = new Set();
    for (const r of chosen) { if (seen.has(r.off)) { alert('The same offence is selected more than once.'); return; } seen.add(r.off); }
    if (!asDraft) {
      for (const r of chosen) if (!r.rec) { alert('Select a recommended action for every offence.'); return; }
    }
    // fill missing rec with first option when saving a draft
    const payload = chosen.map((r, i) => {
      const info = rowInfo(r.off, chosen.slice(0, i).filter(x => x.off === r.off).length);
      return { off: r.off, rec: r.rec || (info ? info.opts[0] : '') };
    });
    if (draft) { store.updateDraftMulti(draft.id, +empId, payload, desc, date, asDraft, serious, files); setDraftId && setDraftId(null); }
    else store.submitCaseMulti(+empId, payload, desc, date, asDraft, serious, files);
    setEmpId(''); setRows([{ off: '', rec: '' }]); setDesc(''); setSerious(false); setFiles([]);
    setView('lm-queue');
  }

  return (
    <div className="page">
      <PageHead title={draft ? `Edit draft ${draft.id}` : "Raise a Disciplinary Case"} info="Start a formal case. Add one or more offences — each is checked for its own occurrence and penalty range." sub="Counsel first — raise a formal case only if the problem continues" />
      <GuideBanner view="lm-raise" />
      <Card>
        <Field label={<>Employee <InfoTip text="A red circle next to an employee’s name means they already have one or more open disciplinary cases." /></>}>
          <select className="input" value={empId} onChange={e => { setEmpId(e.target.value); setRows([{ off: '', rec: '' }]); }}>
            <option value="">— Select employee —</option>
            {emps.map(e => { const open = cases.filter(c => c.empId === e.id && c.status !== 'Closed').length; return (
              <option key={e.id} value={e.id}>{open ? '🔴 ' : ''}{e.name} — {e.title}{open ? ` (${open} open case${open > 1 ? 's' : ''})` : ''}</option>
            ); })}
          </select>
        </Field>

        {openCases.length > 0 && (
          <div className="counsel-alert" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
            <div className="inv-title" style={{ color: '#991B1B' }}>🔴 This employee already has {openCases.length} open case{openCases.length > 1 ? 's' : ''}</div>
            <div className="sub" style={{ marginBottom: 6 }}>You can still raise a new case if this is a separate matter — check it isn’t a duplicate.</div>
            {openCases.map(c => (
              <div key={c.id} className="counsel-alert-row" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="mono">{c.id}</span> · {offByN(c.off, offs)?.name}
                <span className={'pill ' + statusClass(c.status)}>{c.status}</span>
                <TipBtn tip="View the full history of this employee’s existing case." className="btn btn-sm btn-ghost" onClick={() => setHistory(c)}>View history</TipBtn>
              </div>
            ))}
          </div>
        )}

        {pastCases.length > 0 && (
          <div className="counsel-alert">
            <div className="inv-title">🕘 This employee has {pastCases.length} past (closed) case{pastCases.length > 1 ? 's' : ''} on record</div>
            <div className="sub" style={{ marginBottom: 6 }}>Earlier disciplinary history — useful for judging occurrence and repeat behaviour.</div>
            {pastCases.map(c => (
              <div key={c.id} className="counsel-alert-row" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="mono">{c.id}</span> · {offByN(c.off, offs)?.name}
                <span className={'chip ' + penClass(c.decision || c.rec)}>{c.decision || c.rec}</span>
                <span className="sub">{c.outcome}</span>
                {windowMonths(c.decision || c.rec) > 0 && (activeWarning(c)
                  ? <span className="pill st-hr" title={'Active until ' + fmtDate(caseExpiry(c))}>Active window</span>
                  : <span className="pill st-closed" title="Warning expired — clean slate">Expired ✓</span>)}
                <TipBtn tip="View the full history of this past case." className="btn btn-sm btn-ghost" onClick={() => setHistory(c)}>View history</TipBtn>
              </div>
            ))}
          </div>
        )}
        {empId && priorCounselling.length === 0 && !serious && (
          <div className="counsel-alert" style={{ borderColor: '#FCD34D', background: '#FFFBEB' }}>
            <div className="inv-title" style={{ color: '#92400E' }}>💬 No counselling on file — consider counselling first</div>
            <div className="sub">Counselling is the recommended first step for a minor or first-time issue. For a serious offence, tick “Serious offence” below and raise the case directly.</div>
          </div>
        )}
        {priorCounselling.length > 0 && (
          <div className="counsel-alert">
            <div className="inv-title">⚠ Prior counselling on file for {empById(+empId, emps)?.name}</div>
            <div className="sub" style={{ marginBottom: 6 }}>This employee has been counselled before. If this is a repeat problem, raising a formal case is appropriate — the earlier counselling supports it.</div>
            {priorCounselling.map(c => (
              <div key={c.id} className="counsel-alert-row">
                <span className="mono">{c.id}</span> · {c.date} · {c.topic}
                <span className={'pill ' + counselOutcomeClass(c.outcome)} style={{ marginLeft: 6 }}>{c.outcome}</span>
              </div>
            ))}
          </div>
        )}

        <div className="offences-head">
          <span>Offences <span className="sub">(a single incident may involve more than one)</span></span>
          <TipBtn tip="Add another offence to this case. Each offence is assessed on its own occurrence and penalty range." className="btn btn-sm btn-ghost" onClick={addRow}>+ Add offence</TipBtn>
        </div>

        {rows.map((r, i) => {
          const info = rowInfo(r.off, rows.slice(0, i).filter(x => x.off && x.off === r.off).length);
          return (
            <div key={i} className="off-row">
              <div className="off-row-head">
                <b>Offence {i + 1}</b>
                {rows.length > 1 && <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRow(i)}>Remove</button>}
              </div>
              <div className="form-grid">
                <Field label="Offence">
                  <select className="input" value={r.off} onChange={e => setRow(i, { off: e.target.value, rec: '' })}>
                    <option value="">— Select offence —</option>
                    {offs.map(o => <option key={o.n} value={o.n}>{o.n}. {o.name}</option>)}
                  </select>
                </Field>
                <Field label="Recommended action">
                  <select className="input" value={r.rec} onChange={e => setRow(i, { rec: e.target.value })} disabled={!info}>
                    <option value="">— Select action —</option>
                    {info && info.opts.map(c => <option key={c} value={c}>{c} — {penFull(c)}</option>)}
                  </select>
                </Field>
              </div>
              {info && (
                <div className="penalty-box">
                  <div className="penalty-title">{occLabel(info.occ)} occurrence — <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(info.pair) }} /></div>
                  {info.o.note && <div className="penalty-note">⚠ {info.o.note}</div>}
                </div>
              )}
            </div>
          );
        })}

        <div className="form-grid" style={{ marginTop: 4 }}>
          <Field label="Date raised"><input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} /></Field>
        </div>
        <Field label="Statement of facts"><textarea className="input" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What happened, investigations, employee response so far…" /></Field>
        <div className="inv-section">
          <div className="inv-title">Supporting documents & evidence <InfoTip text="Attach any documents or images that support the case — reports, photos, emails, CCTV stills. HR sees these during the investigation." /></div>
          {files.length > 0 && (
            <div className="file-list">
              {files.map((f, i) => (
                <div key={i} className="file-chip">
                  {f.type && f.type.startsWith('image/') ? <img src={f.data} alt={f.name} className="file-thumb" /> : <span className="file-ico">📄</span>}
                  <div className="file-meta"><a href={f.data} download={f.name} className="file-name">{f.name}</a><div className="sub">{(f.size/1024).toFixed(0)} KB</div></div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFile(i)}>×</button>
                </div>
              ))}
            </div>
          )}
          <label className="file-drop">
            <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={onFiles} hidden />
            <span>📎 Click to upload documents or images</span>
          </label>
        </div>
        <label className="serious-check">
          <input type="checkbox" checked={serious} onChange={e => setSerious(e.target.checked)} />
          <span><b>Serious offence</b> — report to HR immediately. HR is alerted now, while the investigation continues.</span>
        </label>
        <div className="form-actions">
          <TipBtn tip="Save this case as a draft without sending it to HR yet." className="btn btn-ghost" onClick={() => submit(true)}>Save as draft</TipBtn>
          <TipBtn tip="Send this case to HR for review." className="btn btn-navy" onClick={() => submit(false)}>Submit to HR</TipBtn>
        </div>
      </Card>
      {history && <CaseHistoryModal store={store} c={history} onClose={() => setHistory(null)} />}
    </div>
  );
}

/* ═══════════ HR MANAGER ═══════════ */
function HRQueue({ store }) {
  const { cases, emps, offs } = store;
  const queue = cases.filter(c => ['With HR', 'Awaiting Response', 'Awaiting Decision'].includes(c.status));
  const [acting, setActing] = useState(null);
  const [investigating, setInvestigating] = useState(null);
  const [juring, setJuring] = useState(null);
  const [forwarding, setForwarding] = useState(null); // {c, to:'CEO'|'SMT'}
  const [lettering, setLettering] = useState(null);
  const [paffing, setPaffing] = useState(null);
  const [pafing, setPafing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const actionFor = c => c.status === 'With HR'
      ? (c.investigation ? { label: 'Issue notice', to: 'Awaiting Response' } : { label: 'Investigate', to: 'investigate' })
    : c.status === 'Awaiting Response' ? { label: 'Record response', to: 'Awaiting Decision' }
    : { label: 'Record decision', to: 'Closed' };
  return (
    <div className="page">
      <PageHead title="HR Queue" info="Cases needing HR action, in order: investigate, issue notice, record response, then decision." sub="Cases awaiting HR action, in workflow order" />
      <GuideBanner view="hr-queue" />
      {(() => {
        const serious = queue.filter(c => c.serious && !c.seriousAck);
        if (!serious.length) return null;
        return (
          <div className="serious-alert">
            <div className="serious-alert-h">⚠ {serious.length} serious offence{serious.length > 1 ? 's' : ''} reported — action required while investigation is ongoing</div>
            {serious.map(c => {
              const e = empById(c.empId, emps), o = offByN(c.off, offs);
              return (
                <div key={c.id} className="serious-alert-row">
                  <div><b>{c.id}</b> · {e?.name} — {o?.name}</div>
                  <TipBtn tip="Confirm HR has seen the serious-offence alert and is acting on it." dt="ack" className="btn btn-sm btn-navy" onClick={() => store.acknowledgeSerious(c.id)}>Acknowledge</TipBtn>
                </div>
              );
            })}
          </div>
        );
      })()}
      <Card>
        {queue.length ? (
          <table className="table">
            <thead><tr><th>Case</th><th>Employee</th><th>Offence</th><th>Occ.</th><th>Range</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {queue.map(c => {
                const e = empById(c.empId, emps), o = offByN(c.off, offs);
                const pair = o ? rangeForOcc(o, c.occ) : null;
                const na = actionFor(c);
                return (
                  <tr key={c.id} className={c.serious ? 'row-serious' : ''}>
                    <td className="mono">{c.id}{c.serious && <div style={{marginTop:4}}><span className="pill st-serious">⚠ Serious</span></div>}</td>
                    <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
                    <td><OffenceCell c={c} offs={offs} /></td>
                    <td>{caseOffences(c).map(x=>occLabel(x.occ)).join(", ")}</td>
                    <td dangerouslySetInnerHTML={{ __html: rangeChips(pair) }} />
                    <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span><DueTag c={c} /></td>
                    <td className="row-actions">
                      {c.status === 'Awaiting Response' && c.noticeDate && responseDue(c.noticeDate) < 0 &&
                        <TipBtn tip="The 5 working-day window has passed with no response. Move the case to decision and record that no response was received." className="btn btn-sm btn-ghost" dt="no-response" onClick={() => setActing({ c, action: { label: 'Proceed without response', to: 'Awaiting Decision', noResponse: true } })}>Proceed without response</TipBtn>}
                      {c.status === 'With HR' && !c.investigation &&
                        <TipBtn tip="Open the investigation: record findings, discussions, witnesses and evidence before any notice is issued." className="btn btn-sm btn-navy" onClick={() => setInvestigating(c)}>Investigate</TipBtn>}
                      {c.status === 'With HR' && c.investigation && <>
                        <TipBtn tip="Re-open the saved investigation to review or edit findings, witnesses and evidence." className="btn btn-sm btn-ghost" onClick={() => setInvestigating(c)}>Investigation</TipBtn>
                        <TipBtn tip="Issue the official notice to the employee. It appears in their My Notices and starts the 5 working-day response window." className="btn btn-sm btn-navy" dt="issue-notice" onClick={() => setActing({ c, action: { label: 'Issue notice', to: 'Awaiting Response' } })}>Issue notice</TipBtn>
                        <TipBtn tip="Activate an impartial peer panel to give an independent finding and recommendation on a serious case." dt="jury" className="btn btn-sm btn-ghost" onClick={() => setJuring(c)}>{c.jury?.active ? 'Jury ✓' : 'Jury of Peers'}</TipBtn>
                        <TipBtn tip="Send the case straight to the CEO for a final decision (HR recommendation required)." className="btn btn-sm btn-navy" dt="fwd-ceo" onClick={() => setForwarding({ c, to: 'CEO' })}>Forward to CEO</TipBtn>
                        <TipBtn tip="Send the case to a chosen SMT member for a recommendation to the CEO (HR recommendation required)." className="btn btn-sm btn-navy" dt="fwd-smt" onClick={() => setForwarding({ c, to: 'SMT' })}>Forward to SMT</TipBtn>
                      </>}
                      {c.status !== 'With HR' &&
                        <TipBtn tip="Issue notice starts the 5-day response window; Record response captures the employee\u2019s reply; Record decision sets the final action and closes the case." className="btn btn-sm btn-navy" onClick={() => setActing({ c, action: na })}>{na.label}</TipBtn>}
                      {['Awaiting Response','Awaiting Decision','Closed'].includes(c.status) &&
                        <TipBtn tip="Generate a formatted disciplinary notice, auto-filled from the case, to print or save as PDF." className="btn btn-sm btn-ghost" dt="letter" onClick={() => setLettering(c)}>Letter</TipBtn>}
                      {c.status === 'Closed' &&
                        <TipBtn tip="Generate the Personnel Action Form (PAF) for payroll on a closed case." className="btn btn-sm btn-ghost" dt="paf" onClick={() => setPaffing(c)}>Personnel Form</TipBtn>}
                      {c.status === 'Closed' &&
                        <TipBtn tip="Generate the Personnel Action Form for payroll on this closed case." className="btn btn-sm btn-ghost" onClick={() => setPafing(c)}>PAF</TipBtn>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>HR queue is clear.</Empty>}
      </Card>
      {acting && <ActionModal store={store} c={acting.c} action={acting.action} onClose={() => setActing(null)} />}
      {investigating && <InvestigationModal store={store} c={investigating} onClose={() => setInvestigating(null)} />}
      {juring && <JuryModal store={store} c={juring} onClose={() => setJuring(null)} />}
      {viewing && <CaseHistoryModal store={store} c={viewing} onClose={() => setViewing(null)} />}
      {forwarding && <ForwardModal store={store} c={forwarding.c} to={forwarding.to} onClose={() => setForwarding(null)} />}
      {lettering && <LetterModal store={store} c={lettering} onClose={() => setLettering(null)} />}
      {paffing && <PAFModal store={store} c={paffing} onClose={() => setPaffing(null)} />}
      {pafing && <PAFModal store={store} c={pafing} onClose={() => setPafing(null)} />}
    </div>
  );
}

/* Disciplinary notice / letter — auto-filled, printable */
function LetterModal({ store, c, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const decided = c.status === 'Closed';
  const action = c.decision || c.rec;
  const today = fmtDate('2026-06-21');

  function printLetter() {
    const node = document.getElementById('disc-letter');
    const w = window.open('', '_blank', 'width=820,height=1000');
    if (!w) { alert('Please allow pop-ups to print the letter.'); return; }
    w.document.write('<html><head><title>Disciplinary Notice — ' + c.id + '</title>');
    w.document.write('<style>body{font-family:Georgia,serif;color:#111;line-height:1.6;padding:48px;max-width:720px;margin:auto}h1{font-size:20px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.05em;color:#0D2B55;border-bottom:2px solid #C9A84C;padding-bottom:4px}.row{margin:6px 0}.lbl{font-weight:bold;display:inline-block;min-width:170px}.sig{margin-top:48px;display:flex;justify-content:space-between}.sig div{border-top:1px solid #333;padding-top:6px;width:45%;font-size:13px}</style></head><body>');
    w.document.write(node.innerHTML);
    w.document.write('</body></html>');
    w.document.close(); w.focus();
    setTimeout(() => { w.print(); }, 300);
  }

  return (
    <Modal title={`Disciplinary Notice — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Close</button><button className="btn btn-navy" onClick={printLetter}>🖨 Print / Save PDF</button></>}>
      <div id="disc-letter" className="letter">
        <div className="letter-head">
          <div><b>FSMPC</b><div className="sub">Human Resources Office</div></div>
          <div className="sub" style={{ textAlign: 'right' }}>Ref: {c.id}<br />Date: {today}</div>
        </div>
        <h1>Notice of Disciplinary {decided ? 'Decision' : 'Charge'}</h1>
        <div className="row"><span className="lbl">To:</span> {e?.name}, {e?.title}</div>
        <div className="row"><span className="lbl">Department:</span> {e?.dept}</div>
        <div className="row"><span className="lbl">Supervisor:</span> {e?.sup}</div>

        <h2>The charge{offList(c).length > 1 ? 's' : ''}</h2>
        {offList(c).map((x, i) => { const oo = offByN(+x.off, offs); return (
          <div key={i} style={{ marginBottom: 6 }}>
            <div className="row"><span className="lbl">{offList(c).length > 1 ? `Offence ${i + 1}:` : 'Offence:'}</span> {oo?.name}</div>
            <div className="row"><span className="lbl">Category / occurrence:</span> {oo?.cat} — {occLabel(x.occ)}</div>
            {oo?.note && <div className="row"><span className="lbl">Note:</span> {oo.note}</div>}
          </div>
        ); })}
        {c.desc && <div className="row"><span className="lbl">Details:</span> {c.desc}</div>}

        {c.investigation?.findings && <>
          <h2>Investigation</h2>
          <div className="row">{c.investigation.findings}</div>
          {c.investigation.witnesses?.length > 0 && <div className="row"><span className="lbl">Witnesses:</span> {c.investigation.witnesses.map(w => w.name).join(', ')}</div>}
        </>}

        <h2>{decided ? 'Decision' : 'Proposed action'}</h2>
        {offList(c).length > 1
          ? offList(c).map((x, i) => { const code = decided ? (x.decision || action) : x.rec; return (
              <div key={i} className="row"><span className="lbl">{`Offence ${i + 1}:`}</span> {penFull(code)}</div>); })
          : <div className="row"><span className="lbl">Action:</span> {penFull(action)}</div>}
        {offList(c).length > 1 && decided && <div className="row"><span className="lbl">Overall outcome:</span> {penFull(action)}</div>}
        {c.smtRec && <div className="row"><span className="lbl">SMT recommendation:</span> {penFull(c.smtRec)}</div>}
        {c.outcome && <div className="row"><span className="lbl">Outcome:</span> {c.outcome}</div>}

        {!decided && <>
          <h2>Your right to respond</h2>
          <div className="row">You have <b>5 working days</b> from the date of this notice to submit a written response. You may also appeal any decision within <b>10 working days</b>. If you have a genuine reason you cannot respond in time, a reasonable extension may be granted.</div>
        </>}

        <div className="sig">
          <div>HR Manager<br /><span className="sub">Human Resources Office</span></div>
          <div>Employee acknowledgement<br /><span className="sub">Signature &amp; date</span></div>
        </div>
      </div>
      <p className="hint">Auto-filled from the case. Use Print / Save PDF to issue it. Content updates automatically if the case changes.</p>
    </Modal>
  );
}


/* Personnel Action Form (PAF) — official form to action a disciplinary decision */
function PAFModal({ store, c, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const action = c.decision || c.rec;
  const today = fmtDate('2026-06-21');

  // map the penalty to a payroll-facing action type + effect
  const isDismissal = action === 'D';
  const isSuspension = action && action[0] === 'S';
  const susDays = isSuspension ? action.substring(1) : '';
  const actionType = isDismissal ? 'Termination of employment'
    : isSuspension ? 'Suspension without pay'
    : action === 'R' ? 'Written warning (no pay change)'
    : 'Admonishment (no pay change)';
  const payrollEffect = isDismissal ? 'Remove from payroll; process final entitlements'
    : isSuspension ? `Withhold ${susDays} working day(s) of pay`
    : 'No change to pay';
  const route = c.smtRec ? 'HR → SMT → CEO' : (c.referredBy === 'HR' ? 'HR → CEO' : 'Line Manager → HR');

  function printPAF() {
    const node = document.getElementById('paf-doc');
    const w = window.open('', '_blank', 'width=820,height=1000');
    if (!w) { alert('Please allow pop-ups to print the form.'); return; }
    w.document.write('<html><head><title>Personnel Action Form — ' + c.id + '</title>');
    w.document.write('<style>body{font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5;padding:44px;max-width:720px;margin:auto}h1{font-size:19px;color:#0D2B55}h2{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#0D2B55;border-bottom:2px solid #C9A84C;padding-bottom:3px;margin-top:20px}table{width:100%;border-collapse:collapse;margin:6px 0}td{padding:6px 8px;border:1px solid #ccc;font-size:13px;vertical-align:top}td.k{background:#f5f3ee;font-weight:bold;width:210px}.sig{margin-top:40px;display:flex;justify-content:space-between}.sig div{border-top:1px solid #333;padding-top:6px;width:30%;font-size:12px}</style></head><body>');
    w.document.write(node.innerHTML);
    w.document.write('</body></html>');
    w.document.close(); w.focus();
    setTimeout(() => w.print(), 300);
  }

  const Row = ({ k, v }) => (<tr><td className="k">{k}</td><td>{v}</td></tr>);

  return (
    <Modal title={`Personnel Action Form — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Close</button><button className="btn btn-navy" onClick={printPAF}>🖨 Print / Save PDF</button></>}>
      <div id="paf-doc" className="letter">
        <div className="letter-head">
          <div><b>FSMPC</b><div className="sub">Personnel Action Form (PAF)</div></div>
          <div className="sub" style={{ textAlign: 'right' }}>Form: PAF-{c.id}<br />Date: {today}</div>
        </div>
        <h1>Personnel Action Form</h1>

        <h2>Employee</h2>
        <table className="paf-table"><tbody>
          <Row k="Name" v={e?.name} />
          <Row k="Employee ID" v={e?.id} />
          <Row k="Job title" v={e?.title} />
          <Row k="Department" v={e?.dept} />
          <Row k="Supervisor" v={e?.sup} />
        </tbody></table>

        <h2>Disciplinary action</h2>
        <table className="paf-table"><tbody>
          <Row k="Case reference" v={c.id} />
          {offList(c).map((x, i) => <Row key={i} k={offList(c).length > 1 ? `Offence ${i + 1}` : 'Offence'} v={`${offByN(+x.off, offs)?.name || ''} — ${occLabel(x.occ)} — ${penFull(x.decision || action)}`} />)}
          <Row k={offList(c).length > 1 ? 'Overall decision' : 'Decision'} v={penFull(action)} />
          <Row k="Action type" v={actionType} />
          {isSuspension && <Row k="Suspension length" v={`${susDays} working day(s)`} />}
          <Row k="Effective date" v={today} />
          <Row k="Approval route" v={route} />
          {c.outcome && <Row k="Outcome note" v={c.outcome} />}
        </tbody></table>

        <h2>Payroll instruction</h2>
        <table className="paf-table"><tbody>
          <Row k="Payroll effect" v={payrollEffect} />
          <Row k="Processed by payroll" v="☐  ______________   Date: __________" />
        </tbody></table>

        <div className="sig">
          <div>Prepared by (HR)</div>
          <div>Approved by (CEO)</div>
          <div>Payroll</div>
        </div>
      </div>
      <p className="hint">Auto-filled from the closed case. This form actions the decision in payroll. Print / Save PDF to file it.</p>
    </Modal>
  );
}


/* Personnel Action Form (PAF) — generated on the final decision, printable */
/* Jury of Peers — activate a peer panel for serious cases */
function JuryModal({ store, c, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const pair = o ? rangeForOcc(o, c.occ) : null;
  const opts = optionsInRange(pair);
  const j0 = c.jury || {};
  const [active, setActive] = useState(j0.active || false);
  const [members, setMembers] = useState(j0.members || []);
  const [mName, setMName] = useState('');
  const [mDept, setMDept] = useState('');
  const [finding, setFinding] = useState(j0.finding || '');
  const [rec, setRec] = useState(j0.rec || '');
  const [notes, setNotes] = useState(j0.notes || '');

  function addMember() {
    if (!mName.trim()) return;
    setMembers(m => [...m, { name: mName.trim(), dept: mDept.trim() }]);
    setMName(''); setMDept('');
  }
  function removeMember(i) { setMembers(m => m.filter((_, idx) => idx !== i)); }

  function save() {
    store.saveJury(c.id, { active, members, finding, rec, notes, savedAt: '2026-06-21' });
    onClose();
  }

  return (
    <Modal title={`Jury of Peers — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Save the peer panel, finding and recommendation onto the case." className="btn btn-navy" onClick={save}>Save jury</TipBtn></>}>
      <div className="penalty-box">
        <div className="penalty-title">{e?.name} — {o?.name}</div>
        <div className="sub">For a serious case, HR may activate a Jury of Peers — an impartial panel of fellow employees who review the case and give an independent finding and recommendation to inform the decision.</div>
      </div>

      <label className="serious-check" style={{ marginBottom: 14 }}>
        <input type="checkbox" checked={active} onChange={ev => setActive(ev.target.checked)} />
        <span><b>Activate a Jury of Peers</b> for this case <InfoTip text="Convene an impartial panel of peers. Record members, their finding and a recommended action. Advisory only — HR/SMT/CEO still decide." /></span>
      </label>

      {active && <>
        <div className="inv-section">
          <div className="inv-title">Panel members <span className="sub">(impartial peers)</span></div>
          {members.length > 0 && (
            <div className="wit-list">
              {members.map((m, i) => (
                <div key={i} className="wit-row">
                  <div><b>{m.name}</b>{m.dept && <div className="sub">{m.dept}</div>}</div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => removeMember(i)}>Remove</button>
                </div>
              ))}
            </div>
          )}
          <div className="wit-add">
            <input className="input" placeholder="Member name" value={mName}
              onChange={ev => setMName(ev.target.value)}
              onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); addMember(); } }} />
            <input className="input" placeholder="Department / role (optional)" value={mDept}
              onChange={ev => setMDept(ev.target.value)}
              onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); addMember(); } }} />
            <button type="button" className="btn btn-navy" onClick={addMember} disabled={!mName.trim()}>+ Add member</button>
          </div>
        </div>

        <div className="inv-section">
          <div className="inv-title">Panel finding</div>
          <div className="form-grid">
            <Field label="Finding">
              <select className="input" value={finding} onChange={ev => setFinding(ev.target.value)}>
                <option value="">— Select —</option>
                <option value="Substantiated">Substantiated</option>
                <option value="Partly substantiated">Partly substantiated</option>
                <option value="Not substantiated">Not substantiated</option>
              </select>
            </Field>
            <Field label="Recommended action (within range)">
              <select className="input" value={rec} onChange={ev => setRec(ev.target.value)}>
                <option value="">— Select —</option>
                {opts.map(x => <option key={x} value={x}>{x} — {penFull(x)}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Panel notes"><textarea className="input" rows={3} value={notes} onChange={ev => setNotes(ev.target.value)} placeholder="The panel's reasoning and any conditions…" /></Field>
        </div>
      </>}
      <p className="hint">The jury's finding and recommendation are advisory — HR, the SMT and the CEO still make the formal decision. The panel is recorded on the case and appears in the audit log.</p>
    </Modal>
  );
}

function ForwardModal({ store, c, to, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const pair = o ? rangeForOcc(o, c.occ) : null;
  const opts = optionsInRange(pair);
  const [note, setNote] = useState('');
  const [member, setMember] = useState('');
  const [rec, setRec] = useState('');
  function go() {
    if (!rec) { alert('Select HR\u2019s recommended action — a recommendation to the CEO is required.'); return; }
    if (!note.trim()) { alert('Enter the reason / rationale for your recommendation.'); return; }
    if (to === 'SMT') {
      if (!member) { alert('Select which SMT member to forward to.'); return; }
      store.forwardToSMT(c.id, note, member, rec);
    } else store.forwardToCEO(c.id, note, rec);
    onClose();
  }
  return (
    <Modal title={`Forward ${c.id} to ${to === 'SMT' ? 'the SMT' : 'the CEO'}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={go}>Forward to {to}</button></>}>
      <div className="penalty-box">
        <div className="penalty-title">{e?.name}</div>
        {caseOffences(c).map((x, i) => { const oo = offByN(x.off, offs); const pr = oo ? rangeForOcc(oo, x.occ) : null; return (
          <div key={i} className="sub" style={{ margin: '2px 0' }}>{caseOffences(c).length > 1 ? `${i + 1}. ` : ''}{oo?.name} — {occLabel(x.occ)} occ, range <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(pr) }} /></div>
        ); })}
        <div className="sub" style={{ marginTop: 6 }}>{to === 'SMT'
          ? 'The Senior Management Team will review this case and recommend an action to the CEO. It then goes to the CEO with their recommendation.'
          : 'This case goes directly to the CEO for a final decision, skipping the notice/response stage.'}</div>
      </div>
      {to === 'SMT' && (
        <Field label="Forward to which SMT member (required)">
          <select className="input" value={member} onChange={ev => setMember(ev.target.value)}>
            <option value="">— Select SMT member —</option>
            {SMT_MEMBERS.map(m => <option key={m.id} value={m.name}>{m.name} — {m.title}</option>)}
          </select>
        </Field>
      )}
      <Field label="HR overall recommendation to the CEO (required)"><span className="sub" style={{display:'block',marginBottom:4}}>One recommendation covering the case as a whole.</span>
        <select className="input" value={rec} onChange={ev => setRec(ev.target.value)}>
          <option value="">— Select recommended action —</option>
          {opts.map(x => <option key={x} value={x}>{x} — {penFull(x)}</option>)}
        </select>
      </Field>
      <Field label="Reason / rationale for the recommendation (required)">
        <textarea className="input" rows={3} value={note} onChange={ev => setNote(ev.target.value)} placeholder="Why HR recommends this action…" />
      </Field>
      <p className="hint">HR must give a recommendation before a case can be escalated. It travels with the case and is shown to the {to === 'SMT' ? 'SMT and the CEO' : 'CEO'}.</p>
    </Modal>
  );
}

/* HR Investigation — before the notice is issued */
function InvestigationModal({ store, c, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const inv0 = c.investigation || {};
  const [findings, setFindings] = useState(inv0.findings || '');
  const [lmDiscuss, setLmDiscuss] = useState(inv0.lmDiscuss || '');
  const [staffDiscuss, setStaffDiscuss] = useState(inv0.staffDiscuss || '');
  const [witnesses, setWitnesses] = useState(inv0.witnesses || []);
  const [wName, setWName] = useState('');
  const [wNote, setWNote] = useState('');
  const [files, setFiles] = useState(inv0.files || []);

  function addWitness() {
    if (!wName.trim()) return;
    setWitnesses(w => [...w, { name: wName.trim(), note: wNote.trim() }]);
    setWName(''); setWNote('');
  }
  function removeWitness(i) { setWitnesses(w => w.filter((_, idx) => idx !== i)); }

  function onFiles(ev) {
    const list = Array.from(ev.target.files || []);
    list.forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setFiles(prev => [...prev, { name: f.name, type: f.type, size: f.size, data: reader.result }]);
      reader.readAsDataURL(f);
    });
    ev.target.value = '';
  }
  function removeFile(i) { setFiles(f => f.filter((_, idx) => idx !== i)); }

  function save(thenIssue) {
    store.saveInvestigation(c.id, { findings, lmDiscuss, staffDiscuss, witnesses, files, savedAt: '2026-06-21' });
    onClose();
  }

  const isImg = t => t && t.startsWith('image/');
  return (
    <Modal title={`Investigation — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Save the investigation findings, witnesses and evidence to the case." className="btn btn-navy" onClick={() => save(false)}>Save investigation</TipBtn></>}>
      <div className="penalty-box">
        <div className="penalty-title">{e?.name} — {o?.name}</div>
        <div className="sub">Investigate before issuing the notice: establish the facts, discuss with the line manager and the employee, and record any witnesses and evidence.</div>
      </div>
      <Field label="Investigation findings"><textarea className="input" rows={3} value={findings} onChange={ev => setFindings(ev.target.value)} placeholder="What the investigation established about the incident…" /></Field>
      <div className="form-grid">
        <Field label="Discussion with line manager"><textarea className="input" rows={2} value={lmDiscuss} onChange={ev => setLmDiscuss(ev.target.value)} /></Field>
        <Field label="Discussion with employee"><textarea className="input" rows={2} value={staffDiscuss} onChange={ev => setStaffDiscuss(ev.target.value)} /></Field>
      </div>

      <div className="inv-section">
        <div className="inv-title">Witnesses <span className="sub">(staff on site during the incident)</span></div>
        {witnesses.length > 0 && (
          <div className="wit-list">
            {witnesses.map((w, i) => (
              <div key={i} className="wit-row">
                <div><b>{w.name}</b>{w.note && <div className="sub">{w.note}</div>}</div>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeWitness(i)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="wit-add">
          <input className="input" placeholder="Witness name" value={wName}
            onChange={ev => setWName(ev.target.value)}
            onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); addWitness(); } }} />
          <input className="input" placeholder="What they said (optional)" value={wNote}
            onChange={ev => setWNote(ev.target.value)}
            onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); addWitness(); } }} />
          <button type="button" className="btn btn-navy" onClick={addWitness} disabled={!wName.trim()}>+ Add witness</button>
        </div>
      </div>

      <div className="inv-section">
        <div className="inv-title">Evidence — documents & images</div>
        {files.length > 0 && (
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-chip">
                {isImg(f.type)
                  ? <img src={f.data} alt={f.name} className="file-thumb" />
                  : <span className="file-ico">📄</span>}
                <div className="file-meta"><a href={f.data} download={f.name} className="file-name">{f.name}</a><div className="sub">{(f.size/1024).toFixed(0)} KB</div></div>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFile(i)}>×</button>
              </div>
            ))}
          </div>
        )}
        <label className="file-drop">
          <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={onFiles} hidden />
          <span>📎 Click to upload documents or images</span>
        </label>
      </div>
      <p className="hint">Once the investigation is saved, the case shows an “Issue notice” action. All notes, witnesses and evidence stay attached to the case.</p>
    </Modal>
  );
}

function HRAll({ store }) {
  const { cases, emps, offs } = store;
  const [q, setQ] = useState(''); const [sf, setSf] = useState('');
  const [lettering, setLettering] = useState(null);
  const [paffing, setPaffing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const rows = cases.filter(c => {
    const e = empById(c.empId, emps), o = offByN(c.off, offs);
    if (!e || !o) return false;
    if (q && (e.name + ' ' + o.name).toLowerCase().indexOf(q.toLowerCase()) < 0) return false;
    if (sf && c.status !== sf) return false;
    return true;
  });
  const statuses = [...new Set(cases.map(c => c.status))];
  return (
    <div className="page">
      <PageHead title="All Cases" info="Every disciplinary case across the company. Use View to open a case\u2019s full history." sub="Every disciplinary case across the company" />
      <div className="filters">
        <input className="input" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
        <select className="input" value={sf} onChange={e => setSf(e.target.value)}>
          <option value="">All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <Card>
        <table className="table">
          <thead><tr><th>Case</th><th>Employee</th><th>Offence</th><th>Occ.</th><th>Action</th><th>Status</th><th>Documents</th></tr></thead>
          <tbody>
            {rows.map(c => {
              const e = empById(c.empId, emps), o = offByN(c.off, offs);
              const canLetter = ['Awaiting Response','Awaiting Decision','Closed'].includes(c.status);
              return (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td><b>{e.name}</b></td>
                  <td><OffenceCell c={c} offs={offs} /></td>
                  <td>{occLabel(c.occ)}</td>
                  <td><span className={'chip ' + penClass(c.decision || c.rec)}>{c.decision || c.rec}</span></td>
                  <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span>{c.outcome && <div className="sub">{c.outcome}</div>}</td>
                  <td className="row-actions">
                    <TipBtn tip="Open the full case history: counselling, investigation, witnesses, evidence, recommendations and audit trail." className="btn btn-sm btn-ghost" dt="view" onClick={() => setViewing(c)}>View</TipBtn>
                    {canLetter && <TipBtn tip="Generate a formatted disciplinary notice, auto-filled from the case, to print or save as PDF." className="btn btn-sm btn-ghost" dt="letter" onClick={() => setLettering(c)}>Letter</TipBtn>}
                    {c.status === 'Closed' && <TipBtn tip="Generate the Personnel Action Form (PAF) for payroll on a closed case." className="btn btn-sm btn-ghost" dt="paf" onClick={() => setPaffing(c)}>Personnel Form</TipBtn>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {lettering && <LetterModal store={store} c={lettering} onClose={() => setLettering(null)} />}
      {paffing && <PAFModal store={store} c={paffing} onClose={() => setPaffing(null)} />}
      {viewing && <CaseHistoryModal store={store} c={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

/* ═══════════ STAFF ═══════════ */
function StaffNotices({ store }) {
  const { cases, emps, offs } = store;
  const notices = cases.filter(c => ['Awaiting Response', 'Awaiting Decision', 'Closed'].includes(c.status));
  const [acting, setActing] = useState(null);
  return (
    <div className="page">
      <PageHead title="My Notices" info="Official notices addressed to you. Give your response within 5 working days — it is considered before the decision is made." sub="Disciplinary notices addressed to employees — give your response here" />
      <GuideBanner view="staff-notices" />
      {notices.length ? notices.map(c => {
        const e = empById(c.empId, emps), o = offByN(c.off, offs);
        return (
          <Card key={c.id} title={`${c.id} · ${e?.name}`} sub={offList(c).length > 1 ? `${offList(c).length} offences` : o?.name}>
            <div className="notice-body">
              {offList(c).map((x, i) => { const oo = offByN(+x.off, offs); return (
                <div key={i}><span className="sub">{offList(c).length > 1 ? `Charge ${i + 1}:` : 'Charge:'}</span> {oo?.name} — {occLabel(x.occ)} occurrence · <span className="sub">proposed</span> <span className={'chip ' + penClass(x.rec)}>{x.rec}</span> {penFull(x.rec)}</div>
              ); })}
              <DueTag c={c} />
              {c.response && <div className="notice-quote">Your response: “{c.response}”</div>}
              {c.status === 'Closed' && <div><span className="sub">Decision:</span> <span className={'chip ' + penClass(c.decision || c.rec)}>{c.decision || c.rec}</span> — {c.outcome}</div>}
            </div>
            <div className="notice-actions">
              <span className={'pill ' + statusClass(c.status)}>{c.status}</span>
              {c.status === 'Awaiting Response' && <button className="btn btn-sm btn-navy" onClick={() => setActing({ c, action: { label: 'Submit response', to: 'Awaiting Decision' } })}>Respond (5 working days)</button>}
            </div>
          </Card>
        );
      }) : <Empty>No notices at this time.</Empty>}
      {acting && <ActionModal store={store} c={acting.c} action={acting.action} onClose={() => setActing(null)} />}
    </div>
  );
}

/* ═══════════ CEO ═══════════ */


/* ═══════ FULL CASE HISTORY — reusable by CEO and SMT ═══════ */
function CaseHistoryModal({ store, c, onClose }) {
  const { emps, offs, couns, logs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const pair = o ? rangeForOcc(o, c.occ) : null;
  const inv = c.investigation || {};
  const prior = (couns || []).filter(x => x.empId === c.empId);
  const trail = (logs || []).filter(l => l.caseId === c.id).slice().reverse();
  const isImg = t => t && t.startsWith('image/');

  const Sec = ({ n, title, children }) => (
    <div className="hist-sec">
      <div className="hist-head"><span className="hist-num">{n}</span><b>{title}</b></div>
      <div className="hist-body">{children}</div>
    </div>
  );
  const Row = ({ k, children }) => (
    <div className="hist-row"><span className="hist-k">{k}</span><span className="hist-v">{children}</span></div>
  );

  return (
    <Modal title={`Full case history — ${c.id}`} onClose={onClose}
      foot={<button className="btn btn-navy" onClick={onClose}>Close</button>}>

      <Sec n="1" title="Employee & charge">
        <Row k="Employee">{e?.name} — {e?.title}, {e?.dept}</Row>
        <Row k="Supervisor">{e?.sup}</Row>
        {caseOffences(c).map((x, i) => { const oo = offByN(x.off, offs); const pr = oo ? rangeForOcc(oo, x.occ) : null; return (
          <div key={i} className="hist-off">
            <div className="hist-off-head">{caseOffences(c).length > 1 ? `Offence ${i + 1}: ` : ''}{oo?.n}. {oo?.name}</div>
            <div className="sub">{oo?.cat} · {occLabel(x.occ)} occurrence · range <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(pr) }} />{x.rec ? <> · LM recommended <span className={'chip ' + penClass(x.rec)}>{x.rec}</span></> : null}{x.smtRec ? <> · SMT <span className={'chip ' + penClass(x.smtRec)}>{x.smtRec}</span></> : null}{x.decision ? <> · <b>Decision</b> <span className={'chip ' + penClass(x.decision)}>{x.decision}</span></> : null}</div>
            {oo?.note && <div className="penalty-note">⚠ {oo.note}</div>}
          </div>
        ); })}
      </Sec>

      <Sec n="2" title="Counselling before the case">
        {prior.length ? prior.map(x => (
          <div key={x.id} className="hist-item">
            <b className="mono">{x.id}</b> · {x.date} — {x.topic}
            {x.discussed && <div className="sub">Discussed: {x.discussed}</div>}
            <div className="sub">Outcome: {x.outcome}{x.escalatedTo ? ` → ${x.escalatedTo}` : ''}{x.by ? ` · by ${x.by}` : ''}</div>
          </div>
        )) : <div className="sub">No counselling recorded for this employee.</div>}
      </Sec>

      <Sec n="3" title="Case raised by the line manager">
        <Row k="Date raised">{c.raised || '—'}</Row>
        <Row k="LM recommended">{c.rec ? <><span className={'chip ' + penClass(c.rec)}>{c.rec}</span> {penFull(c.rec)}</> : '—'}</Row>
        {c.serious && <div className="penalty-note">⚠ Flagged as a serious offence — reported to HR immediately.</div>}
        {c.desc && <div className="hist-quote">{c.desc}</div>}
        {c.lmFiles?.length > 0 && <>
          <div className="hist-k">LM documents / evidence</div>
          <div className="file-list">
            {c.lmFiles.map((f, i) => (
              <div key={i} className="file-chip">
                {f.type && f.type.startsWith('image/') ? <img src={f.data} alt={f.name} className="file-thumb" /> : <span className="file-ico">📄</span>}
                <div className="file-meta"><a href={f.data} download={f.name} className="file-name">{f.name}</a><div className="sub">{(f.size/1024).toFixed(0)} KB</div></div>
              </div>
            ))}
          </div>
        </>}
      </Sec>

      <Sec n="4" title="HR investigation">
        {inv.findings || inv.lmDiscuss || inv.staffDiscuss || inv.witnesses?.length || inv.files?.length ? <>
          {inv.findings && <><div className="hist-k">Findings</div><div className="hist-quote">{inv.findings}</div></>}
          {inv.lmDiscuss && <><div className="hist-k">Discussion with line manager</div><div className="hist-quote">{inv.lmDiscuss}</div></>}
          {inv.staffDiscuss && <><div className="hist-k">Discussion with employee</div><div className="hist-quote">{inv.staffDiscuss}</div></>}
        </> : <div className="sub">No investigation recorded yet.</div>}
      </Sec>

      <Sec n="5" title={`Witness statements${inv.witnesses?.length ? ` (${inv.witnesses.length})` : ''}`}>
        {inv.witnesses?.length ? inv.witnesses.map((w, i) => (
          <div key={i} className="hist-item"><b>{w.name}</b>{w.note && <div className="hist-quote">{w.note}</div>}</div>
        )) : <div className="sub">No witnesses recorded.</div>}
      </Sec>

      <Sec n="6" title={`Evidence${inv.files?.length ? ` (${inv.files.length})` : ''}`}>
        {inv.files?.length ? (
          <div className="file-list">
            {inv.files.map((f, i) => (
              <div key={i} className="file-chip">
                {isImg(f.type) ? <img src={f.data} alt={f.name} className="file-thumb" /> : <span className="file-ico">📄</span>}
                <div className="file-meta"><a href={f.data} download={f.name} className="file-name">{f.name}</a><div className="sub">{(f.size/1024).toFixed(0)} KB</div></div>
              </div>
            ))}
          </div>
        ) : <div className="sub">No documents or images uploaded.</div>}
      </Sec>

      {c.jury?.active && (
        <Sec n="7" title="Jury of Peers">
          <Row k="Finding">{c.jury.finding || '—'}</Row>
          {c.jury.rec && <Row k="Recommends"><span className={'chip ' + penClass(c.jury.rec)}>{c.jury.rec}</span> {penFull(c.jury.rec)}</Row>}
          {c.jury.members?.length > 0 && <Row k="Panel">{c.jury.members.map(m => m.name + (m.dept ? ` (${m.dept})` : '')).join(', ')}</Row>}
          {c.jury.notes && <div className="hist-quote">{c.jury.notes}</div>}
        </Sec>
      )}

      <Sec n={c.jury?.active ? '8' : '7'} title="Escalation & recommendations">
        <Row k="Route">{c.smtRec ? `HR → SMT → CEO${c.smtMember ? ` (${c.smtMember})` : ''}` : c.referredBy === 'HR' ? 'HR → CEO (direct)' : 'Handled at HR level'}</Row>
        {c.hrNote && <><div className="hist-k">HR note / recommendation</div><div className="hist-quote">{c.hrNote}</div></>}
        {c.hrRec && <Row k="HR recommends"><span className={'chip ' + penClass(c.hrRec)}>{c.hrRec}</span> {penFull(c.hrRec)}</Row>}
        {c.smtRec && <>
          <Row k="SMT recommends"><span className={'chip ' + penClass(c.smtRec)}>{c.smtRec}</span> {penFull(c.smtRec)}</Row>
          {c.smtRationale && <div className="hist-quote">{c.smtRationale}</div>}
        </>}
        {!c.hrNote && !c.smtRec && !c.hrRec && <div className="sub">No escalation recorded.</div>}
      </Sec>

      <Sec n={c.jury?.active ? '9' : '8'} title="Employee response & decision">
        {c.noResponse ? <div className="penalty-note">No response received within 5 working days — HR proceeded to decision.</div> : c.response ? <><div className="hist-k">Employee response</div><div className="hist-quote">{c.response}</div></> : <div className="sub">No response recorded.</div>}
        {c.decision && <Row k="Final decision"><span className={'chip ' + penClass(c.decision)}>{c.decision}</span> {penFull(c.decision)}{c.outcome ? ` — ${c.outcome}` : ''}</Row>}
        {windowMonths(c.decision || c.rec) > 0 && c.status === 'Closed' && <Row k="Active window">{activeWarning(c) ? <>Active until <b>{fmtDate(caseExpiry(c))}</b> ({windowMonths(c.decision || c.rec)} months) — counts toward occurrence</> : <>Expired — record wiped clean ({windowMonths(c.decision || c.rec)}-month window passed)</>}</Row>}
        {c.appeal && <><div className="hist-k">Appeal grounds</div><div className="hist-quote">{c.appeal}</div></>}
        <Row k="Current status"><span className={'pill ' + statusClass(c.status)}>{c.status}</span></Row>
      </Sec>

      {trail.length > 0 && (
        <Sec n={c.jury?.active ? '10' : '9'} title="Audit trail">
          {trail.map(l => (
            <div key={l.id} className="hist-item sub">
              {new Date(l.ts).toLocaleString('en-GB')} · <b>{(ROLES[l.role]||{}).name || l.role}</b> — {l.action}
            </div>
          ))}
        </Sec>
      )}
    </Modal>
  );
}

function CEOReferrals({ store }) {
  const { cases, emps, offs } = store;
  const refs = cases.filter(c => c.status === 'With CEO');
  const [deciding, setDeciding] = useState(null);
  const [history, setHistory] = useState(null);
  return (
    <div className="page">
      <PageHead title="Referrals — CEO Decision" info="Cases forwarded by HR or the SMT. You make the final decision, within the offence range." sub="Cases forwarded by HR, or recommended by the SMT" />
      <GuideBanner view="ceo-referrals" />
      {refs.length ? refs.map(c => {
        const e = empById(c.empId, emps), o = offByN(c.off, offs);
        const pair = o ? rangeForOcc(o, c.occ) : null;
        return (
          <Card key={c.id} title={`${c.id} · ${e?.name}`} sub={offList(c).length > 1 ? offList(c).map(x => offByN(+x.off, offs)?.name).join(' · ') : o?.name}>
            <div className="notice-body">
              <div><span className="sub">Occurrence:</span> {occLabel(c.occ)} — range <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(pair) }} /></div>
              <div><span className="sub">Route:</span> {c.smtRec ? `HR → SMT → CEO${c.smtMember ? ` (${c.smtMember})` : ''}` : 'HR → CEO (direct)'}</div>
              {c.hrRec && <div><span className="sub">HR recommends:</span> <span className={'chip ' + penClass(c.hrRec)}>{c.hrRec}</span> {penFull(c.hrRec)}</div>}
              {c.hrNote && <div className="notice-quote">HR rationale: “{c.hrNote}”</div>}
              {c.investigation?.findings && <div><span className="sub">Investigation:</span> {c.investigation.findings}</div>}
              {c.jury?.active && <div><span className="sub">Jury of Peers:</span> {c.jury.finding || 'convened'}{c.jury.rec ? ` — recommends ${c.jury.rec}` : ''}{c.jury.members?.length ? ` (${c.jury.members.length} members)` : ''}</div>}
            </div>
            {c.smtRec && (
              <div className="smt-rec">
                <div className="inv-title">SMT recommendation</div>
                <div><span className={'chip ' + penClass(c.smtRec)}>{c.smtRec}</span> {penFull(c.smtRec)}</div>
                {c.smtRationale && <div className="sub" style={{ marginTop: 4 }}>{c.smtRationale}</div>}
              </div>
            )}
            <div className="notice-actions">
              <span className="pill st-ceo">With CEO</span>
              <TipBtn tip="Open the full case record: counselling, investigation, witnesses, evidence, recommendations and audit trail." className="btn btn-sm btn-ghost" dt="view-hist" onClick={() => setHistory(c)}>View full case history</TipBtn>
              <TipBtn tip="Record the CEO\u2019s final action, within the offence range. Closes the case." className="btn btn-sm btn-navy" dt="ceo-decide" onClick={() => setDeciding(c)}>Make final decision</TipBtn>
            </div>
          </Card>
        );
      }) : <Empty>No cases awaiting a CEO decision.</Empty>}
      {deciding && <CEODecisionModal store={store} c={deciding} onClose={() => setDeciding(null)} />}
      {history && <CaseHistoryModal store={store} c={history} onClose={() => setHistory(null)} />}
    </div>
  );
}

function CEODecisionModal({ store, c, onClose }) {
  const { offs, emps } = store;
  const e = empById(c.empId, emps);
  const list = offList(c);
  const [vals, setVals] = useState(list.map(x => x.smtRec || (list.length === 1 ? c.smtRec : '') || x.rec || ''));
  const [note, setNote] = useState('');
  function go() {
    if (vals.some(v => !v)) { alert('Select the final action for every offence.'); return; }
    const newOffs = list.map((x, i) => ({ ...x, decision: vals[i] }));
    const followed = list.every((x, i) => (x.smtRec || c.smtRec) === vals[i]);
    store.ceoDecideReferral(c.id, worstCode(vals), note || (c.smtRec && followed ? 'Followed SMT recommendation' : 'Decided by CEO'), newOffs);
    onClose();
  }
  return (
    <Modal title={`CEO decision — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Record the CEO\u2019s final action within the offence range. Closes the case." className="btn btn-navy" onClick={go}>Record final decision</TipBtn></>}>
      <div className="penalty-title" style={{ marginBottom: 6 }}>{e?.name}</div>
      <OffenceRanges c={c} offs={offs} />
      {c.hrRec && <div className="inv-recap"><div className="inv-title">HR recommended</div><div><span className={'chip ' + penClass(c.hrRec)}>{c.hrRec}</span> {penFull(c.hrRec)}</div>{c.hrNote && <div className="sub" style={{marginTop:4}}>{c.hrNote}</div>}</div>}
      {c.smtRec && <div className="smt-rec"><div className="inv-title">SMT recommended</div><div><span className={'chip ' + penClass(c.smtRec)}>{c.smtRec}</span> {penFull(c.smtRec)}</div>{c.smtRationale && <div className="sub" style={{marginTop:4}}>{c.smtRationale}</div>}</div>}
      <PerOffencePicker c={c} offs={offs} values={vals} setValues={setVals} label="Final action for each offence" hintKey="smtRec" />
      <Field label="Note (optional)"><textarea className="input" rows={2} value={note} onChange={ev => setNote(ev.target.value)} /></Field>
    </Modal>
  );
}


function CEOReinstate({ store }) {
  const { cases, emps, offs } = store;
  // dismissed = closed cases whose final action is Dismissal
  const dismissed = cases.filter(c => c.status === 'Closed' && (c.decision || c.rec) === 'D');
  const [acting, setActing] = useState(null);
  return (
    <div className="page">
      <PageHead title="Re-instatement" info="Re-establish a previously dismissed employee back into payroll, with a reason and date." sub="Re-establish a previously terminated employee into the payroll system" />
      <GuideBanner view="ceo-reinstate" />
      {dismissed.length ? dismissed.map(c => {
        const e = empById(c.empId, emps), o = offByN(c.off, offs);
        return (
          <Card key={c.id} title={`${c.id} · ${e?.name}`} sub={offList(c).length > 1 ? offList(c).map(x => offByN(+x.off, offs)?.name).join(' · ') : o?.name}>
            <div className="notice-body">
              <div><span className="sub">Dismissed for:</span> {o?.name} — {occLabel(c.occ)} occurrence</div>
              {c.outcome && <div className="sub">{c.outcome}</div>}
              {c.reinstated && <div className="reinstate-note">♻ Re-established to payroll on {fmtDate(c.reinstateDate)}{c.reinstateReason ? ` — ${c.reinstateReason}` : ''}</div>}
            </div>
            <div className="notice-actions">
              {c.reinstated
                ? <span className="pill st-closed">Re-instated</span>
                : <><span className="pill pen-D" style={{padding:'4px 11px'}}>Dismissed</span>
                   <TipBtn tip="Reverse a dismissal and restore the employee to payroll, with a reason and effective date." className="btn btn-sm btn-navy" onClick={() => setActing(c)}>Re-establish to payroll</TipBtn></>}
            </div>
          </Card>
        );
      }) : <Empty>No dismissed employees to re-instate.</Empty>}
      {acting && <ReinstateModal store={store} c={acting} onClose={() => setActing(null)} />}
    </div>
  );
}

function ReinstateModal({ store, c, onClose }) {
  const { emps, offs } = store;
  const e = empById(c.empId, emps), o = offByN(c.off, offs);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('2026-06-21');
  function go() {
    if (!reason.trim()) { alert('Please give a reason for re-instatement.'); return; }
    store.reinstateEmployee(c.id, reason.trim(), date);
    onClose();
  }
  return (
    <Modal title={`Re-establish ${e?.name} to payroll`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Reverse the dismissal and restore the employee to payroll on the effective date." className="btn btn-navy" onClick={go}>Confirm re-instatement</TipBtn></>}>
      <div className="penalty-box">
        <div className="penalty-title">{e?.name} — {e?.title}</div>
        <div className="sub">This reverses the dismissal from case {c.id} ({o?.name}) and restores the employee into the payroll system. This action is recorded in the audit log.</div>
      </div>
      <Field label="Reason for re-instatement">
        <textarea className="input" rows={3} value={reason} onChange={ev => setReason(ev.target.value)} placeholder="e.g. successful appeal, new evidence, compassionate grounds…" />
      </Field>
      <Field label="Effective date"><input type="date" className="input" value={date} onChange={ev => setDate(ev.target.value)} /></Field>
      <p className="hint">Only the CEO can re-establish a terminated employee. Payroll and HR should be notified to restore records.</p>
    </Modal>
  );
}



/* ═══════════ EXECUTIVE MEMBER ═══════════ */
function useExec(execId, emps) {
  const exec = EXECUTIVES.find(x => x.id === execId) || EXECUTIVES[0];
  const inPortfolio = emps.filter(e => exec.depts.includes(e.dept));
  return { exec, inPortfolio };
}

function ExecPortfolio({ store, execId }) {
  const { emps, cases } = store;
  const { exec, inPortfolio } = useExec(execId, emps);
  // group by department
  const byDept = exec.depts.map(d => ({
    dept: d,
    staff: inPortfolio.filter(e => e.dept === d),
  })).filter(g => g.staff.length);
  const openFor = id => cases.filter(c => c.empId === id && c.status !== 'Closed').length;

  return (
    <div className="page">
      <PageHead title="My Portfolio" info="The staff in your portfolio, grouped by department, with open-case counts." sub={`${exec.name} · ${exec.title}`} />
      <GuideBanner view="exec-portfolio" />
      <div className="stat-grid">
        <Stat n={inPortfolio.length} label="Staff in portfolio" color="#134E4A" />
        <Stat n={exec.depts.length} label="Departments" color="#1E40AF" />
        <Stat n={cases.filter(c => inPortfolio.some(e => e.id === c.empId)).length} label="Total cases" color="#B45309" />
        <Stat n={cases.filter(c => inPortfolio.some(e => e.id === c.empId) && c.status !== 'Closed').length} label="Open cases" color="#991B1B" />
      </div>
      <div className="portfolio-note">Structure: Staff → Line Manager → Executive Member (you). You see the disciplinary standing of everyone below.</div>
      {byDept.map(g => (
        <Card key={g.dept} title={g.dept} sub={`${g.staff.length} staff`}>
          <table className="table">
            <thead><tr><th>Name</th><th>Title</th><th>Supervisor</th><th>Open cases</th></tr></thead>
            <tbody>
              {g.staff.map(e => {
                const n = openFor(e.id);
                return (
                  <tr key={e.id}>
                    <td><b>{e.name}</b></td>
                    <td>{e.title}</td>
                    <td>{e.sup}</td>
                    <td>{n > 0 ? <span className="pill st-hr">{n} open</span> : <span className="sub">Clear</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}


function ExecAppraisals({ store, execId }) {
  const { emps } = store;
  const { exec, inPortfolio } = useExec(execId, emps);
  const [quarter, setQuarter] = useState('Q2');
  const rows = inPortfolio.map(e => ({ e, status: appraisalStatus(e.id, quarter) }));
  const count = s => rows.filter(r => r.status === s).length;
  const done = count('CEO Approved');
  const pending = rows.length - done;

  return (
    <div className="page">
      <PageHead title="Portfolio Appraisals" info="Appraisal status of your portfolio staff by quarter. Read-only oversight." sub={`${quarter} 2026 · appraisal status across ${exec.title}`}
        right={
          <select className="input" style={{ maxWidth: 140 }} value={quarter} onChange={e => setQuarter(e.target.value)}>
            <option value="Q1">Q1 2026</option><option value="Q2">Q2 2026</option>
          </select>
        } />
      <GuideBanner view="exec-appraisals" />
      <div className="stat-grid">
        <Stat n={rows.length} label="Staff in portfolio" color="#134E4A" />
        <Stat n={done} label="CEO Approved" color="#059669" />
        <Stat n={count('With HR') + count('Submitted to CEO')} label="In progress" color="#B45309" />
        <Stat n={count('Pending')} label="Pending" color="#991B1B" />
      </div>
      <Card title={`Appraisal status — ${quarter} 2026`} sub="Every employee in your portfolio">
        <table className="table">
          <thead><tr><th>Name</th><th>Title</th><th>Department</th><th>Supervisor</th><th>Appraisal status</th></tr></thead>
          <tbody>
            {rows.map(({ e, status }) => (
              <tr key={e.id}>
                <td><b>{e.name}</b></td>
                <td>{e.title}</td>
                <td>{e.dept}</td>
                <td>{e.sup}</td>
                <td><span className={'pill ' + apprStatusClass(status)}>{status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {pending > 0 && <div className="portfolio-note" style={{ background: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}>
        {pending} staff member{pending > 1 ? 's' : ''} in your portfolio {pending > 1 ? 'do not' : 'does not'} yet have a CEO-approved appraisal for {quarter} 2026.
      </div>}
    </div>
  );
}

function ExecDiscipline({ store, execId }) {
  const { emps, cases, offs } = store;
  const { exec, inPortfolio } = useExec(execId, emps);
  const ids = new Set(inPortfolio.map(e => e.id));
  const [sf, setSf] = useState('');
  const mine = cases.filter(c => ids.has(c.empId) && (!sf || c.status === sf));
  const statuses = [...new Set(cases.filter(c => ids.has(c.empId)).map(c => c.status))];

  return (
    <div className="page">
      <PageHead title="Portfolio Discipline" info="Every disciplinary case for your portfolio staff. Read-only oversight." sub={`Disciplinary standing across ${exec.title} — oversight only`} />
      <GuideBanner view="exec-discipline" />
      <div className="stat-grid">
        <Stat n={mine.filter(c => c.status !== 'Closed').length} label="Open" color="#1E40AF" />
        <Stat n={mine.filter(c => c.status === 'Closed').length} label="Closed" color="#059669" />
        <Stat n={mine.filter(c => (c.decision || c.rec) === 'D').length} label="Dismissals" color="#991B1B" />
      </div>
      <div className="filters">
        <select className="input" value={sf} onChange={e => setSf(e.target.value)}>
          <option value="">All statuses</option>{statuses.map(x => <option key={x}>{x}</option>)}
        </select>
      </div>
      <Card>
        {mine.length ? (
          <table className="table">
            <thead><tr><th>Case</th><th>Employee</th><th>Dept</th><th>Offence</th><th>Occ.</th><th>Action</th><th>Status</th></tr></thead>
            <tbody>
              {mine.map(c => {
                const e = empById(c.empId, emps), o = offByN(c.off, offs);
                return (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td><b>{e?.name}</b><div className="sub">{e?.title}</div></td>
                    <td>{e?.dept}</td>
                    <td><OffenceCell c={c} offs={offs} /></td>
                    <td>{caseOffences(c).map(x=>occLabel(x.occ)).join(", ")}</td>
                    <td><span className={'chip ' + penClass(c.decision || c.rec)}>{c.decision || c.rec}</span></td>
                    <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span>{c.outcome && <div className="sub">{c.outcome}</div>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>No disciplinary cases in your portfolio.</Empty>}
      </Card>
    </div>
  );
}


/* ═══════════ SENIOR MANAGEMENT TEAM (SMT) ═══════════ */
function SMTQueue({ store }) {
  const { cases, emps, offs } = store;
  const queue = cases.filter(c => c.status === 'With SMT');
  const [reccing, setReccing] = useState(null);
  const [history, setHistory] = useState(null);
  return (
    <div className="page">
      <PageHead title="SMT Referrals" info="Cases HR forwarded to you for a recommendation to the CEO. A recommendation is mandatory." sub="Cases forwarded by HR for a recommendation to the CEO" />
      <GuideBanner view="smt-queue" />
      {queue.length ? queue.map(c => {
        const e = empById(c.empId, emps), o = offByN(c.off, offs);
        const pair = o ? rangeForOcc(o, c.occ) : null;
        return (
          <Card key={c.id} title={`${c.id} · ${e?.name}`} sub={offList(c).length > 1 ? offList(c).map(x => offByN(+x.off, offs)?.name).join(' · ') : o?.name}>
            <div className="notice-body">
              <div><span className="sub">Occurrence:</span> {occLabel(c.occ)} — range <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(pair) }} /></div>
              {c.smtMember && <div><span className="sub">Assigned to:</span> {c.smtMember}</div>}
              {c.hrRec && <div><span className="sub">HR recommends:</span> <span className={'chip ' + penClass(c.hrRec)}>{c.hrRec}</span> {penFull(c.hrRec)}</div>}
              {c.hrNote && <div className="notice-quote">HR rationale: “{c.hrNote}”</div>}
              {c.investigation?.findings && <div><span className="sub">Investigation:</span> {c.investigation.findings}</div>}
              {c.investigation?.witnesses?.length > 0 && <div className="sub">Witnesses: {c.investigation.witnesses.map(w => w.name).join(', ')}</div>}
              {c.investigation?.files?.length > 0 && <div className="sub">{c.investigation.files.length} evidence file(s)</div>}
              {c.jury?.active && <div className="sub"><b>Jury of Peers:</b> {c.jury.finding || 'convened'}{c.jury.rec ? ` — recommends ${c.jury.rec}` : ''}</div>}
            </div>
            <div className="notice-actions">
              <span className="pill st-smt">With SMT</span>
              <TipBtn tip="Open the full case record: counselling, investigation, witnesses, evidence, recommendations and audit trail." className="btn btn-sm btn-ghost" dt="view-hist" onClick={() => setHistory(c)}>View full case history</TipBtn>
              <TipBtn tip="Record the SMT\u2019s recommended action and rationale (required) and send to the CEO." className="btn btn-sm btn-navy" dt="smt-rec" onClick={() => setReccing(c)}>Recommend to CEO</TipBtn>
            </div>
          </Card>
        );
      }) : <Empty>No cases referred to the SMT.</Empty>}
      {reccing && <SMTRecommendModal store={store} c={reccing} onClose={() => setReccing(null)} />}
      {history && <CaseHistoryModal store={store} c={history} onClose={() => setHistory(null)} />}
    </div>
  );
}

function SMTRecommendModal({ store, c, onClose }) {
  const { offs, emps } = store;
  const e = empById(c.empId, emps);
  const list = offList(c);
  const [vals, setVals] = useState(list.map(() => ''));
  const [rationale, setRationale] = useState('');
  function go() {
    if (vals.some(v => !v)) { alert('Select a recommended action for every offence — a recommendation to the CEO is required.'); return; }
    if (!rationale.trim()) { alert('Enter the rationale for the SMT recommendation.'); return; }
    const newOffs = list.map((x, i) => ({ ...x, smtRec: vals[i] }));
    store.smtRecommend(c.id, worstCode(vals), rationale, newOffs);
    onClose();
  }
  return (
    <Modal title={`SMT recommendation — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><TipBtn tip="Send the SMT\u2019s recommendation and rationale to the CEO." className="btn btn-navy" onClick={go}>Send recommendation to CEO</TipBtn></>}>
      <div className="penalty-title" style={{ marginBottom: 6 }}>{e?.name}</div>
      <OffenceRanges c={c} offs={offs} />
      {c.hrRec && (
        <div className="inv-recap">
          <div className="inv-title">HR recommended</div>
          <div><span className={'chip ' + penClass(c.hrRec)}>{c.hrRec}</span> {penFull(c.hrRec)}</div>
          {c.hrNote && <div className="sub" style={{ marginTop: 4 }}>{c.hrNote}</div>}
        </div>
      )}
      <PerOffencePicker c={c} offs={offs} values={vals} setValues={setVals} label="Recommended action for each offence (required)" required />
      <Field label="Rationale (required)"><textarea className="input" rows={3} value={rationale} onChange={ev => setRationale(ev.target.value)} placeholder="Why the SMT recommends this action…" /></Field>
      <p className="hint">A recommendation and rationale are required. This is advisory only — the CEO makes the final decision.</p>
    </Modal>
  );
}

function SMTDecided({ store }) {
  const { cases, emps, offs } = store;
  const rows = cases.filter(c => c.smtRec);
  return (
    <div className="page">
      <PageHead title="Recommended" info="Cases the SMT has recommended on and sent to the CEO, with the CEO\u2019s final decision." sub="Cases the SMT has recommended on and sent to the CEO" />
      <GuideBanner view="smt-decided" />
      <Card>
        {rows.length ? (
          <table className="table">
            <thead><tr><th>Case</th><th>Employee</th><th>Offence</th><th>SMT recommended</th><th>CEO decision</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(c => {
                const e = empById(c.empId, emps), o = offByN(c.off, offs);
                return (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td><b>{e?.name}</b></td>
                    <td><OffenceCell c={c} offs={offs} /></td>
                    <td><span className={'chip ' + penClass(c.smtRec)}>{c.smtRec}</span> {penFull(c.smtRec)}</td>
                    <td>{c.status === 'Closed' ? <><span className={'chip ' + penClass(c.decision)}>{c.decision}</span> {c.outcome}</> : <span className="sub">Awaiting CEO</span>}</td>
                    <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Empty>No SMT recommendations yet.</Empty>}
      </Card>
    </div>
  );
}

/* ═══════════ SHARED ACTION MODAL ═══════════ */
/* Shows every offence on a case with its own occurrence + penalty range */
function OffenceRanges({ c, offs }) {
  const list = offList(c);
  return (
    <div className="penalty-box">
      {list.map((x, i) => { const oo = offByN(+x.off, offs); const pr = oo ? rangeForOcc(oo, x.occ) : null; return (
        <div key={i} style={{ marginBottom: i < list.length - 1 ? 8 : 0 }}>
          <div className="penalty-range"><span className="sub">{list.length > 1 ? `Offence ${i + 1}: ` : ''}{oo?.name} — {occLabel(x.occ)} occurrence — range:</span> <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(pr) }} /></div>
          {oo?.note && <div className="penalty-note">⚠ {oo.note}</div>}
        </div>
      ); })}
    </div>
  );
}
/* One action picker per offence, each limited to that offence's range */
function PerOffencePicker({ c, offs, values, setValues, label, hintKey, required }) {
  const list = offList(c);
  return (
    <div className="inv-section">
      <div className="inv-title">{label} <InfoTip text="Each offence is decided on its own, within its own penalty range. The overall outcome is the most serious of them." /></div>
      {list.map((x, i) => { const oo = offByN(+x.off, offs); const pr = oo ? rangeForOcc(oo, x.occ) : null; const opts = optionsInRange(pr);
        const hint = hintKey && (x[hintKey] || (hintKey === 'smtRec' ? c.smtRec : null));
        return (
          <Field key={i} label={`${list.length > 1 ? (i + 1) + '. ' : ''}${oo?.name || ''} (${occLabel(x.occ)})`}>
            <select className="input" value={values[i] || ''} onChange={ev => { const v = [...values]; v[i] = ev.target.value; setValues(v); }}>
              {required && <option value="">— Select action —</option>}
              {opts.map(o2 => <option key={o2} value={o2}>{o2} — {penFull(o2)}</option>)}
            </select>
            {hint && <span className="sub">Recommended: {hint} — {penFull(hint)}</span>}
          </Field>
        ); })}
      {list.length > 1 && values.every(Boolean) && <div className="sub">Overall outcome: <b>{worstCode(values)} — {penFull(worstCode(values))}</b></div>}
    </div>
  );
}
function DueTag({ c }) {
  if (c.status !== 'Awaiting Response' || !c.noticeDate) return null;
  const d = responseDue(c.noticeDate);
  if (d === null) return null;
  return d >= 0
    ? <div className="sub" style={{ marginTop: 4 }}>⏳ {d} working day{d === 1 ? '' : 's'} left to respond</div>
    : <div className="sub" style={{ marginTop: 4, color: '#B42318', fontWeight: 700 }}>⚠ Response overdue by {-d} working day{d === -1 ? '' : 's'}</div>;
}

function ActionModal({ store, c, action, onClose }) {
  const { offs } = store;
  const [vals, setVals] = useState(offList(c).map(x => x.decision || x.smtRec || x.rec || ''));
  const [text, setText] = useState(action.noResponse ? 'No response received within 5 working days.' : '');
  const [date, setDate] = useState('2026-06-21');

  function go() {
    switch (action.to) {
      case 'Awaiting Response': store.issueNotice(c.id, date); break;
      case 'Awaiting Decision': store.recordResponse(c.id, text, !!action.noResponse); break;
      case 'Closed': {
        if (vals.some(v => !v)) { alert('Select a final action for every offence.'); return; }
        const newOffs = offList(c).map((x, i) => ({ ...x, decision: vals[i] }));
        store.recordDecision(c.id, worstCode(vals), text || 'Upheld', newOffs);
        break;
      }
      default: break;
    }
    onClose();
  }
  const needsDecision = action.to === 'Closed';
  const needsText = ['Awaiting Decision', 'Closed'].includes(action.to);
  const needsDate = ['Awaiting Response'].includes(action.to);
  const textLabel = action.noResponse ? 'Note for the record' : action.to === 'Awaiting Decision' ? 'Your response'
    : 'Outcome note (optional)';
  return (
    <Modal title={`${action.label} — ${c.id}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={go}>{action.label}</button></>}>
      <OffenceRanges c={c} offs={offs} />
      {c.status === 'Awaiting Decision' && (c.noResponse
        ? <div className="penalty-note">No response was received within 5 working days.</div>
        : c.response && <div className="notice-quote">Employee response: “{c.response}”</div>)}
      {c.investigation && (
        <div className="inv-recap">
          <div className="inv-title">Investigation on file</div>
          {c.investigation.findings && <div className="sub" style={{marginBottom:4}}>{c.investigation.findings}</div>}
          {c.investigation.witnesses?.length > 0 && <div className="sub">Witnesses: {c.investigation.witnesses.map(w=>w.name).join(', ')}</div>}
          {c.investigation.files?.length > 0 && <div className="sub">{c.investigation.files.length} evidence file(s) attached</div>}
        </div>
      )}
      {c.jury?.active && (
        <div className="jury-recap">
          <div className="inv-title">Jury of Peers</div>
          {c.jury.finding && <div className="sub"><b>Finding:</b> {c.jury.finding}</div>}
          {c.jury.rec && <div className="sub"><b>Recommends:</b> {c.jury.rec} — {penFull(c.jury.rec)}</div>}
          {c.jury.members?.length > 0 && <div className="sub">Panel: {c.jury.members.map(m=>m.name).join(', ')}</div>}
        </div>
      )}
      {needsDecision && <PerOffencePicker c={c} offs={offs} values={vals} setValues={setVals} label="Final action for each offence" />}
      {needsDate && <Field label={'Notice date'}><input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} /></Field>}
      {needsText && <Field label={textLabel}><textarea className="input" rows={3} value={text} onChange={e => setText(e.target.value)} /></Field>}
      {action.to === 'Awaiting Response' && <p className="hint">Issuing the notice starts the 5 working-day response window.</p>}
    </Modal>
  );
}

/* ═══════════ TABLE OF CHARGES (editable for ICT/HR) ═══════════ */
function Charges({ store, role }) {
  const { offs } = store;
  const editable = role === 'ict' || role === 'hr';
  const [q, setQ] = useState(''); const [cf, setCf] = useState('');
  const [editing, setEditing] = useState(null); const [adding, setAdding] = useState(false); const [addingCat, setAddingCat] = useState(false);
  const [page, setPage] = useState(1);
  const PER = 10;
  const rows = offs.filter(o => {
    if (q && o.name.toLowerCase().indexOf(q.toLowerCase()) < 0 && ('' + o.n) !== q) return false;
    if (cf && o.cat !== cf) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const cur = Math.min(page, pages);
  const pageRows = rows.slice((cur - 1) * PER, cur * PER);
  return (
    <div className="page">
      <PageHead title="Table of Charges" info="Every recognised offence and its penalty (verbal warning, written warning, suspension, dismissal) by occurrence." sub="Recognised offences and penalty ranges by occurrence"
        right={editable && <>
          <TipBtn tip="Add a new offence category (e.g. a new group of offences)." className="btn btn-ghost" onClick={() => setAddingCat(true)}>+ Add category</TipBtn>
          <TipBtn tip="Add a new offence and its penalty ranges." className="btn btn-navy" onClick={() => setAdding(true)}>+ Add offence</TipBtn>
        </>} />
      <GuideBanner view="charges" />
      <div className="filters">
        <input className="input" placeholder="Search offence or number…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        <select className="input" value={cf} onChange={e => { setCf(e.target.value); setPage(1); }}><option value="">All categories</option>{store.cats.map(c => <option key={c}>{c}</option>)}</select>
      </div>
      <Card>
        <table className="table">
          <thead><tr><th>#</th><th>Category</th><th>Offence</th><th>1st</th><th>2nd</th><th>3rd+</th>{editable && <th>Manage</th>}</tr></thead>
          <tbody>
            {pageRows.map(o => (
              <tr key={o.n}>
                <td className="mono">{o.n}</td>
                <td><span dangerouslySetInnerHTML={{ __html: CAT_ICON[o.cat] || '' }} /> {o.cat}</td>
                <td>{o.name}{o.note && <div className="penalty-note">⚠ {o.note}</div>}</td>
                {[0, 1, 2].map(i => { const pair = o.p[i] || o.p[o.p.length - 1]; return <td key={i} dangerouslySetInnerHTML={{ __html: rangeChips(pair) }} />; })}
                {editable && <td className="row-actions">
                  <TipBtn tip="Edit this record." className="btn btn-sm btn-ghost" onClick={() => setEditing(o)}>Edit</TipBtn>
                  <button className="btn btn-sm btn-danger" onClick={() => { const used = store.cases.filter(cc => offList(cc).some(x => +x.off === +o.n)).length; if (used) { alert(`Offence #${o.n} is used in ${used} case(s) and cannot be deleted. Edit it instead.`); return; } if (confirm(`Delete offence #${o.n}?`)) store.deleteOff(o.n); }}>Delete</button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {pages > 1 && (
        <div className="pager">
          <button className="btn btn-sm btn-ghost" disabled={cur === 1} onClick={() => setPage(cur - 1)}>← Prev</button>
          <span className="pager-info">Page {cur} of {pages} · {rows.length} offences</span>
          <button className="btn btn-sm btn-ghost" disabled={cur === pages} onClick={() => setPage(cur + 1)}>Next →</button>
        </div>
      )}
      {(editing || adding) && <OffenceModal store={store} off={editing} onClose={() => { setEditing(null); setAdding(false); }} />}
      {addingCat && <CategoryModal store={store} onClose={() => setAddingCat(false)} />}
    </div>
  );
}
function CategoryModal({ store, onClose }) {
  const [name, setName] = useState('');
  function save() {
    if (!name.trim()) { alert('Enter a category name.'); return; }
    store.addCat(name.trim());
    onClose();
  }
  return (
    <Modal title="Add offence category" onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={save}>Add category</button></>}>
      <Field label="Category name"><input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Environmental" /></Field>
      <p className="hint">The new category becomes available when adding or editing an offence, and in the category filter.</p>
    </Modal>
  );
}
const PEN_SHORT = { A: 'Verbal', R: 'Written', S3: '3 days', S10: '10 days', S20: '20 days', D: 'Dismiss' };
function OffenceModal({ store, off, onClose }) {
  const isNew = !off;
  const [name, setName] = useState(off?.name || '');
  const [cat, setCat] = useState(off?.cat || store.cats[0]);
  const [note, setNote] = useState(off?.note || '');
  const init = [0, 1, 2].map(i => { const pr = off?.p?.[i] || off?.p?.[off?.p?.length - 1]; return pr ? [pr[0], pr[1]] : [['A', 'R'], ['R', 'S3'], ['S10', 'D']][i]; });
  const [ranges, setRanges] = useState(init);
  const setR = (i, j, v) => setRanges(rs => rs.map((r2, k) => {
    if (k !== i) return r2;
    const n = [...r2]; n[j] = v;
    // keep From ≤ To
    if (PEN_ORDER.indexOf(n[0]) > PEN_ORDER.indexOf(n[1])) { if (j === 0) n[1] = n[0]; else n[0] = n[1]; }
    return n;
  }));
  function save() {
    if (!name.trim()) { alert('Enter the offence description.'); return; }
    const patch = { name: name.trim(), cat, p: ranges.map(r2 => [r2[0], r2[1]]), note: note.trim() || undefined };
    if (isNew) store.addOff(patch); else store.updateOff(off.n, patch);
    onClose();
  }
  const occ = ['1st occurrence', '2nd occurrence', '3rd + occurrence'];
  return (
    <Modal title={isNew ? 'Add offence' : `Edit offence #${off.n}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={save}>{isNew ? 'Add' : 'Save'}</button></>}>
      <Field label="Offence description"><textarea className="input" rows={2} value={name} onChange={e => setName(e.target.value)} /></Field>
      <Field label="Category"><select className="input" value={cat} onChange={e => setCat(e.target.value)}>{store.cats.map(c => <option key={c}>{c}</option>)}</select></Field>
      <div className="inv-section">
        <div className="inv-title">Penalty ranges <InfoTip text="For each occurrence choose the lightest (From) and heaviest (To) penalty allowed. Pick the same code in both for a fixed penalty. From can’t be heavier than To." /></div>
        {ranges.map((r2, i) => (
          <div key={i} className="range-row">
            <span className="range-lbl">{occ[i]}</span>
            <select className="input" aria-label="From" value={r2[0]} onChange={e => setR(i, 0, e.target.value)}>{PEN_ORDER.map(x => <option key={x} value={x}>{x} · {PEN_SHORT[x]}</option>)}</select>
            <span className="sub">to</span>
            <select className="input" aria-label="To" value={r2[1]} onChange={e => setR(i, 1, e.target.value)}>{PEN_ORDER.map(x => <option key={x} value={x} disabled={PEN_ORDER.indexOf(x) < PEN_ORDER.indexOf(r2[0])}>{x} · {PEN_SHORT[x]}</option>)}</select>
            <span className="pmatrix" dangerouslySetInnerHTML={{ __html: rangeChips(r2) }} />
          </div>
        ))}
        <p className="hint">A = verbal warning · R = written warning · S3/S10/S20 = suspension days · D = dismissal.</p>
      </div>
      <Field label="Special note (optional)"><input className="input" value={note} onChange={e => setNote(e.target.value)} /></Field>
    </Modal>
  );
}

/* ═══════════ ICT SETTINGS — property checklist items ═══════════ */
function ICTSettings({ store }) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');
  const items = store.propItems || [];
  function add() {
    const n = name.trim(); if (!n) return;
    if (items.some(x => x.toLowerCase() === n.toLowerCase())) { alert('That item is already in the list.'); return; }
    store.addPropItem(n); setName('');
  }
  return (
    <div className="page">
      <PageHead title="Settings" info="System lists that ICT Admin maintains. Changes apply straight away and are recorded in the Audit Log." sub="Company property checklist used on dismissal" />
      <Card title="Property items" sub={`${items.length} items — the Line Manager ticks these off when a dismissed employee returns company property`}>
        <table className="table">
          <thead><tr><th>#</th><th>Item</th><th></th></tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it}>
                <td className="mono">{i + 1}</td>
                <td>{editing === it
                  ? <input className="input" value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { store.renamePropItem(it, editVal); setEditing(null); } }} autoFocus />
                  : it}</td>
                <td className="row-actions">
                  {editing === it
                    ? <><button className="btn btn-sm btn-navy" onClick={() => { if (editVal.trim()) store.renamePropItem(it, editVal); setEditing(null); }}>Save</button><button className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>Cancel</button></>
                    : <><TipBtn tip="Rename this item." className="btn btn-sm btn-ghost" onClick={() => { setEditing(it); setEditVal(it); }}>Edit</TipBtn>
                      <TipBtn tip="Remove this item from the checklist. Items already recorded on past cases are kept." className="btn btn-sm btn-danger" onClick={() => { if (confirm(`Remove “${it}” from the checklist?`)) store.removePropItem(it); }}>Remove</TipBtn></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="wit-add" style={{ marginTop: 12 }}>
          <input className="input" placeholder="New item, e.g. Radio" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') add(); }} />
          <TipBtn tip="Add a new item to the property checklist." className="btn btn-navy" dt="add-prop" onClick={add}>+ Add item</TipBtn>
        </div>
        <p className="hint">Removing or renaming an item doesn’t change checklists already saved on past cases.</p>
      </Card>
    </div>
  );
}

/* ═══════════ EMPLOYEES (ICT) ═══════════ */
function Employees({ store }) {
  const { emps, cases } = store;
  const [q, setQ] = useState(''); const [editing, setEditing] = useState(null); const [adding, setAdding] = useState(false); const [addingCat, setAddingCat] = useState(false);
  const rows = emps.filter(e => !q || (e.name + ' ' + e.title + ' ' + e.dept).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page">
      <PageHead title="Employees" info="The staff directory used by the disciplinary system. Add, edit or delete employees." sub="Staff directory used by the disciplinary system"
        right={<button className="btn btn-navy" onClick={() => setAdding(true)}>+ Add employee</button>} />
      <GuideBanner view="employees" />
      <div className="filters"><input className="input" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <Card>
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Title</th><th>Dept</th><th>Supervisor</th><th>Cases</th><th>Manage</th></tr></thead>
          <tbody>
            {rows.map(e => {
              const n = cases.filter(c => c.empId === e.id).length;
              return (
                <tr key={e.id}>
                  <td className="mono">{e.id}</td><td><b>{e.name}</b></td><td>{e.title}</td><td>{e.dept}</td><td>{e.sup}</td><td>{n}</td>
                  <td className="row-actions">
                    <TipBtn tip="Edit this record." className="btn btn-sm btn-ghost" onClick={() => setEditing(e)}>Edit</TipBtn>
                    <button className="btn btn-sm btn-danger" onClick={() => { if (n > 0) { alert(`${e.name} has ${n} case(s) and cannot be deleted.`); return; } if (confirm(`Delete ${e.name}?`)) store.deleteEmp(e.id); }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      {(editing || adding) && <EmployeeModal store={store} emp={editing} onClose={() => { setEditing(null); setAdding(false); }} />}
    </div>
  );
}
function EmployeeModal({ store, emp, onClose }) {
  const isNew = !emp;
  const [f, setF] = useState({ name: emp?.name || '', title: emp?.title || '', dept: emp?.dept || '', sup: emp?.sup || '' });
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  function save() { if (!f.name.trim()) { alert('Enter a name.'); return; } if (isNew) store.addEmp(f); else store.updateEmp(emp.id, f); onClose(); }
  return (
    <Modal title={isNew ? 'Add employee' : `Edit ${emp.name}`} onClose={onClose}
      foot={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-navy" onClick={save}>{isNew ? 'Add' : 'Save'}</button></>}>
      <Field label="Full name"><input className="input" value={f.name} onChange={set('name')} /></Field>
      <Field label="Job title"><input className="input" value={f.title} onChange={set('title')} /></Field>
      <Field label="Department"><input className="input" value={f.dept} onChange={set('dept')} /></Field>
      <Field label="Supervisor"><input className="input" value={f.sup} onChange={set('sup')} /></Field>
    </Modal>
  );
}

/* ═══════════ CEO REPORT (HR + CEO) ═══════════ */
function Report({ store }) {
  const { cases, emps, offs } = store;
  const open = cases.filter(c => c.status !== 'Closed');
  const closed = cases.filter(c => c.status === 'Closed');
  const tbl = (list, empty) => list.length ? (
    <table className="table">
      <thead><tr><th>Case</th><th>Employee</th><th>Offence</th><th>Action</th><th>Status</th></tr></thead>
      <tbody>{list.map(c => { const e = empById(c.empId, emps), o = offByN(c.off, offs); return (
        <tr key={c.id}><td className="mono">{c.id}</td><td>{e?.name}</td><td><OffenceCell c={c} offs={offs} /></td>
          <td><span className={'chip ' + penClass(c.decision || c.rec)}>{c.decision || c.rec}</span></td>
          <td><span className={'pill ' + statusClass(c.status)}>{c.status}</span>{c.outcome && <div className="sub">{c.outcome}</div>}</td></tr>
      ); })}</tbody>
    </table>
  ) : <Empty>{empty}</Empty>;
  return (
    <div className="page">
      <PageHead title="Weekly CEO Report" info="A summary of all disciplinary activity for executive review." sub="Summary of disciplinary activity for executive review" />
      <GuideBanner view="report" />
      <div className="stat-grid">
        <Stat n={open.length} label="Open" color="#1E40AF" />
        <Stat n={closed.length} label="Closed" color="#059669" />
        <Stat n={cases.filter(c => (c.decision || c.rec) === 'D').length} label="Dismissals" color="#B42318" />
      </div>
      <Card title="Open cases" sub="In progress">{tbl(open, 'No open cases.')}</Card>
      <div style={{ height: 16 }} />
      <Card title="Recently closed" sub="Concluded">{tbl(closed, 'No closed cases.')}</Card>
    </div>
  );
}

/* ═══════════ HOW IT WORKS ═══════════ */
function HowItWorks() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const role = ROLES[s.role] || { name: s.role, c: '#667085', bg: '#F3F1EC' };
  return (
    <div className="page">
      <PageHead title="How it works" info="A step-by-step walkthrough of the whole disciplinary process." sub="The disciplinary process, step by step" />
      <div className="steps-nav">
        {STEPS.map((st, i) => (
          <button key={i} className={'step-dot' + (i === step ? ' active' : i < step ? ' done' : '')} onClick={() => setStep(i)}>
            <span className="step-num">{i + 1}</span><span className="step-short">{st.short}</span>
          </button>
        ))}
      </div>
      <Card>
        <div className="step-head"><span className="role-badge" style={{ color: role.c, background: role.bg }}>{role.name}</span><h3 dangerouslySetInnerHTML={{ __html: s.title }} /></div>
        <p className="step-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />
        {s.mock && <div className="step-mock" dangerouslySetInnerHTML={{ __html: s.mock }} />}
        <div className="step-controls">
          <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
          <span className="step-count">{step + 1} of {STEPS.length}</span>
          <button className="btn btn-navy" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>Next →</button>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════ shared bits ═══════════ */
function InfoTip({ text }) {
  return (
    <span className="infotip" tabIndex={0}>
      <span className="infotip-i">i</span>
      <span className="infotip-bubble">{text}</span>
    </span>
  );
}
function TipBtn({ tip, className, onClick, children, dt }) {
  return (
    <span className="tipbtn">
      <button className={className} onClick={onClick} data-tour={dt}>{children}</button>
      <InfoTip text={tip} />
    </span>
  );
}
/* Help chatbox — rule-based Q&A about the app flow */
const HELP_KB = [
  { k: ['counsel','counselling','informal'], a: 'Counselling is the informal first step. The Line Manager logs a chat with the employee before any formal case (Line Manager → Counselling). If it doesn’t resolve the issue, it can be escalated into a formal case, carrying the notes forward.' },
  { k: ['raise','new case','multiple offence','add offence'], a: 'To raise a case: Line Manager → Raise a Case. Pick the employee (a red flag shows if they already have an open case), add one or more offences — each with its own occurrence, penalty range and recommendation — attach evidence, and flag serious offences. Then Submit to HR.' },
  { k: ['serious','immediate','termination','dismiss'], a: 'A serious offence can be flagged when raising the case — HR is alerted immediately. For sufficiently serious conduct (theft, violence, safety breaches, etc.) management may proceed directly to termination without progressive steps, where the employee was given a chance to respond.' },
  { k: ['investigat','witness','evidence'], a: 'HR must investigate before any notice (HR → HR Queue → Investigate): findings, discussion with the LM and employee, witnesses, and uploaded document/image evidence.' },
  { k: ['jury','peers','panel'], a: 'For a serious case, HR can convene a Jury of Peers — an impartial panel that gives an independent finding and recommendation. It’s advisory; HR, SMT and the CEO still decide.' },
  { k: ['notice','letter'], a: 'After investigation, HR issues the official notice and can generate a formatted disciplinary Letter (auto-filled, printable) from All Cases.' },
  { k: ['respond','response','reply','5 day'], a: 'The employee responds within 5 working days (Staff → My Notices). This response is part of the decision-making process — considered before management decides. It is not an appeal.' },
  { k: ['no response','overdue','deadline','late response','days left'], a: 'Each notice shows how many working days are left to respond. If 5 working days pass with no response, HR can click “Proceed without response” in the HR Queue — the case moves to decision and the record notes that no response was received.' },
  { k: ['each offence','multiple offence decision','per offence'], a: 'When a case has more than one offence, each offence is decided on its own within its own penalty range (HR, SMT and CEO all pick an action per offence). The overall outcome — used for the PAF and payroll — is the most serious of them.' },
  { k: ['edit draft','draft'], a: 'Drafts can be edited: Line Manager → My Team → Edit on the draft. Change the employee, offences, statement or evidence, then save or submit to HR.' },
  { k: ['appeal'], a: 'There is no separate appeal process. The employee’s response is their opportunity to give their account before the decision is made — not an appeal after the fact.' },
  { k: ['forward','smt','recommend'], a: 'For serious cases HR can forward to the CEO directly, or to the SMT. HR must give a recommendation. On the SMT route, the chosen SMT member also gives a mandatory recommendation. The CEO makes the final decision.' },
  { k: ['ceo','final decision','decide'], a: 'The CEO is the final decision-maker on forwarded cases (sees HR and SMT recommendations). The CEO can also re-establish a previously terminated employee to payroll.' },
  { k: ['decision','close','outcome'], a: 'HR records the final decision within the offence range, which closes the case. On a dismissal, the Line Manager retrieves company property and HR generates the Personnel Action Form (PAF) for payroll.' },
  { k: ['paf','personnel','payroll'], a: 'The Personnel Action Form (PAF) is generated by HR on a closed case (All Cases → Personnel Form). It carries the action to payroll — e.g. suspension without pay or removal from payroll on dismissal.' },
  { k: ['property','retriev'], a: 'When a case ends in dismissal, the Line Manager records the return of company property (laptop, keys, ID, uniform, vehicle, etc.) via the checklist in My Team.' },
  { k: ['reinstat','re-establish','re-instate'], a: 'Only the CEO can re-establish a previously terminated employee to payroll (CEO → Re-instatement), recording a reason and effective date.' },
  { k: ['history','view','full case'], a: 'The “View” / “View full case history” button opens the complete record: counselling, investigation, witnesses, evidence, jury, recommendations, response, decision and the audit trail. Available to HR, SMT and CEO.' },
  { k: ['executive','portfolio','oversight'], a: 'An Executive Member oversees their portfolio (staff, appraisals, counselling and discipline). It’s read-only — they monitor; HR and the CEO act.' },
  { k: ['charge','offence','penalty','category'], a: 'The Table of Charges lists every offence and its penalty by occurrence: A = verbal, R = written warning, S# = suspension days, D = dismissal. ICT/HR can add offences and categories.' },
  { k: ['ict','setup','employee','admin'], a: 'ICT Admin sets up the system: System Setup, Table of Charges and the Audit Log. Employees are managed in HR.' },
  { k: ['audit','log'], a: 'Every action in the system is written to the Audit Log with the role, timestamp and case reference (ICT Admin and CEO can view it).' },
  { k: ['role','who','panel'], a: 'Seven roles share one dataset: Line Manager, HR Manager, Staff, Executive Member, SMT, CEO and ICT Admin. Switch with the “Viewing as” bar at the top.' },
  { k: ['flow','process','step','how it works'], a: 'Serious flow: LM raises → HR investigates (+jury) → forward → SMT recommends → CEO decides → Letter + PAF. Routine flow: LM raises → HR investigates → notice → Staff responds → HR decides. See “How it works” in any role, or take the Guided Tour.' },
];
function helpAnswer(q) {
  const t = q.toLowerCase();
  let best = null, score = 0;
  for (const e of HELP_KB) { const hits = e.k.filter(w => t.includes(w)).length; if (hits > score) { score = hits; best = e; } }
  if (best) return best.a;
  return 'I can help with the disciplinary flow — try asking about: counselling, raising a case, investigation, jury of peers, serious offences, forwarding to SMT/CEO, the CEO decision, PAF/payroll, re-instatement, roles, or the Table of Charges. You can also use the Guided Tour (bottom-right) or the “How it works” page in each role.';
}
function HelpChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Hi! Ask me anything about how the system works — e.g. “how do I raise a case?” or “what happens after the employee responds?”' }]);
  const [q, setQ] = useState('');
  function send() {
    const text = q.trim(); if (!text) return;
    const a = helpAnswer(text);
    setMsgs(m => [...m, { from: 'you', text }, { from: 'bot', text: a }]);
    setQ('');
  }
  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title="Help">💬 Help</button>
      {open && (
        <div className="chat-panel">
          <div className="chat-head"><b>Help</b><span className="sub" style={{ color: '#cbd5e1' }}>Ask about the app flow</span><button className="chat-x" onClick={() => setOpen(false)}>×</button></div>
          <div className="chat-body">
            {msgs.map((m, i) => <div key={i} className={'chat-msg ' + m.from}>{m.text}</div>)}
          </div>
          <div className="chat-suggest">
            <div className="chat-suggest-h">Common questions</div>
            <div className="chat-chips">
              {['How do I raise a case?','What is a Jury of Peers?','Can an employee appeal?','What happens after the employee responds?','Who makes the final decision?','How does forwarding to SMT work?','What is the PAF?','How is company property retrieved?','How do I re-instate an employee?','What do the penalty codes mean?','What are the seven roles?','What is the full process flow?'].map((s2, i) => (
                <button key={i} className="chat-chip" onClick={() => { const a = helpAnswer(s2); setMsgs(m => [...m, { from: 'you', text: s2 }, { from: 'bot', text: a }]); }}>{s2}</button>
              ))}
            </div>
          </div>
          <div className="chat-in">
            <input className="input" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Type your question…" />
            <button className="btn btn-navy btn-sm" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

/* Normalise a case to its offence list (multi-offence or legacy single). */
function caseOffences(c) {
  if (c.offences && c.offences.length) return c.offences;
  return [{ off: c.off, occ: c.occ, rec: c.rec }];
}
/* Compact multi-offence cell for tables. */
function OffenceCell({ c, offs }) {
  const list = caseOffences(c);
  if (list.length === 1) {
    const o = offByN(list[0].off, offs);
    return <span>{o?.name}{o?.cat && <span className="sub">{o.cat}</span>}</span>;
  }
  return (
    <span>
      <span className="multi-badge">{list.length} offences</span>
      {list.map((x, i) => { const o = offByN(x.off, offs); return (
        <div key={i} className="multi-off">{i + 1}. {o?.name} <span className="chip-mini"><span className={'chip ' + penClass(x.rec)}>{x.rec}</span></span></div>
      ); })}
    </span>
  );
}

function PageHead({ title, sub, right, info }) {
  return <div className="page-head"><div><h1>{title}{info && <InfoTip text={info} />}</h1>{sub && <p className="page-sub">{sub}</p>}</div>{right && <div className="page-head-r">{right}</div>}</div>;
}
function Stat({ n, label, color }) { return <div className="stat"><div className="stat-n" style={{ color }}>{n}</div><div className="stat-l">{label}</div></div>; }
function Card({ title, sub, children }) {
  return <div className="card">{(title || sub) && <div className="card-head">{title && <div className="card-title">{title}</div>}{sub && <div className="card-sub">{sub}</div>}</div>}<div className="card-body">{children}</div></div>;
}
function Empty({ children }) { return <div className="empty">{children}</div>; }
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }
function Modal({ title, onClose, foot, children }) {
  return <div className="modal-bg" onClick={onClose}><div className="modal" onClick={e => e.stopPropagation()}>
    <div className="modal-head"><h3>{title}</h3><button className="modal-x" onClick={onClose}>×</button></div>
    <div className="modal-body">{children}</div><div className="modal-foot">{foot}</div></div></div>;
}
