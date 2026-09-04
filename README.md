# FSMPC Disciplinary Management

React + Vite app implementing the FSMPC disciplinary loop across all five role panels.

## Run
```
npm install
npm run dev      # development
npm run build    # production -> dist/
npm run preview
```

## Role panels (switch role from the bar at the top)
- **Line Manager** — My Team queue; Raise a Case (occurrence & penalty range auto-checked); save draft or submit to HR.
- **HR Manager** — HR Queue (issue notice → record response → record decision, in order); All Cases; editable Table of Charges; Weekly CEO Report.
- **Staff** — My Notices; respond within 5 working days; appeal within 10 working days.
- **Executive Member** — My Portfolio, Portfolio Appraisals (appraisal status per quarter), and Portfolio Discipline: sees only the staff, appraisal statuses and disciplinary cases in their department portfolio (oversight, read-only). Pick which executive from the selector. (Appraisal status is sample data here; in production it comes from the STIP system.)
- **SMT (Senior Management Team)** — has several named members; when forwarding to SMT, HR selects which member handles the case. The SMT reviews cases HR forwards to it and recommends an action to the CEO (within the offence range), with rationale.
- **CEO** — Re-instatement (re-establish a previously terminated employee back into payroll, with reason + effective date); Referrals (decides cases HR forwarded directly, or that came via the SMT with a recommendation); Appeals (final ruling); Weekly Report; Audit Log.
- **ICT Admin** — System Setup; Table of Charges (add/edit/delete); Employees (add/edit/delete); Audit Log.

All five panels share ONE dataset: a case raised by the Line Manager appears in
HR's queue, then Staff's notices, then (on appeal) the CEO — and every action is
written to the Audit Log. Each panel also has its own guide banner, plus the full
step-by-step "How it works" walkthrough.

## Data
Cases, employees, charges and the audit log are saved to the browser's
localStorage in this review build; the production app persists to MongoDB via the
API (see src/lib/store.js — the functions there map 1:1 to API calls). Use
"Reset sample data" to restore the seed set.

## Cross-check
All 40 offences and their 1st/2nd/3rd penalty ranges were verified against the
FSMPC Offences & Rules document.
