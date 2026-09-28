export const OFFENCES=[
 {n:1,cat:'Attendance',name:'Unexcused tardiness (late without good reason)',p:[['A','A'],['R','S3'],['S10','D']]},
 {n:2,cat:'Attendance',name:'Unexcused or unauthorised absence (AWOL)',p:[['R','S3'],['S10','S20'],['D','D']]},
 {n:3,cat:'Attendance',name:'Abandonment of position',p:[['D','D']]},
 {n:4,cat:'Attendance',name:'Leaving assigned job during working hours without permission',p:[['A','R'],['S3','S10'],['S20','D']]},
 {n:5,cat:'Performance',name:'Loafing, idleness, wasting time',p:[['A','A'],['R','S3'],['S20','D']]},
 {n:6,cat:'Performance',name:'Careless or negligent workmanship causing waste or delay',p:[['A','R'],['R','D'],['D','D']]},
 {n:7,cat:'Safety',name:'Traffic violation, reckless driving, improper vehicle operation',p:[['A','S10'],['S10','S20'],['D','D']]},
 {n:8,cat:'Safety',name:'Ignoring safety precautions or not using safety clothing/equipment',p:[['S10','S10'],['S10','S20'],['D','D']]},
 {n:9,cat:'Safety',name:'Smoking in "No Smoking" areas; matches/lighters in explosive areas',p:[['R','D'],['D','D']]},
 {n:10,cat:'Safety',name:'Carrying explosives, firearms or lethal weapons without authorisation',p:[['R','D'],['D','D']]},
 {n:11,cat:'Safety',name:'Endangering the safety of, or injuring, other personnel',p:[['R','D'],['S20','D'],['D','D']]},
 {n:12,cat:'Safety',name:'Failure to report a personal injury or accident at work',p:[['A','R'],['A','R'],['R','S3']]},
 {n:13,cat:'Performance',name:'Deliberate failure/delay in carrying out instructions (e.g. monthly reports)',p:[['R','S3'],['S10','D'],['D','D']]},
 {n:14,cat:'Performance',name:'Sleeping on duty (public safety NOT endangered)',p:[['A','S10'],['R','S10'],['D','D']],note:'If public safety IS endangered, the penalty is Dismissal (D) on the first offence.'},
 {n:15,cat:'Conduct',name:'Physical/verbal abuse, disrespect, gossip, insulting language, defamation',p:[['R','D'],['S20','D'],['D','D']]},
 {n:16,cat:'Performance',name:'Excessive/improper personal use of Company equipment (phone, PC, email, internet)',p:[['A','R'],['R','S3'],['S3','S10']]},
 {n:17,cat:'Conflict of Interest',name:'Outside employment or financial interest without CEO approval',p:[['R','D'],['S10','D'],['D','D']]},
 {n:18,cat:'Conflict of Interest',name:'Outside activities/relationships creating a conflict of interest',p:[['A','D'],['S3','D'],['D','D']]},
 {n:19,cat:'Conflict of Interest',name:'Unauthorised access/disclosure/misuse of confidential info or PII',p:[['A','D'],['S3','D'],['D','D']]},
 {n:20,cat:'Conduct',name:'Inappropriate fraternisation (abuse of chain-of-command relationships)',p:[['D','D']]},
 {n:21,cat:'Conduct',name:'Insubordination — refusing a proper order or abusive language to supervisors',p:[['R','D'],['S20','D'],['D','D']]},
 {n:22,cat:'Conduct',name:'Reporting for / being on duty under the influence of intoxicants',p:[['R','D'],['S10','D'],['S20','D']]},
 {n:23,cat:'Conduct',name:'Giving or selling intoxicants to others on Company premises',p:[['R','D'],['S20','D'],['D','D']]},
 {n:24,cat:'Conduct',name:'Gambling or unlawful betting on Company premises',p:[['R','S20'],['S20','D'],['D','D']]},
 {n:25,cat:'Conduct',name:'Promotion of gambling on Company premises',p:[['R','D'],['S20','D'],['D','D']]},
 {n:26,cat:'Conduct',name:'Indebtedness — not paying just financial obligations to the Company in good faith',p:[['A','A'],['A','R'],['R','D']]},
 {n:27,cat:'Integrity',name:'Actual or attempted theft of Company or personal property',p:[['D','D']]},
 {n:28,cat:'Integrity',name:'Falsifying attendance records (for self or another)',p:[['R','D'],['S20','D'],['D','D']]},
 {n:29,cat:'Integrity',name:'Falsification/concealment of material facts; forging records; false info',p:[['R','D'],['S20','D'],['D','D']]},
 {n:30,cat:'Conduct',name:'Loss, damage or unauthorised use of Company property',p:[['R','D'],['S20','D'],['D','D']]},
 {n:31,cat:'Conduct',name:'Wilful unofficial use of Company vehicle',p:[['S20','D'],['D','D']]},
 {n:32,cat:'Conduct',name:'Borrowing from a subordinate; borrowing/lending over $20 on premises',p:[['R','D'],['D','D']]},
 {n:33,cat:'Conduct',name:'Soliciting contributions / promoting unendorsed campaigns on premises',p:[['A','S3'],['S10','D'],['D','D']]},
 {n:34,cat:'Conduct',name:'Selling tickets, goods, commodities or services on Company premises',p:[['A','D'],['S10','D'],['D','D']]},
 {n:35,cat:'Integrity',name:'Accepting/soliciting gifts or gratuities from those doing business with Company',p:[['R','D'],['D','D']]},
 {n:36,cat:'Integrity',name:'Engaging in black-market activity (e.g. selling Company fuel privately)',p:[['R','D'],['D','D']]},
 {n:37,cat:'Integrity',name:'Accepting bribes or improper payments for favourable treatment',p:[['D','D']]},
 {n:38,cat:'Conduct',name:'Misconduct off duty (where it creates risk to safety, operations or trust)',p:[['A','R'],['S3','D'],['D','D']]},
 {n:39,cat:'Integrity',name:'Refusal to testify or furnish information in Company investigations',p:[['R','D'],['D','D']]},
 {n:40,cat:'Integrity',name:'Failure of security directives; failure to safeguard sensitive information',p:[['R','D']]},
];

export const CATS=['Attendance','Performance','Safety','Conduct','Integrity','Conflict of Interest'];

export const CAT_ICON={Attendance:'&#128337;',Performance:'&#128202;',Safety:'&#9888;',Conduct:'&#128101;',Integrity:'&#128272;','Conflict of Interest':'&#9878;'};

export const EMP=[
 {id:445,name:'Lesivou Bulabalavu',title:'ICT Manager',dept:'ICT',sup:'Harbert Tom'},
 {id:447,name:'Berny Etse',title:'Help Desk Officer',dept:'ICT',sup:'Lesivou Bulabalavu'},
 {id:446,name:'Roddy Weital',title:'Desktop Support Officer',dept:'ICT',sup:'Lesivou Bulabalavu'},
 {id:238,name:'Gibson Siba',title:'Terminals Manager',dept:'Operations',sup:'Savenaca Tamani'},
 {id:286,name:'Mylani Alexander',title:'Emergency Preparedness Officer',dept:'Safety',sup:'Johnny Adolph'},
 {id:341,name:'Rehnio Alfons',title:'Terminal Operator',dept:'Terminals',sup:'Wayne Narruhn'},
 {id:628,name:'Morrison Depaune',title:'Terminal Operator',dept:'Terminals',sup:'Sireli Sovau'},
 {id:629,name:'Nikson Garoa',title:'Customer Service Officer',dept:'Terminals',sup:'Sireli Sovau'},
 {id:444,name:'Mohammed Zaid',title:'Project Officer',dept:'Projects',sup:'Neil Halstead'},
 {id:441,name:'Rhonald Manrique',title:'Project Engineer',dept:'Projects',sup:'Neil Halstead'},
 {id:249,name:'Garry Garsain',title:'Supply Chain Manager',dept:'Supply Chain',sup:'Johnny Adolph'},
 {id:440,name:'Caroline Fritz',title:'Customer Service Officer',dept:'Terminals',sup:'Wilton Masaichy'},
 {id:364,name:'Rominger M.',title:'Senior Accountant',dept:'Finance',sup:'Johnny Adolph'},
 {id:450,name:'Prylain Manuel',title:'Receptionist',dept:'Admin',sup:'Joseph Saimon'},
];


/* Executive Members — each holds a portfolio of departments and can see
   the disciplinary standing of every employee under that portfolio. */

/* Appraisal status is owned by the STIP system, not the disciplinary module.
   For this prototype we derive a stable sample status per employee so the
   Executive can see appraisal standing alongside discipline. In production this
   comes from the STIP API. */
export const APPRAISAL_STATUSES = ['CEO Approved','With HR','Submitted to CEO','Pending'];
export function appraisalStatus(empId, quarter) {
  // deterministic pseudo-status from id+quarter so it stays stable across renders
  const q = quarter === 'Q1' ? 7 : 13;
  const idx = (empId * 3 + q) % 10;
  if (idx < 4) return 'CEO Approved';
  if (idx < 6) return 'With HR';
  if (idx < 8) return 'Submitted to CEO';
  return 'Pending';
}
export function apprStatusClass(s) {
  return s === 'CEO Approved' ? 'st-closed'
    : s === 'With HR' ? 'st-hr'
    : s === 'Submitted to CEO' ? 'st-appeal'
    : 'st-draft';
}

export const PROPERTY_ITEMS = [
  'Laptop / computer', 'Mobile phone / SIM', 'Access keys', 'ID / access card',
  'Uniform / PPE', 'Company vehicle', 'Fuel card', 'Tools / equipment',
  'Documents / files', 'Other',
];

export const COUNSEL_OUTCOMES = ['Resolved','Verbal admonishment','Escalated'];

export const SMT_MEMBERS = [
  { id: 'smt-1', name: 'Isikeli Rabici', title: 'GM Operations' },
  { id: 'smt-2', name: 'Ana Vualiku', title: 'GM Corporate Services' },
  { id: 'smt-3', name: 'Daniel Whippy', title: 'GM Finance' },
  { id: 'smt-4', name: 'Litia Mara', title: 'GM People & Safety' },
];

export const EXECUTIVES = [
  { id: 'exec-ops', name: 'Savenaca Tamani', title: 'Executive — Operations Group', depts: ['Operations','Terminals','Safety'] },
  { id: 'exec-corp', name: 'Johnny Adolph', title: 'Executive — Corporate Services', depts: ['Finance','Supply Chain','Admin'] },
  { id: 'exec-tech', name: 'Neil Halstead', title: 'Executive — Technology & Projects', depts: ['ICT','Projects'] },
];

export const PEN_ORDER=['A','R','S3','S10','S20','D'];

export const ROLES={
  ict:{name:'ICT Admin',c:'#0891B2',bg:'#CFFAFE',init:'IT'},
  lm:{name:'Line Manager',c:'#1E40AF',bg:'#DBEAFE',init:'LM'},
  hr:{name:'HR Manager',c:'#B45309',bg:'#FEF3C7',init:'HR'},
  staff:{name:'Staff',c:'#059669',bg:'#D1FAE5',init:'ST'},
  ceo:{name:'CEO',c:'#6D28D9',bg:'#EDE9FE',init:'CE'},
  exec:{name:'Executive Member',c:'#134E4A',bg:'#CCFBF1',init:'EX'},
  smt:{name:'SMT',c:'#7C2D12',bg:'#FFEDD5',init:'SM'},
};

export const STEPS = [
 {
  "role": "ict",
  "title": "Set up the disciplinary module",
  "short": "Setup",
  "desc": "Before anyone can use the system, the ICT Admin sets it up — loads the Table of Charges, decides who is allowed to raise cases (supervisors) and who reviews them (HR and the CEO), and switches on audit logging so every action is recorded. This is a one-time setup.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">ICT Admin · System setup</div><div style=\"display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)\"><span style=\"width:20px;height:20px;border-radius:50%;background:var(--green-mid);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0\">&#10003;</span><div><div style=\"font-size:13px;font-weight:600;color:var(--ink)\">Table of Charges</div><div style=\"font-size:11px;color:var(--muted)\">40 offences loaded</div></div></div><div style=\"display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)\"><span style=\"width:20px;height:20px;border-radius:50%;background:var(--green-mid);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0\">&#10003;</span><div><div style=\"font-size:13px;font-weight:600;color:var(--ink)\">Roles &amp; permissions</div><div style=\"font-size:11px;color:var(--muted)\">Supervisors can raise · HR reviews · CEO approves</div></div></div><div style=\"display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)\"><span style=\"width:20px;height:20px;border-radius:50%;background:var(--green-mid);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0\">&#10003;</span><div><div style=\"font-size:13px;font-weight:600;color:var(--ink)\">Working-day timers</div><div style=\"font-size:11px;color:var(--muted)\">5 days to respond · 10 days to appeal</div></div></div><div style=\"display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)\"><span style=\"width:20px;height:20px;border-radius:50%;background:var(--green-mid);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0\">&#10003;</span><div><div style=\"font-size:13px;font-weight:600;color:var(--ink)\">Audit logging</div><div style=\"font-size:11px;color:var(--muted)\">ON — every action recorded</div></div></div>"
 },
 {
  "role": "lm",
  "title": "Counsel the employee first",
  "short": "Counsel",
  "desc": "When a problem first happens, the supervisor (line manager) does NOT jump to punishment. The first step is a private chat to understand and fix the issue. The supervisor notes this in their own records. The supervisor records the counselling in the system (issue, discussion and outcome) so it is kept on the employee\u2019s file, not just in personal notes. If the <b>same employee reoffends later</b>, that earlier counselling is automatically flagged when a new case is raised \u2014 and the supervisor can escalate the counselling straight into a formal case, with the notes carried forward. A formal case only follows if counselling does not resolve the problem.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">Line Manager · Counselling note</div><div style=\"background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:13px 15px;font-size:13px;color:var(--ink);line-height:1.6\">Spoke privately with the employee about repeated late arrivals. Agreed on a plan to improve punctuality. No formal action at this stage.</div><div style=\"font-size:11px;color:var(--muted);margin-top:10px\">&#128161; Discipline is always a last resort. This informal step comes first.</div>"
 },
 {
  "role": "lm",
  "title": "Raise a disciplinary case",
  "short": "Raise case",
  "desc": "If the problem continues, the supervisor opens the system and selects the offence. The system automatically checks the employee&rsquo;s history and shows whether this is the 1st, 2nd or 3rd time — and the matching penalty range. The supervisor writes up the facts, recommends an action within that range, and submits it to HR. For a <b>serious offence</b>, the supervisor ticks \u201cSerious offence \u2014 report to HR immediately\u201d when raising it: HR is alerted at once (a red alert on the HR queue) so they can act while the investigation is still ongoing. A single incident can involve <b>more than one offence</b> \u2014 the line manager can add several offences to one case, and <b>each</b> is checked for its own occurrence and penalty range and gets its own recommended action. The line manager can also <b>attach supporting documents or evidence</b> (reports, photos, emails) when raising the case, which HR sees during the investigation. When the line manager picks an employee, the system flags anyone who already has an open case (and lists their open and past cases with a \u201cView history\u201d link) to avoid duplicates, and \u2014 for a non-serious case with no counselling on record \u2014 gently reminds the supervisor to counsel first.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">Line Manager · Raise case form</div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Employee</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\">Berny Etse — Help Desk Officer</span></div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Offence</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\">#1 Unexcused tardiness</span></div><div style=\"background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:11px 13px;margin:10px 0\"><div style=\"font-size:11px;color:var(--muted);margin-bottom:4px\">System check (automatic)</div><div style=\"font-size:13px;font-weight:700;color:var(--navy)\">2nd occurrence → penalty range <span class=\"pen pen-R\">R</span> <span class=\"parrow\">&rarr;</span> <span class=\"pen pen-S\">S3</span></div></div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Recommended action</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\"><span class=\"pen pen-R\">R</span> Written warning</span></div><div style=\"margin-top:10px\"><span class=\"st st-hr\">Submitted to HR</span></div>"
 },
 {
  "role": "hr",
  "title": "HR investigates the case",
  "short": "Investigate",
  "desc": "Before issuing any notice, HR investigates. HR establishes the facts of the incident, discusses it with the line manager and the employee, and may question other staff who were on site as witnesses. Witness names and statements are recorded, and any supporting documents or images (reports, photos, CCTV stills) are uploaded as evidence. Only once the investigation is saved can HR issue the official notice. For a serious case, HR can also activate a <b>Jury of Peers</b> \u2014 an impartial panel of fellow employees who review the case and give an independent finding (substantiated / partly / not substantiated) and a recommended action. The jury\u2019s view is advisory and travels with the case to HR, the SMT and the CEO.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">HR Manager · Investigation</div><div style=\"background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:13px 15px;font-size:13px;color:var(--ink);line-height:1.6\">Findings: CCTV confirms the bay was left unattended at 14:05. Discussed with the line manager and the employee.</div><div style=\"font-size:11px;color:var(--muted);text-transform:uppercase;font-weight:700;margin:12px 0 6px\">Witnesses</div><div style=\"display:flex;gap:8px;flex-wrap:wrap\"><span class=\"st st-hr\">Sireli Sovau</span><span class=\"st st-hr\">Wayne Narruhn</span></div><div style=\"font-size:11px;color:var(--muted);text-transform:uppercase;font-weight:700;margin:12px 0 6px\">Evidence</div><div style=\"display:flex;align-items:center;gap:8px\"><span>&#128196;</span><span style=\"font-size:12px;color:var(--navy);font-weight:600\">incident_report.pdf</span><span>&#128247;</span><span style=\"font-size:12px;color:var(--navy);font-weight:600\">cctv_still.png</span></div>"
 },
 {
  "role": "hr",
  "title": "HR reviews and issues official notice",
  "short": "HR review",
  "desc": "With the investigation complete, HR issues the official notice of the charge and the proposed action, in line with the Table of Charges. HR can generate a formal disciplinary notice/letter (auto-filled from the case) to print or save as PDF and hand to the employee. The notice goes to both the employee and the line manager, and starts the employee&rsquo;s 5-working-day response window.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">HR Manager · Official notice</div><div style=\"background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:13px 15px;font-size:13px;color:var(--ink);line-height:1.6\">Official Notice of Charge issued to the employee. Charge: Offence #1 (unexcused tardiness), 2nd occurrence. Proposed action: Written warning (R).</div><div style=\"display:flex;align-items:center;gap:8px;margin-top:10px\"><span class=\"st st-resp\">Awaiting employee response</span><span class=\"timer\">5 working days to respond</span></div>"
 },
 {
  "role": "staff",
  "title": "Employee responds — HR records it (5 working days)",
  "short": "Respond",
  "desc": "The employee receives the notice and has 5 working days to give their side of the story. They submit a written response in the system. If they have a genuine reason they cannot respond in time, a reasonable extension can be granted.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">Staff · Response box</div><div style=\"background:var(--cream);border:1px solid var(--border);border-radius:8px;padding:13px 15px;font-size:13px;color:var(--ink);line-height:1.6\">\"I was late on those days due to a family medical emergency. I have since arranged earlier transport and it will not happen again. Supporting note from the clinic is attached.\"</div><div style=\"display:flex;align-items:center;gap:8px;margin-top:10px\"><span class=\"st st-resp\">Response submitted</span><span class=\"timer\">3 working days left</span></div>"
 },
 {
  "role": "smt",
  "title": "HR may forward to the CEO or SMT",
  "short": "Forward",
  "desc": "After the investigation and all discussion with the line manager and employee, HR can forward the case up instead of deciding it at HR level. <b>Case 1 &mdash; HR &rarr; CEO:</b> HR forwards the case directly to the CEO, and the CEO takes the final decision and closes the case. <b>Case 2 &mdash; HR &rarr; SMT &rarr; CEO:</b> HR forwards the case to the Senior Management Team, who recommend an action (within the offence range) with their rationale; the case then goes to the CEO, who takes the final decision and closes it. The SMT can have more than one member, so when forwarding to SMT, HR selects <b>which SMT member</b> to send the case to from a dropdown \u2014 that member is shown on the case and carried through to the CEO. Both the SMT and the CEO can open <b>“View full case history”</b> on a case \u2014 showing prior counselling, the line manager\u2019s statement, the HR investigation, witness statements, uploaded evidence, any Jury of Peers finding, all recommendations and the audit trail \u2014 so they decide with the complete picture. The CEO also has the Table of Charges in their menu, listing every offence and its penalties. Whenever HR forwards a case, HR <b>must</b> record a recommended action (within the offence range) and the reason for it \u2014 this is mandatory, and the recommendation travels with the case so the SMT and the CEO can see what HR advised. Where a case has several offences, HR gives one overall recommendation to the CEO covering the case as a whole. Where the case goes to the SMT, the SMT <b>must</b> record a recommended action and rationale before it moves on \u2014 like HR\u2019s, this recommendation is mandatory and is shown to the CEO alongside HR\u2019s. In both cases the CEO is the final decision-maker.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">HR &rarr; SMT &rarr; CEO</div><div style=\"background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:13px 15px;margin-bottom:10px\"><div style=\"font-size:11px;color:#7C2D12;font-weight:800;text-transform:uppercase;margin-bottom:5px\">SMT recommendation</div><div style=\"font-size:13px;font-weight:700;color:var(--navy)\"><span class=\"pen pen-S\">S10</span> 10-day suspension</div><div style=\"font-size:12px;color:var(--muted);margin-top:3px\">Given the severity, the SMT recommends this action to the CEO.</div></div><div style=\"display:flex;align-items:center;gap:8px\"><span class=\"st st-ceo\">With CEO</span><span style=\"font-size:11px;color:var(--muted)\">CEO makes the final decision</span></div>"
 },
 {
  "role": "hr",
  "title": "HR records the decision",
  "short": "Decision",
  "desc": "HR carefully considers the employee&rsquo;s response, including any mitigating factors, and records the final action — which must fall within the Table of Charges range for that offence. The outcome is saved to the employee&rsquo;s personal file. Once decided, HR can generate a Personnel Action Form (PAF) — an auto-filled, printable form that actions the decision in payroll (e.g. a suspension without pay, or removal from payroll on dismissal). Warnings carry an <b>active window</b> — a written warning stays active for 3 months and a suspension/final warning for 6 months. If no new case arises in that window, the warning expires and the employee’s slate is wiped clean, so it no longer counts toward the next occurrence. Where the decision is <b>dismissal</b>, the line manager also completes a company-property retrieval checklist \u2014 laptop, keys, ID card, uniform/PPE, vehicle, fuel card, tools \u2014 ticking each item as it is returned and noting anything outstanding.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">HR Manager · Decision</div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Charge</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\">#1 Unexcused tardiness (2nd)</span></div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Decision</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\"><span class=\"pen pen-R\">R</span> Written warning</span></div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Recorded in</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\">Employee personal file</span></div><div style=\"margin-top:10px\"><span class=\"st st-closed\">Case closed — upheld</span></div>"
 },
  {
  "role": "ceo",
  "title": "CEO — final decision &amp; weekly oversight",
  "short": "CEO",
  "desc": "The CEO is the final decision-maker on cases forwarded to them (directly by HR, or via the SMT). The CEO also receives a weekly report of all cases to confirm conduct is being managed fairly and consistently across every department, and is the only role that can <b>re-establish a previously terminated employee</b> back into the payroll system \u2014 for example on new evidence \u2014 by recording a reason and effective date.",
  "mock": "<div style=\"font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:10px\">CEO · Final decision</div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Route</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\">HR → SMT → CEO</span></div><div style=\"display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)\"><span style=\"font-size:12px;color:var(--muted)\">Final decision</span><span style=\"font-size:13px;font-weight:600;color:var(--navy)\"><span class=\"pen pen-R\">R</span> Upheld (warning stands)</span></div><div style=\"height:1px;background:var(--border);margin:12px 0\"></div><div style=\"font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:8px\">Weekly report to CEO</div><div style=\"display:flex;gap:10px;flex-wrap:wrap\"><span class=\"tag\">4 active</span><span class=\"tag\">1 awaiting response</span><span class=\"tag\">3 closed</span></div>"
 }
];


export const SEED_CASES=[
 /* Closed — dismissal: has full investigation, jury, property retrieval, PAF-ready */
 {id:'DC-1042',empId:341,off:14,occ:1,rec:'D',status:'Closed',raised:'2026-05-12',
  desc:'Found asleep at the fuel terminal control room during night shift where public safety could be affected.',
  serious:true, seriousAck:true,
  investigation:{findings:'CCTV between 02:10 and 02:48 shows the control desk unattended with the operator asleep in the adjacent chair. Alarm panel was unmonitored for 38 minutes.',
   lmDiscuss:'Terminal Manager confirmed the operator had been briefed on night-shift monitoring duties two weeks earlier.',
   staffDiscuss:'Employee admitted falling asleep, stated he had worked a double shift but had not requested relief.',
   witnesses:[{name:'Sireli Sovau',note:'Relieving operator; found the control desk unattended at 02:45.'},
              {name:'Wayne Narruhn',note:'Shift supervisor; confirmed no relief request was logged that night.'}],
   files:[], savedAt:'2026-05-15'},
  jury:{active:true, members:[{name:'Mylani Alexander',dept:'Safety'},{name:'Nikson Garoa',dept:'Terminals'},{name:'Berny Etse',dept:'ICT'}],
   finding:'Substantiated', rec:'D', notes:'Panel accepted the fatigue explanation but held that leaving a fuel control room unmonitored is a critical safety breach.', savedAt:'2026-05-18'},
  hrRec:'D', hrNote:'Public safety was endangered. HR recommends dismissal in line with the Table of Charges.',
  referredBy:'HR', smtMember:'Isikeli Rabici', smtRec:'D',
  smtRationale:'SMT concurs with HR and the peer panel. The breach placed the terminal and the public at risk.',
  response:'I accept I fell asleep. I had completed a double shift and should have asked for relief.',
  decision:'D', outcome:'Dismissal upheld by CEO',
  property:{items:{'Laptop / computer':{returned:true,note:'Asset tag FSM-LPT-0447'},
    'Mobile phone / SIM':{returned:true,note:'SIM cancelled 22/05'},
    'Access keys':{returned:true,note:'Terminal gate + control room'},
    'ID / access card':{returned:true,note:''},
    'Uniform / PPE':{returned:true,note:'2 sets, helmet, boots'},
    'Fuel card':{returned:false,note:'Reported lost — card blocked'}},
   by:'Wayne Narruhn', savedAt:'2026-05-22'}},

 /* Awaiting Response — notice issued, investigation done, letter available */
 {id:'DC-1051',empId:447,off:1,occ:2,rec:'R',status:'Awaiting Response',raised:'2026-06-15',
  desc:'Arrived more than 40 minutes late on three occasions in June without notifying the supervisor.',
  noticeDate:'2026-06-10',
  investigation:{findings:'Gate access logs confirm late entry on 3, 9 and 11 June (42, 55 and 47 minutes late). No prior notification was recorded on any occasion.',
   lmDiscuss:'Help Desk Team Leader confirmed the employee was counselled informally in May about punctuality.',
   staffDiscuss:'Employee cited transport difficulties and agreed the lateness was not notified in advance.',
   witnesses:[{name:'Lesivou Bulabalavu',note:'Line manager; confirmed no advance notice was given on any of the three dates.'}],
   files:[], savedAt:'2026-06-16'}},

 /* With HR — investigated, ready to forward or notice */
 {id:'DC-1048',empId:446,fromCounselling:'CN-2004',off:8,occ:1,rec:'S10',status:'With HR',raised:'2026-06-12',
  desc:'Worked in the server room without the required anti-static and safety equipment despite reminders.',
  serious:true,
  investigation:{findings:'Employee entered the server room on 11 June without anti-static wrist strap or safety footwear. Two prior verbal reminders are on record.',
   lmDiscuss:'ICT Manager confirmed PPE is issued and stored at the server room entrance.',
   staffDiscuss:'Employee stated the task was brief and he did not consider PPE necessary.',
   witnesses:[{name:'Berny Etse',note:'Present in the server room; confirmed no PPE was worn.'}],
   files:[], savedAt:'2026-06-14'}},

 /* Closed — decision recorded */
 {id:'DC-1039',empId:440,off:16,occ:1,rec:'R',status:'Closed',raised:'2026-02-02',
  desc:'Extensive personal use of company internet and email during working hours over several weeks.',
  noticeDate:'2026-02-03', decisionDate:'2026-02-20', appealDate:'2026-06-10',
  investigation:{findings:'Network logs show an average of 2.5 hours per day on non-work streaming and social media over a four-week period.',
   lmDiscuss:'Line manager reported no drop in output but confirmed the usage policy was circulated in March.',
   staffDiscuss:'Employee stated much of the usage occurred during authorised breaks.',
   witnesses:[], files:[], savedAt:'2026-06-01'},
  response:'A large part of the recorded time was during my lunch break and approved rest periods.',
  decision:'R', outcome:'Written warning issued',
  appeal:'The log does not separate break periods from working hours, and my output was never below target.'},

 /* Closed — dismissal */
 {id:'DC-1064',empId:446,off:8,occ:2,rec:'S10',status:'Closed',raised:'2026-05-30',
  desc:'Second instance of working in the server room without required PPE, this time causing a minor electrostatic incident.',
  noticeDate:'2026-05-31', appealDate:'2026-06-12', serious:true, seriousAck:true,
  investigation:{findings:'Employee entered the server room on 29 May without anti-static equipment; a static discharge damaged a network switch. This is the second PPE breach on record.',
   lmDiscuss:'ICT Manager confirmed PPE was available and the earlier written warning was explained.',
   staffDiscuss:'Employee stated he was in a hurry to restore a service outage and skipped the wrist strap.',
   witnesses:[{name:'Berny Etse',note:'Present when the discharge occurred; confirmed no PPE was worn.'},
              {name:'Roddy Weital',note:'ICT support; logged the damaged switch afterwards.'}],
   files:[], savedAt:'2026-06-02'},
  hrRec:'S10', hrNote:'Repeat PPE breach causing equipment damage. HR recommended a 10-day suspension.',
  response:'I skipped PPE only because a critical service was down and I was trying to restore it quickly.',
  decision:'S10', outcome:'10-day suspension issued',
  appeal:'The breach happened during an emergency outage where speed was critical, and I have since completed refresher safety training.'},

 /* Closed — written warning */
 {id:'DC-1065',empId:341,off:16,occ:1,rec:'R',status:'Closed',raised:'2026-06-08',
  desc:'Personal use of the company vehicle for a non-work trip over a weekend without authorisation.',
  noticeDate:'2026-06-09', appealDate:'2026-06-18',
  investigation:{findings:'GPS log shows the terminal vehicle travelled 84 km to a residential address and back on Saturday 6 June, outside any logged job.',
   lmDiscuss:'Terminal Manager confirmed no weekend duty was assigned.',
   staffDiscuss:'Employee stated he believed informal weekend use was tolerated for on-call staff.',
   witnesses:[{name:'Wayne Narruhn',note:'Confirmed no weekend job was assigned that day.'}],
   files:[], savedAt:'2026-06-10'},
  hrRec:'R', hrNote:'Unauthorised personal use of a company vehicle. HR recommended a written warning.',
  response:'I understood that on-call staff could use the vehicle at weekends; this was never clarified to me.',
  decision:'R', outcome:'Written warning issued',
  appeal:'On-call vehicle use was never put in writing, and other on-call staff have used vehicles at weekends without action.'},

 /* With SMT — waiting on an SMT recommendation */
 {id:'DC-1056',empId:628,off:21,occ:2,rec:'S3',status:'With SMT',raised:'2026-06-17',
  desc:'Refused a direct instruction to complete a safety check and used abusive language toward the shift supervisor in front of other staff.',
  serious:true, seriousAck:true,
  investigation:{findings:'Two witnesses confirm the instruction was given clearly and refused, followed by abusive language. This is the second such incident in twelve months.',
   lmDiscuss:'Shift supervisor confirmed the instruction was a routine safety check.',
   staffDiscuss:'Employee acknowledged raising his voice but disputes the wording alleged.',
   witnesses:[{name:'Nikson Garoa',note:'Heard the refusal and the language used.'},
              {name:'Caroline Fritz',note:'Confirmed the supervisor asked twice before the refusal.'}],
   files:[], savedAt:'2026-06-19'},
  jury:{active:true, members:[{name:'Roddy Weital',dept:'ICT'},{name:'Mohammed Zaid',dept:'Operations'}],
   finding:'Partly substantiated', rec:'S3', notes:'Panel accepts the refusal occurred; wording of the language is disputed.', savedAt:'2026-06-20'},
  referredBy:'HR', smtMember:'Litia Mara',
  hrRec:'S3', hrNote:'Second occurrence of insubordination. HR recommends a 3-day suspension and a final written warning on file.'},

 /* With CEO — SMT has recommended, CEO to decide */
 {id:'DC-1057',empId:444,off:27,occ:1,rec:'D',status:'With CEO',raised:'2026-06-19',
  desc:'Attempted removal of two drums of lubricant from the store without a gate pass or authorisation.',
  serious:true, seriousAck:true,
  investigation:{findings:'Gate security stopped the vehicle and found two 20L drums with no gate pass. Store records show no issue note for the items.',
   lmDiscuss:'Supply Chain Officer confirmed no authorisation was requested or granted.',
   staffDiscuss:'Employee stated he intended to return the drums after use at home and did not consider it theft.',
   witnesses:[{name:'Mylani Alexander',note:'Gate security; stopped the vehicle and recorded the items.'},
              {name:'Gibson Siba',note:'Store supervisor; confirmed no issue note exists for the drums.'}],
   files:[], savedAt:'2026-06-20'},
  hrRec:'D', hrNote:'Attempted removal of company property without authorisation. HR recommends dismissal per the Table of Charges.',
  referredBy:'HR', smtMember:'Daniel Whippy', smtRec:'D',
  smtRationale:'SMT agrees with HR. Intent to return does not change the unauthorised removal of company property.'},

 /* With CEO — direct HR referral (no SMT), CEO to decide */
 {id:'DC-1059',empId:446,off:30,occ:1,rec:'S20',status:'With CEO',raised:'2026-06-20',
  desc:'Company laptop returned with a cracked screen and water damage after being taken off site without approval.',
  serious:true, seriousAck:true,
  investigation:{findings:'Asset FSM-LPT-0512 was taken off site on 12 June with no gate pass. Returned 18 June with a cracked screen and internal water damage. Repair quote is $1,850.',
   lmDiscuss:'ICT Manager confirmed no off-site approval was requested for the device.',
   staffDiscuss:'Employee stated he took the laptop home to finish a report and it was damaged by a spilled drink.',
   witnesses:[{name:'Roddy Weital',note:'ICT support; logged the damage on return and obtained the repair quote.'}],
   files:[], savedAt:'2026-06-21'},
  hrRec:'S20', hrNote:'Unauthorised off-site removal resulting in significant damage. HR recommends a 20-day suspension and recovery of repair costs.',
  referredBy:'HR'},

 /* With CEO — via SMT, dismissal recommended */
 {id:'DC-1062',empId:440,off:28,occ:1,rec:'D',status:'With CEO',raised:'2026-06-22',
  desc:'Falsified overtime records claiming 46 hours that were not worked over a two-month period.',
  serious:true, seriousAck:true,
  investigation:{findings:'Cross-check of gate access logs against submitted timesheets shows 46 hours claimed with no corresponding site presence across April and May.',
   lmDiscuss:'Finance Manager confirmed the overtime was approved on the basis of the submitted sheets alone.',
   staffDiscuss:'Employee initially disputed the figures, then accepted the logs were accurate.',
   witnesses:[{name:'Johnny Adolph',note:'Finance; produced the payroll records and the overtime approvals.'},
              {name:'Mylani Alexander',note:'Security; confirmed the gate access log extracts are complete.'}],
   files:[], savedAt:'2026-06-24'},
  jury:{active:true, members:[{name:'Gibson Siba',dept:'Terminals'},{name:'Berny Etse',dept:'ICT'},{name:'Caroline Fritz',dept:'Terminals'}],
   finding:'Substantiated', rec:'D', notes:'Panel found deliberate falsification over a sustained period, not an administrative error.', savedAt:'2026-06-25'},
  hrRec:'D', hrNote:'Deliberate falsification of records for financial gain. HR recommends dismissal and recovery of the overpayment.',
  referredBy:'HR', smtMember:'Daniel Whippy', smtRec:'D',
  smtRationale:'SMT concurs. The conduct was sustained and deliberate, and the trust required for the role cannot be maintained.'},

 /* Closed — reduced after response; shows PAF + letter */
 {id:'DC-1033',empId:444,off:2,occ:1,rec:'S3',status:'Closed',raised:'2026-04-20',
  desc:'Absent for two days without authorisation or notice (AWOL).',
  noticeDate:'2026-04-21',
  investigation:{findings:'Absent 15 and 16 April. No leave application and no contact with the supervisor on either day.',
   lmDiscuss:'Supervisor confirmed no call was received.',
   staffDiscuss:'Employee reported a family bereavement and produced supporting documentation after the fact.',
   witnesses:[], files:[], savedAt:'2026-04-22'},
  response:'My grandmother passed away and I travelled to the village. I had no phone signal to notify my supervisor.',
  decision:'R', outcome:'Upheld (reduced to written warning after response)'},

 {id:'DC-1055',empId:341,off:1,occ:1,rec:'A',status:'Closed',raised:'2026-03-05',
  desc:'Late on one occasion without prior notice.',
  response:'I was delayed by a road closure and did not have the supervisor number saved.',
  decision:'A', outcome:'Upheld'},

 /* With HR — not yet investigated, so the Investigate step is demonstrable */
 {id:'DC-1058',empId:628,off:21,occ:1,rec:'R',status:'With HR',raised:'2026-06-18',
  desc:'Refused a reasonable instruction from the shift supervisor and used disrespectful language.'},

 /* Draft — LM side */
 {id:'DC-1060',empId:441,off:13,occ:1,rec:'R',status:'Draft',raised:'2026-06-20',
  desc:'Repeated delay in submitting the monthly project progress report despite reminders.'},
];

/* Per-panel guide — a short "how this panel works" shown on every screen,
   written from the FSMPC disciplinary procedure. */
export const PANEL_GUIDE = {
  'hr-settings': { title: 'How Settings works', role: 'hr', points: [
    'Case expiry — set how long a written warning (default 3 months) or a suspension/final warning (default 6 months) stays active. 0 = never expires.',
    'When the window passes with no new case, the warning expires and no longer counts toward occurrence (clean slate). Changing a value updates every case at once.',
    'Counselling outcomes — add, rename or remove the options a line manager picks when logging counselling.',
    'Jury of Peers findings — add, rename or remove the finding options a jury panel can record.',
    'Every change is saved to the Audit Log.',
  ] },
  'ceo-reinstate': {
    title: 'How Re-instatement works',
    role: 'ceo',
    points: [
      'Lists employees who were dismissed through a disciplinary case.',
      'The CEO may re-establish a previously terminated employee back into the payroll system — for example after a successful appeal, new evidence, or on compassionate grounds.',
      'Re-instating records the reason and date, reverses the dismissal on the case, and is written to the audit log. Only the CEO can do this.',
    ],
  },
  'ceo-referrals': {
    title: 'How Referrals works',
    role: 'ceo',
    points: [
      'Cases HR forwarded directly to you, or that came up through the SMT with a recommendation.',
      'Where the SMT has recommended an action, it is shown here — you may follow it or decide differently, within the offence range.',
      'Click “View full case history” to see everything on the case: prior counselling, the LM’s statement, the HR investigation, witness statements, uploaded evidence, any Jury of Peers finding, recommendations and the audit trail.',
      'The Table of Charges is in your menu — it lists every offence and its penalties (verbal warning, written warning, suspension or dismissal) by occurrence.',
      'Your decision is final and closes the case.',
    ],
  },
  'smt-queue': {
    title: 'How SMT Referrals works',
    role: 'smt',
    points: [
      'Cases HR has forwarded to the Senior Management Team for a recommendation before the CEO decides — each shows which SMT member HR assigned it to.',
      'Click “View full case history” to see everything: prior counselling, the LM’s statement, the HR investigation, witness statements and uploaded evidence.',
      'A recommendation to the CEO is mandatory — you must select an action within the offence range and give your rationale before the case can move on.',
      'Review the case, the investigation and any evidence, then recommend an action to the CEO — within the offence\u2019s penalty range — with your rationale.',
      'Once recommended, the case moves to the CEO with your recommendation attached. The CEO makes the final decision.',
    ],
  },
  'smt-decided': {
    title: 'How Recommended works',
    role: 'smt',
    points: [
      'Cases the SMT has already recommended on and sent to the CEO.',
      'Shows your recommended action and rationale, and the CEO\u2019s final decision once made.',
    ],
  },
  'lm-counsel': {
    title: 'How Counselling works',
    role: 'lm',
    points: [
      'The first, informal step — before any formal case. When a performance or conduct problem first appears, counsel the employee and log it here.',
      'Record what the issue was, what was discussed, and the outcome: Resolved (no further action), Verbal admonishment (oral warning kept on file), or Escalate to a formal case.',
      'Escalating carries the counselling notes into the new case, and can include more than one offence — each with its own range and recommendation. HR, Executives and the CEO can see this log.',
      'The record is kept on the employee’s file: if the same employee reoffends, the earlier counselling is flagged when you raise a new case, supporting escalation.',
    ],
  },
  'counsel-log': {
    title: 'How the Counselling Log works',
    role: 'hr',
    points: [
      'Every informal counselling recorded by line managers, before it becomes (or instead of becoming) a formal case.',
      'Shows the issue, what was discussed, the outcome, and whether it was escalated to a case.',
      'Read-only oversight — it confirms that problems are being counselled and managed early across the company.',
    ],
  },
  'exec-counsel': {
    title: 'How Portfolio Counselling works',
    role: 'exec',
    points: [
      'The informal counselling records for employees in your portfolio, before formal cases.',
      'Lets you see that line managers are addressing issues early, and which ones escalated.',
      'Read-only oversight view.',
    ],
  },
  'exec-portfolio': {
    title: 'How My Portfolio works',
    role: 'exec',
    points: [
      'Your portfolio is the set of departments under you. It lists the line managers and staff you oversee, from the HR structure.',
      'Structure: Staff → Line Manager → Executive Member (you). You see the disciplinary standing of everyone in your portfolio.',
      'This is a read-only oversight view — you monitor, HR and the CEO act.',
    ],
  },
  'exec-appraisals': {
    title: 'How Portfolio Appraisals works',
    role: 'exec',
    points: [
      'The appraisal status of every employee in your portfolio, by quarter — Pending, Submitted to CEO, With HR, or CEO Approved.',
      'Lets you see at a glance who still needs a completed appraisal this quarter.',
      'Appraisal data comes from the STIP system; this is a read-only oversight view.',
    ],
  },
  'exec-discipline': {
    title: 'How Portfolio Discipline works',
    role: 'exec',
    points: [
      'Every disciplinary case for employees in your portfolio departments — live from the shared case data.',
      'Filter by status to see open, awaiting-response, under-appeal or closed cases across your teams.',
      'You cannot edit cases here; this view is for oversight and reporting up the chain.',
    ],
  },
  setup: {
    title: 'How System Setup works',
    role: 'ict',
    points: [
      'One-time configuration by ICT: the Table of Charges, employees, role permissions, working-day timers and audit logging.',
      'Once set up, Line Managers can raise cases, HR reviews and decides, Staff respond, and the CEO rules on appeals.',
      'Every action is written to the Audit Log for governance.',
    ],
  },
  'lm-queue': {
    title: 'How My Team works',
    role: 'lm',
    points: [
      'Shows the cases you have drafted or submitted. Counsel the employee first — a formal case is a last resort.',
      'Drafts can be edited, submitted to HR or deleted. Once submitted, the case moves to HR and you can track its status.',
    ],
  },
  'lm-raise': {
    title: 'How Raise a Case works',
    role: 'lm',
    points: [
      'Pick the employee and offence — the system checks history and shows the 1st/2nd/3rd occurrence and matching penalty range.',
      'Your recommended action must sit inside that range. Record the statement of facts, then submit to HR (or save as a draft).',
      'A single incident can involve several offences — use “+ Add offence” to add each one; every offence has its own range and recommended action. You can also attach supporting documents or evidence.',
      'Employees with an open case show a red flag in the dropdown. When selected, you see their open and past cases (with “View history”) so you can avoid duplicates.',
      'If the employee has no counselling on file and the case isn’t serious, a reminder suggests counselling first. For a serious offence, tick “Serious offence” and raise it directly.',
      'Warnings have an active window — a written warning counts for 3 months, a suspension/final warning for 6 months. After that with no new case, it expires and the slate is wiped clean (it no longer counts toward occurrence).',
    ],
  },
  'hr-queue': {
    title: 'How the HR Queue works',
    role: 'hr',
    points: [
      'Cases needing HR action, in order: review & issue the official notice → record the employee response → record the decision.',
      'Each case shows how many working days are left to respond. If the 5 days pass with no response, use “Proceed without response” to move to decision.',
      'Issuing the notice starts the 5 working-day response window. The final decision must stay within the offence range. For sufficiently serious conduct (theft, dishonesty, deliberate unsafe acts, serious safety breaches, violence or criminal conduct), management may proceed directly to termination without progressive steps, provided the employee was given an opportunity to respond where practicable.',
      'For serious cases, after investigation you can Forward to CEO (CEO decides) or Forward to SMT (SMT recommends, then CEO decides) — in both, the CEO takes the final decision and closes the case.',
      'The SMT has several members — when forwarding to SMT, pick which member should handle the case from the dropdown.',
      'When you forward a case you must give HR’s recommended action and the reason for it — a recommendation is mandatory and travels with the case to the SMT and the CEO.',
      'Use the Letter button to generate a formal disciplinary notice, and (once a case is closed, in All Cases) the Personnel Action Form for payroll — both auto-filled and printable.',
      'On a closed case, use the PAF button to generate a Personnel Action Form that actions the decision in payroll.',
      'For a serious case, you can activate a Jury of Peers (impartial panel) to give an independent finding and recommendation — advisory to the final decision.',
    ],
  },
  'staff-notices': {
    title: 'How My Notices works',
    role: 'staff',
    points: [
      'Official notices addressed to employees. Respond within 5 working days, giving your side and any mitigating reasons.',
      'Your response is considered before management makes its decision — it is an opportunity to give your account, not an appeal after a decision.',
    ],
  },

  dash: {
    title: 'How the Dashboard works',
    role: 'ict',
    points: [
      'Gives a live, company-wide picture of every disciplinary case — open, awaiting response, under appeal and closed.',
      '“Cases by category” shows where issues arise most (Attendance, Safety, Conduct, etc.), so patterns can be spotted early.',
      'Discipline is always a last resort: supervisors counsel employees first, and only raise a formal case if counselling does not resolve the problem.',
    ],
  },
  cases: {
    title: 'How the Cases panel works',
    role: 'lm',
    points: [
      'Raise a case: pick the employee and offence — the system checks history and shows if it is the 1st, 2nd or 3rd occurrence and the matching penalty range.',
      'The recommended action must sit inside that range. The case then moves through the workflow: HR review → 5-day response → decision → optional 10-day appeal → CEO ruling.',
      'You can edit or delete a case, and use the action button on each row to move it to the next step. Every change is saved.',
    ],
  },
  charges: {
    title: 'How the Table of Charges works',
    role: 'hr',
    points: [
      'The 40 recognised offences and the penalty range for each occurrence (1st / 2nd / 3rd), exactly as in the FSMPC disciplinary policy.',
      'Codes: A = Admonishment (verbal warning), R = Written warning, S# = # working-day suspension without pay (e.g. S10), D = Dismissal.',
      'A range like “R → S3” means the penalty may fall anywhere from a written warning up to a 3-day suspension. Offences can be added, edited or removed here by an administrator.',
    ],
  },
  report: {
    title: 'How the CEO Report works',
    role: 'ceo',
    points: [
      'A weekly summary of all disciplinary activity for the CEO’s Toolbox meeting — confirming conduct is managed fairly and consistently across every department.',
      'Shows open and recently closed cases, cases under appeal, and any dismissals.',
      'The CEO (or an independent tribunal of peers) is the final arbiter on any appeal — that decision is final.',
    ],
  },
  employees: {
    title: 'How the Employees panel works',
    role: 'ict',
    points: [
      'The staff directory the disciplinary system draws on — name, title, department and supervisor.',
      'Add, edit or remove employees here. The supervisor field determines who counsels and raises cases for that person.',
      'Occurrence counting is per employee and per offence, based on their closed case history.',
    ],
  },
};

/* Role-based navigation: each role sees only its own panels in the loop. */
export const ROLE_NAV = {
  ict:   [ {id:'setup',label:'System Setup',icon:'⚙️'}, {id:'charges',label:'Table of Charges',icon:'⚖️'}, {id:'ict-settings',label:'Settings',icon:'🛠️'}, {id:'audit',label:'Audit Log',icon:'🧾'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  lm:    [ {id:'lm-queue',label:'My Team',icon:'👤'}, {id:'lm-counsel',label:'Counselling',icon:'💬'}, {id:'lm-raise',label:'Raise a Case',icon:'➕'}, {id:'charges',label:'Table of Charges',icon:'⚖️'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  hr:    [ {id:'hr-queue',label:'HR Queue',icon:'📥'}, {id:'hr-all',label:'All Cases',icon:'📁'}, {id:'counsel-log',label:'Counselling Log',icon:'💬'}, {id:'charges',label:'Table of Charges',icon:'⚖️'}, {id:'report',label:'Weekly CEO Report',icon:'📋'}, {id:'hr-settings',label:'Settings',icon:'🛠️'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  staff: [ {id:'staff-notices',label:'My Notices',icon:'✉️'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  ceo:   [ {id:'ceo-referrals',label:'Referrals',icon:'📨'}, {id:'charges',label:'Table of Charges',icon:'⚖️'}, {id:'ceo-reinstate',label:'Re-instatement',icon:'♻️'}, {id:'report',label:'Weekly Report',icon:'📋'}, {id:'counsel-log',label:'Counselling Log',icon:'💬'}, {id:'audit',label:'Audit Log',icon:'🧾'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  smt:   [ {id:'smt-queue',label:'SMT Referrals',icon:'🏛️'}, {id:'smt-decided',label:'Recommended',icon:'✅'}, {id:'charges',label:'Table of Charges',icon:'⚖️'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
  exec:  [ {id:'exec-portfolio',label:'My Portfolio',icon:'🗂️'}, {id:'exec-appraisals',label:'Portfolio Appraisals',icon:'📈'}, {id:'exec-counsel',label:'Portfolio Counselling',icon:'💬'}, {id:'exec-discipline',label:'Portfolio Discipline',icon:'⚖️'}, {id:'howto',label:'How it works',icon:'ℹ️'} ],
};

export const ROLE_ORDER = ['lm','hr','staff','exec','smt','ceo','ict'];
