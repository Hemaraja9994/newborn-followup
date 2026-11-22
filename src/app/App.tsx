/* Newborn Hearing Follow-up: track each baby on the 1-3-6 timeline, see what is overdue, record
   screens, diagnosis, intervention and monitoring, and send a reminder to the family in their
   own language. On-device. */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Baby as BabyIcon, ListChecks, Share2 } from "lucide-react";
import { AppShell, type Section } from "@/shell/AppShell";
import { Button, Callout, Check, Empty, Field, Input, Panel, Pill, Select, cx } from "@/shell/ui";
import { References } from "@/shell/References";
import { usePersistent } from "@/shell/storage";
import { toast } from "@/shell/toast";
import { downloadCSV, fmtDate, shareText, todayISO, uid } from "@/shell/lib";
import { RISKS, ageText, nextStep, urgency, type Baby, type Lang, type NextStep, type Urgency } from "./ehdi";
import { reminder } from "./messages";
import { LANG_NAMES } from "./strings";
import refs from "./refs.json";

const LANGS: Lang[] = ["en", "kn", "te", "hi"];
const FILTERS = [["overdue", "Overdue", "high"], ["soon", "Due in 2 weeks", "mid"], ["ontrack", "On track", "info"], ["done", "Done", "ok"]] as const;
const order: Record<string, number> = { overdue: 0, soon: 1, ontrack: 2, done: 3 };

export default function App() {
  const { t } = useTranslation();
  const today = todayISO();
  const [babies, setBabies] = usePersistent<Baby[]>("nhs-babies", []);
  const [view, setView] = useState("dash");
  const [selId, setSelId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState({ code: "", dob: "", lang: "en" as Lang, risk: [] as number[] });
  const [err, setErr] = useState("");

  const rows = useMemo(() => babies.map(b => { const n = nextStep(b, today); return { b, n, u: urgency(n, today) }; }), [babies, today]);
  const counts = (k: string) => rows.filter(r => r.u.k === k).length;
  const list = rows.filter(r => filter === "all" || r.u.k === filter).sort((a, b) => order[a.u.k] - order[b.u.k] || (a.n.due ?? "9").localeCompare(b.n.due ?? "9"));

  const sections: Section[] = [{ id: "dash", label: "Dashboard", icon: ListChecks }, { id: "add", label: "Add baby", icon: BabyIcon }];
  const go = (id: string) => { setView(id); window.scrollTo({ top: 0 }); };
  const open = (id: string) => { setSelId(id); setView("detail"); window.scrollTo({ top: 0 }); };

  const addBaby = () => {
    const code = form.code.trim();
    if (!code || !form.dob) { setErr("Enter a baby code and date of birth."); return; }
    if (form.dob > today) { setErr("Date of birth cannot be in the future."); return; }
    setErr(""); const id = uid();
    setBabies(bs => [...bs, { id, code, dob: form.dob, lang: form.lang, risk: form.risk, screens: [], diag: null, interv: null, review: null }]);
    setForm({ code: "", dob: "", lang: "en", risk: [] }); open(id); toast("Baby added");
  };
  const csv = () => {
    const out: (string | number)[][] = [["baby_code", "dob", "family_language", "risk_factors", "screens", "diagnosis", "diagnosis_date", "intervention_date", "review_date", "next_step", "next_due", "status"]];
    babies.forEach(b => { const n = nextStep(b, today), u = urgency(n, today);
      out.push([b.code, b.dob, b.lang, b.risk.map(i => RISKS[i]).join("; "), b.screens.map(s => `${s.date} ${s.method} R-${s.R} L-${s.L}`).join("; "), b.diag?.result ?? "", b.diag?.date ?? "", b.interv?.date ?? "", b.review?.date ?? "", n.label, n.due ?? "", u.text]); });
    downloadCSV(out, `newborn-hearing-followup-${today}.csv`);
  };

  return (
    <AppShell title={t("appName")} subtitle={t("appSub")} sections={view === "detail" ? undefined : sections} active={view} onSection={go}
      footer={<><p className="m-0">{t("disclaimer")}</p><p className="m-0">Benchmarks: JCIH 2019. Screen by 1 month, diagnose by 3, intervene by 6.</p></>}>

      {view === "dash" && (
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FILTERS.map(([k, label, tone]) => (
              <button key={k} type="button" onClick={() => setFilter(filter === k ? "all" : k)} aria-pressed={filter === k}
                className={cx("flex min-h-16 flex-col items-center justify-center rounded-xl border-2 bg-surface", filter === k ? "border-ink" : "border-line",
                  tone === "high" && "text-high", tone === "mid" && "text-mid", tone === "info" && "text-accent", tone === "ok" && "text-ok")}>
                <b className="text-2xl tabular-nums">{counts(k)}</b><span className="text-[0.78rem] font-semibold text-ink">{label}</span></button>
            ))}
          </div>
          <Panel title={filter === "all" ? `Babies (${babies.length})` : `${FILTERS.find(f => f[0] === filter)?.[1]}`} action={babies.length ? <Button size="sm" onClick={csv}>CSV</Button> : undefined}>
            {list.length === 0 ? <Empty>{babies.length ? "No babies in this group." : "No babies yet. Add the first one."}</Empty> : (
              <ul className="m-0 grid list-none gap-2 p-0">
                {list.map(({ b, n, u }) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => open(b.id)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-lg border border-line bg-paper px-3 py-2 text-left hover:bg-surface">
                      <span className="min-w-0"><b>{b.code}</b>{b.risk.length > 0 && <> <Pill tone="mid">Risk</Pill></>}<br />
                        <span className="text-[0.82rem] text-muted">{ageText(b.dob, today)} · {n.label}</span></span>
                      <StepDots n={n} /><Pill tone={u.tone}>{u.text}</Pill></button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <References refs={refs} contextQuery={rows.some(r => r.u.k === "overdue") ? "loss to follow-up tracking 1-3-6" : "1-3-6 timeline early intervention"} contextLabel="Why the timeline matters" />
        </div>
      )}

      {view === "add" && (
        <Panel title="Add a baby">
          <Field label="Baby code" hint="Use a code, not a name.">{id => <Input id={id} value={form.code} maxLength={30} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />}</Field>
          <Field label="Date of birth">{id => <Input id={id} type="date" value={form.dob} max={today} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />}</Field>
          <Field label="Family's language (for reminders)">{id => <Select id={id} value={form.lang} onChange={e => setForm(f => ({ ...f, lang: e.target.value as Lang }))}>{LANGS.map(l => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}</Select>}</Field>
          <fieldset className="mt-3 border-0 p-0"><legend className="text-[0.92rem] font-bold">Risk factors (JCIH)</legend>
            <div className="mt-1 grid gap-0 sm:grid-cols-2">{RISKS.map((r, i) => <Check key={i} checked={form.risk.includes(i)} onChange={v => setForm(f => ({ ...f, risk: v ? [...f.risk, i] : f.risk.filter(x => x !== i) }))}>{r}</Check>)}</div>
          </fieldset>
          {err && <p role="alert" className="m-0 mt-2 font-semibold text-high">{err}</p>}
          <div className="mt-4"><Button variant="primary" onClick={addBaby}>Add baby</Button></div>
        </Panel>
      )}

      {view === "detail" && selId && babies.find(b => b.id === selId) && (
        <BabyDetail baby={babies.find(b => b.id === selId)!} today={today} onBack={() => go("dash")}
          onChange={u => setBabies(bs => bs.map(b => b.id === selId ? u(b) : b))}
          onDelete={() => { setBabies(bs => bs.filter(b => b.id !== selId)); setSelId(null); go("dash"); toast("Deleted"); }} />
      )}
    </AppShell>
  );
}

function StepDots({ n }: { n: NextStep }) {
  return <span className="flex gap-1" aria-hidden>
    {(["screen", "diag", "interv"] as const).map((s, i) => (
      <i key={s} className={cx("h-2 w-2 rounded-full", n.steps[s] ? "bg-ok" : n.stage === i + 1 && n.key !== "done" ? "bg-accent" : "bg-track")} />
    ))}</span>;
}

function BabyDetail({ baby: b, today, onChange, onDelete, onBack }: { baby: Baby; today: string; onChange: (u: (b: Baby) => Baby) => void; onDelete: () => void; onBack: () => void }) {
  const n = nextStep(b, today), u: Urgency = urgency(n, today);
  const msg = n.key !== "done" ? reminder(b, n, today) : "";
  const scr = [...b.screens].sort((x, y) => x.date.localeCompare(y.date));
  const [sForm, setSForm] = useState({ date: today, method: "OAE", R: "pass" as "pass" | "refer", L: "pass" as "pass" | "refer" });
  const [dRes, setDRes] = useState(b.diag?.result ?? "");
  const [dDate, setDDate] = useState(b.diag?.date ?? "");
  const [iDate, setIDate] = useState(b.interv?.date ?? "");
  const [rDate, setRDate] = useState(b.review?.date ?? "");
  const [confirmDel, setConfirmDel] = useState(false);

  const addScreen = () => { onChange(p => ({ ...p, screens: [...p.screens, { ...sForm }] })); toast("Screen saved"); };
  const saveDiag = () => {
    onChange(p => ({ ...p, diag: dRes ? { result: dRes as "normal" | "loss", date: dDate || today } : null, interv: iDate ? { date: iDate } : null, review: rDate ? { date: rDate } : null }));
    toast("Saved");
  };
  const sendMsg = async () => { const r = await shareText(msg); toast(r === "shared" ? "Shared" : r === "copied" ? "Copied. Paste it into WhatsApp or SMS." : "Could not share. Select the text and copy it."); };

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-2">
        <Button size="sm" variant="quiet" onClick={onBack}>← Dashboard</Button>
        <Button size="sm" variant="danger" onClick={() => { if (!confirmDel) { setConfirmDel(true); return; } onDelete(); }}>{confirmDel ? "Confirm delete" : "Delete baby"}</Button>
      </div>

      <Panel title={b.code} action={<Pill tone={u.tone}>{u.text}</Pill>}>
        <p className="m-0 text-[0.88rem] text-muted">Born {fmtDate(b.dob)} · {ageText(b.dob, today)} · reminders in {LANG_NAMES[b.lang]}.{b.risk.length > 0 && ` Risk: ${b.risk.map(i => RISKS[i]).join("; ")}.`}</p>
        <p className="m-0 mt-2 text-[1.05rem]"><b>Next step:</b> {n.label}</p>
        {msg && <>
          <h3 className="mt-4 text-base font-bold">Reminder for the family</h3>
          <div lang={b.lang} className="mt-1 rounded-lg border border-line bg-paper p-3 text-[0.98rem]">{msg}</div>
          <div className="mt-2"><Button onClick={sendMsg}><Share2 className="h-4 w-4" aria-hidden />Share / copy</Button></div>
        </>}
      </Panel>

      <Panel title="Screens">
        {scr.length === 0 ? <Empty>No screens yet.</Empty> : (
          <ul className="m-0 grid list-none gap-1.5 p-0">{scr.map((s, i) => (
            <li key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-line bg-paper px-3 py-2 text-[0.92rem]">
              <b className="tabular-nums">{fmtDate(s.date)}</b><span className="text-muted">{s.method}</span>
              <span>R: {s.R === "refer" ? <Pill tone="high">Refer</Pill> : <Pill tone="ok">Pass</Pill>}</span>
              <span>L: {s.L === "refer" ? <Pill tone="high">Refer</Pill> : <Pill tone="ok">Pass</Pill>}</span></li>))}</ul>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Date" className="mt-0">{id => <Input id={id} type="date" value={sForm.date} max={today} onChange={e => setSForm(f => ({ ...f, date: e.target.value }))} />}</Field>
          <Field label="Method" className="mt-0">{id => <Select id={id} value={sForm.method} onChange={e => setSForm(f => ({ ...f, method: e.target.value }))}><option>OAE</option><option>AABR</option></Select>}</Field>
          <Field label="Right ear" className="mt-0">{id => <Select id={id} value={sForm.R} onChange={e => setSForm(f => ({ ...f, R: e.target.value as "pass" | "refer" }))}><option value="pass">Pass</option><option value="refer">Refer</option></Select>}</Field>
          <Field label="Left ear" className="mt-0">{id => <Select id={id} value={sForm.L} onChange={e => setSForm(f => ({ ...f, L: e.target.value as "pass" | "refer" }))}><option value="pass">Pass</option><option value="refer">Refer</option></Select>}</Field>
        </div>
        <div className="mt-3"><Button onClick={addScreen}>Save screen</Button></div>
      </Panel>

      <Panel title="Diagnosis, intervention and review">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Diagnostic evaluation" className="mt-0">{id => <Select id={id} value={dRes} onChange={e => setDRes(e.target.value)}><option value="">Not done</option><option value="normal">Hearing normal</option><option value="loss">Hearing loss confirmed</option></Select>}</Field>
          <Field label="Diagnosis date" className="mt-0">{id => <Input id={id} type="date" value={dDate} max={today} onChange={e => setDDate(e.target.value)} />}</Field>
          <Field label="Intervention started" className="mt-0">{id => <Input id={id} type="date" value={iDate} max={today} onChange={e => setIDate(e.target.value)} />}</Field>
          <Field label="Monitoring review done" className="mt-0">{id => <Input id={id} type="date" value={rDate} max={today} onChange={e => setRDate(e.target.value)} />}</Field>
        </div>
        <div className="mt-3"><Button variant="primary" onClick={saveDiag}>Save</Button></div>
      </Panel>

      {n.key === "diag" && <Callout tone="mid">This baby referred twice and is due a diagnostic ABR by 3 months. Reaching the family now prevents loss to follow-up.</Callout>}
    </div>
  );
}
