/* Newborn hearing screening follow-up on the EHDI 1-3-6 timeline: screen by 1 month,
   diagnose by 3 months, begin intervention by 6 months. The next step and its due date are
   worked out from the baby's record; JCIH risk factors add a monitoring review. */

export const RISKS = [
  "Family history of permanent childhood hearing loss", "NICU stay of more than 5 days", "Jaundice needing exchange transfusion",
  "Aminoglycosides for more than 5 days", "Birth asphyxia or HIE", "ECMO",
  "Infection in pregnancy (CMV, rubella, herpes, syphilis, toxoplasmosis)", "Craniofacial anomaly, ear tags or ear pits, cleft lip or palate",
  "Syndrome associated with hearing loss", "Bacterial meningitis or other serious infection after birth", "Significant head injury", "Chemotherapy"
];

export type Lang = "en" | "kn" | "te" | "hi";
export interface Screen { date: string; method: string; R: "pass" | "refer"; L: "pass" | "refer" }
export interface Baby {
  id: string; code: string; dob: string; lang: Lang; risk: number[]; screens: Screen[];
  diag: { result: "normal" | "loss"; date: string } | null;
  interv: { date: string } | null;
  review: { date: string } | null;
}

const DAY = 864e5;
export const addDays = (iso: string, n: number): string => new Date(new Date(iso).getTime() + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string): number => Math.round((new Date(b).getTime() - new Date(a).getTime()) / DAY);

export type StepKey = "screen" | "rescreen" | "diag" | "interv" | "monitor" | "done";
export interface NextStep { key: StepKey; label: string; due: string | null; stage: 1 | 2 | 3; steps: { screen: boolean; diag: boolean; interv: boolean } }

/** The single next action for a baby, with its target date on the 1-3-6 timeline. */
export function nextStep(b: Baby, _today?: string): NextStep {
  const scr = [...b.screens].sort((x, y) => x.date.localeCompare(y.date));
  const last = scr.at(-1);
  const steps = { screen: false, diag: false, interv: false };
  if (b.interv) { steps.screen = steps.diag = steps.interv = true; return { key: "done", label: "In intervention", due: null, stage: 3, steps }; }
  if (b.diag) {
    steps.screen = steps.diag = true;
    if (b.diag.result === "normal") {
      if (b.risk.length && !b.review) return { key: "monitor", label: "Monitoring review", due: addDays(b.dob, 270), stage: 3, steps };
      return { key: "done", label: b.review ? "Monitoring done" : "Hearing normal", due: null, stage: 3, steps };
    }
    return { key: "interv", label: "Start intervention", due: addDays(b.dob, 180), stage: 3, steps };
  }
  if (!last) return { key: "screen", label: "Screen", due: addDays(b.dob, 30), stage: 1, steps };
  const refer = last.R === "refer" || last.L === "refer";
  if (!refer) {
    steps.screen = true;
    if (b.risk.length && !b.review) return { key: "monitor", label: "Monitoring review", due: addDays(b.dob, 270), stage: 3, steps };
    return { key: "done", label: "Passed", due: null, stage: 1, steps };
  }
  if (scr.length < 2) return { key: "rescreen", label: "Rescreen", due: addDays(last.date, 14), stage: 1, steps };
  steps.screen = true;
  return { key: "diag", label: "Diagnostic ABR", due: addDays(b.dob, 90), stage: 2, steps };
}

export type UrgencyKey = "done" | "overdue" | "soon" | "ontrack";
export interface Urgency { k: UrgencyKey; tone: "ok" | "high" | "mid" | "info"; text: string }
export function urgency(n: NextStep, today: string): Urgency {
  if (n.key === "done" || !n.due) return { k: "done", tone: "ok", text: "Done" };
  const d = daysBetween(today, n.due);
  if (d < 0) return { k: "overdue", tone: "high", text: `Overdue by ${-d} day${d === -1 ? "" : "s"}` };
  if (d <= 14) return { k: "soon", tone: "mid", text: d === 0 ? "Due today" : `Due in ${d} day${d === 1 ? "" : "s"}` };
  return { k: "ontrack", tone: "info", text: "On track" };
}

export const ageText = (dob: string, today: string): string => {
  const d = daysBetween(dob, today);
  return d < 60 ? `${d} d` : `${Math.floor(d / 30.4)} mo`;
};
