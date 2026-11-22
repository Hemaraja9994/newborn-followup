import { describe, expect, it } from "vitest";
import { addDays, nextStep, urgency, type Baby, type Screen } from "./ehdi";

const baby = (over: Partial<Baby>): Baby => ({ id: "1", code: "B1", dob: "2026-10-01", lang: "en", risk: [], screens: [], diag: null, interv: null, review: null, ...over });
const scr = (date: string, R: "pass" | "refer", L: "pass" | "refer" = R): Screen => ({ date, method: "OAE", R, L });

describe("next step on the 1-3-6 timeline", () => {
  const today = "2026-10-20";
  it("needs a screen when none done, due one month after birth", () => {
    const n = nextStep(baby({}), today);
    expect(n.key).toBe("screen"); expect(n.due).toBe(addDays("2026-10-01", 30));
  });
  it("passes a clear screen with no risk", () => expect(nextStep(baby({ screens: [scr("2026-10-10", "pass")] }), today).key).toBe("done"));
  it("asks for a rescreen after a single refer", () => {
    const n = nextStep(baby({ screens: [scr("2026-10-10", "refer")] }), today);
    expect(n.key).toBe("rescreen"); expect(n.due).toBe(addDays("2026-10-10", 14));
  });
  it("moves to diagnostic ABR after two refers, due by three months", () => {
    const n = nextStep(baby({ screens: [scr("2026-10-10", "refer"), scr("2026-10-20", "refer")] }), today);
    expect(n.key).toBe("diag"); expect(n.due).toBe(addDays("2026-10-01", 90));
  });
  it("starts intervention when loss is confirmed, due by six months", () => {
    const n = nextStep(baby({ screens: [scr("2026-10-10", "refer"), scr("2026-10-20", "refer")], diag: { result: "loss", date: "2026-11-15" } }), today);
    expect(n.key).toBe("interv"); expect(n.due).toBe(addDays("2026-10-01", 180));
  });
  it("is done once intervention has started", () => expect(nextStep(baby({ interv: { date: "2026-12-01" } }), today).key).toBe("done"));
  it("adds a monitoring review for a passed baby with a risk factor", () => {
    const n = nextStep(baby({ risk: [0], screens: [scr("2026-10-10", "pass")] }), today);
    expect(n.key).toBe("monitor"); expect(n.due).toBe(addDays("2026-10-01", 270));
  });
  it("closes monitoring once the review is recorded", () => expect(nextStep(baby({ risk: [0], screens: [scr("2026-10-10", "pass")], review: { date: "2027-07-01" } }), today).key).toBe("done"));
});

describe("urgency", () => {
  it("marks an overdue step", () => expect(urgency(nextStep(baby({ dob: "2026-08-01" }), "2026-10-20"), "2026-10-20").k).toBe("overdue"));
  it("marks a step due within two weeks", () => expect(urgency({ key: "screen", label: "", due: "2026-10-25", stage: 1, steps: { screen: false, diag: false, interv: false } }, "2026-10-20").k).toBe("soon"));
  it("marks a far-off step on track", () => expect(urgency({ key: "diag", label: "", due: "2026-12-25", stage: 2, steps: { screen: true, diag: false, interv: false } }, "2026-10-20").k).toBe("ontrack"));
});
