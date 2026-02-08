"use client";

import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FormState = {
  moldId: string;
  complexity: string;
  size: string;
  sideActions: string;
  runnerType: string;
  maintenanceIntervalDays: string;
  minorRepairsCount: string;
  plasticType: string;
  cycleTimeSeconds: string;
  hoursPerDay: string;
  totalCycles: string;
  anticipatedRunTimeDays: string;
  cyclesSinceOverhaul: string;
};

type PredictionResult = {
  status: number;
  data: unknown;
};


const PLASTIC_OPTIONS = [
  "ABS",
  "Acetal (POM)",
  "Acrylic (PMMA)",
  "HDPE",
  "LDPE",
  "Nylon 6",
  "Nylon 6/6",
  "PC/ABS",
  "Polycarbonate (PC)",
  "Polypropylene (PP)",
  "Polystyrene (PS)",
  "PVC",
  "TPU",
  "Other",
];

const toNumber = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const buildPredictBody = (formState: FormState) => {
  const moldId = formState.moldId.trim();
  return {
    model_id: "xgb_v1",
    mold_id: moldId,
    production: {
      date: null,
      cycle_time_seconds: toNumber(formState.cycleTimeSeconds, 0),
      hours_per_day: toNumber(formState.hoursPerDay, 0),
      maintenance_interval_days: toNumber(
        formState.maintenanceIntervalDays,
        0
      ),
      total_cycles: toNumber(formState.totalCycles, 0),
      cycles_since_overhaul: toNumber(
        formState.cyclesSinceOverhaul,
        0
      ),
      minor_repairs_count: toNumber(formState.minorRepairsCount, 0),
    },
    mold_details: {
      mold_id: moldId,
      complexity: formState.complexity,
      size: formState.size,
      plastic_type: formState.plasticType,
      side_actions: formState.sideActions,
      runner_type: formState.runnerType,
    },
  };
};

const getPredictionField = (data: unknown) => {
  if (data && typeof data === "object" && "prediction" in data) {
    return (data as Record<string, unknown>).prediction;
  }
  return null;
};

const findValueByKeys = (
  source: unknown,
  keys: string[]
): unknown => {
  if (!source || typeof source !== "object") {
    return null;
  }
  if (Array.isArray(source)) {
    for (const item of source) {
      const found = findValueByKeys(item, keys);
      if (found !== null && found !== undefined) {
        return found;
      }
    }
    return null;
  }

  const record = source as Record<string, unknown>;
  for (const key of keys) {
    if (key in record) {
      const value = record[key];
      if (
        typeof value === "string" ||
        typeof value === "number"
      ) {
        return value;
      }
      const nested = findValueByKeys(value, keys);
      if (nested !== null && nested !== undefined) {
        return nested;
      }
    }
  }

  for (const value of Object.values(record)) {
    const found = findValueByKeys(value, keys);
    if (found !== null && found !== undefined) {
      return found;
    }
  }

  return null;
};

const pickFirstNumber = (source: unknown, keys: string[]) => {
  const value = findValueByKeys(source, keys);
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const pickFirstString = (source: unknown, keys: string[]) => {
  const value = findValueByKeys(source, keys);
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  return null;
};

const getRiskTone = (riskText: string | null) => {
  if (!riskText) {
    return "bg-slate-200 text-slate-700";
  }
  const normalized = riskText.toLowerCase();
  if (normalized.includes("high") || normalized.includes("critical")) {
    return "bg-rose-100 text-rose-700";
  }
  if (normalized.includes("medium")) {
    return "bg-amber-100 text-amber-700";
  }
  if (normalized.includes("low") || normalized.includes("safe")) {
    return "bg-emerald-100 text-emerald-700";
  }
  return "bg-slate-200 text-slate-700";
};

export default function DemoClient() {
  const [formState, setFormState] = useState<FormState>({
    moldId: "",
    complexity: "simple",
    size: "small",
    sideActions: "none",
    runnerType: "hot_runner",
    maintenanceIntervalDays: "30",
    minorRepairsCount: "0",
    plasticType: "ABS",
    cycleTimeSeconds: "",
    hoursPerDay: "8",
    totalCycles: "",
    anticipatedRunTimeDays: "",
    cyclesSinceOverhaul: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("Run prediction");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [reportEmail, setReportEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const supabase = useMemo(
    () => createSupabaseBrowserClient(),
    []
  );

  useEffect(() => {
    fetch("/api/health")
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          setHealthStatus("Server is warm.");
          return;
        }
        setHealthStatus(payload?.error ?? "Server unavailable.");
      })
      .catch(() => {
        setHealthStatus("Server unavailable.");
      });
  }, []);

  const predictionValue = getPredictionField(result?.data ?? null);
  const predictedDays = pickFirstNumber(predictionValue ?? result?.data, [
    "days",
    "predicted_days",
    "predicted_runtime_days",
    "predicted_run_days",
    "runtime_days",
    "days_to_failure",
    "time_to_failure_days",
    "estimated_time_to_repair_days",
  ]);
  const predictedCost = pickFirstNumber(predictionValue ?? result?.data, [
    "cost",
    "predicted_cost",
    "estimated_cost",
    "repair_cost",
    "maintenance_cost",
    "estimated_repair_cost_usd",
  ]);
  const riskText = pickFirstString(predictionValue ?? result?.data, [
    "risk",
    "risk_level",
    "status",
  ]);

  const validationErrors = () => {
    const nextErrors: string[] = [];
    if (!formState.moldId.trim()) {
      nextErrors.push("Mold ID is required.");
    }
    if (toNumber(formState.cycleTimeSeconds, 0) <= 0) {
      nextErrors.push("Cycle time must be greater than 0.");
    }
    const hours = toNumber(formState.hoursPerDay, 0);
    if (hours < 0 || hours > 24) {
      nextErrors.push("Run hours per day must be between 0 and 24.");
    }
    if (toNumber(formState.maintenanceIntervalDays, 0) < 0) {
      nextErrors.push("Maintenance interval must be 0 or more.");
    }
    return nextErrors;
  };

  const handleMoldIdChange = (value: string) => {
    if (value.trim() === "") {
      setEmailSent(false);
      setShowEmailForm(false);
      setEmailStatus(null);
      setReportEmail("");
      setErrors([]);
      setResult(null);
    }
    setFormState((prev) => {
      if (prev.moldId && prev.moldId !== value) {
        setEmailSent(false);
        setShowEmailForm(false);
        setEmailStatus(null);
        setReportEmail("");
        setErrors([]);
        setResult(null);
        return {
          ...prev,
          moldId: value,
          complexity: "simple",
          size: "small",
          sideActions: "none",
          runnerType: "hot_runner",
          maintenanceIntervalDays: "30",
          minorRepairsCount: "0",
          plasticType: "ABS",
          cycleTimeSeconds: "",
          hoursPerDay: "8",
          totalCycles: "",
          anticipatedRunTimeDays: "",
          cyclesSinceOverhaul: "",
        };
      }
      return { ...prev, moldId: value };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validationErrors();
    setErrors(nextErrors);
    if (nextErrors.length) {
      return;
    }

    setIsRunning(true);
    setLoadingLabel("Running prediction...");
    setResult(null);

    let slowTimer: ReturnType<typeof setTimeout> | null = null;
    if (!hasRunOnce) {
      slowTimer = setTimeout(() => {
        setLoadingLabel("Warming up demo server...");
      }, 1200);
    }

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPredictBody(formState)),
        credentials: "include",
      });

      const payload = await response.json().catch(() => ({}));
      setResult({ status: response.status, data: payload?.data ?? payload });
      setHasRunOnce(true);
      if (!response.ok) {
        setErrors([
          payload?.error ??
            `Request failed with status ${response.status}.`,
        ]);
      }
    } catch (error) {
      setErrors(["Unable to reach the demo server."]);
    } finally {
      if (slowTimer) {
        clearTimeout(slowTimer);
      }
      setLoadingLabel("Run prediction");
      setIsRunning(false);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailStatus(null);
    setEmailError(null);

    if (!result?.data) {
      setEmailError("Run a prediction before emailing the report.");
      return;
    }

    setIsEmailSending(true);
    try {
      const response = await fetch("/api/email-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: reportEmail,
          reportData: result.data,
          moldId: formState.moldId,
          riskLabel,
          formData: {
            complexity: formState.complexity,
            size: formState.size,
            sideActions: formState.sideActions,
            runnerType: formState.runnerType,
            maintenanceIntervalDays: formState.maintenanceIntervalDays,
            minorRepairsCount: formState.minorRepairsCount,
            plasticType: formState.plasticType,
            cycleTimeSeconds: formState.cycleTimeSeconds,
            hoursPerDay: formState.hoursPerDay,
            totalCycles: formState.totalCycles,
            anticipatedRunTimeDays: formState.anticipatedRunTimeDays,
            cyclesSinceOverhaul: formState.cyclesSinceOverhaul,
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setEmailError(
          payload?.error ?? "Unable to send email report."
        );
        return;
      }

      setEmailStatus("Thanks! We will email your report soon.");
      setEmailSent(true);
      setShowEmailForm(false);
    } catch (error) {
      setEmailError("Unable to send email report.");
    } finally {
      setIsEmailSending(false);
    }
  };

  const anticipatedRunTime = toNumber(
    formState.anticipatedRunTimeDays,
    0
  );
  const riskMarker = (() => {
    if (
      anticipatedRunTime > 0 &&
      typeof predictedDays === "number" &&
      predictedDays > 0
    ) {
      const ratio = Math.min(
        Math.max(anticipatedRunTime / predictedDays, 0),
        1
      );
      return `${Math.round(ratio * 100)}%`;
    }
    if (riskText && riskText.toLowerCase().includes("high")) {
      return "75%";
    }
    if (riskText && riskText.toLowerCase().includes("medium")) {
      return "50%";
    }
    if (riskText && riskText.toLowerCase().includes("low")) {
      return "25%";
    }
    return "50%";
  })();

  const riskLabel = (() => {
    if (
      anticipatedRunTime > 0 &&
      typeof predictedDays === "number" &&
      predictedDays > 0
    ) {
      return anticipatedRunTime > predictedDays
        ? "Risky to run"
        : "Safe to run";
    }
    if (riskText) {
      const normalized = riskText.toLowerCase();
      if (normalized.includes("high") || normalized.includes("medium")) {
        return "Risky to run";
      }
      if (normalized.includes("low") || normalized.includes("safe")) {
        return "Safe to run";
      }
    }
    return "Risk level unknown";
  })();

  return (
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Predilytics MoldPredict
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              MoldPredict Console
            </h1>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (isDemoMode) {
                  return;
                }
                setIsMenuOpen((prev) => !prev);
              }}
              disabled={isDemoMode}
              aria-disabled={isDemoMode}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition ${
                isDemoMode
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              Account
              <span className="text-base">▾</span>
            </button>
            {isMenuOpen && !isDemoMode ? (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-xl">
                <div className="rounded-xl border border-slate-100 px-3 py-2 text-xs uppercase tracking-wide text-slate-400">
                  Account
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await supabase.auth.signOut();
                    window.location.href = "/login";
                  }}
                  className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Log out
                  <span className="text-base">→</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          {healthStatus ?? "Checking demo server availability..."}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div>
                <label
                  htmlFor="moldId"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Mold ID
                </label>
                <input
                  id="moldId"
                  name="moldId"
                  value={formState.moldId}
                  onChange={(event) => handleMoldIdChange(event.target.value)}
                  placeholder="MP-2041"
                  required
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Changing the Mold ID resets the rest of the form.
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Mold Data
                  </h3>
                  <div className="mt-4 grid gap-4">
                    <div>
                      <label
                        htmlFor="complexity"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Complexity
                      </label>
                      <select
                        id="complexity"
                        value={formState.complexity}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            complexity: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medium</option>
                        <option value="complex">Complex</option>
                        <option value="very_complex">Very complex</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="size"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Size
                      </label>
                      <select
                        id="size"
                        value={formState.size}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            size: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="small">Small (0-150T)</option>
                        <option value="medium">Medium (150-500T)</option>
                        <option value="large">Large (500T+)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="sideActions"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Side Actions
                      </label>
                      <select
                        id="sideActions"
                        value={formState.sideActions}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            sideActions: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="none">None</option>
                        <option value="simple">Simple</option>
                        <option value="complex">Complex</option>
                        <option value="very_complex">Very complex</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="runnerType"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Runner Type
                      </label>
                      <select
                        id="runnerType"
                        value={formState.runnerType}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            runnerType: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="hot_runner">Hot runner</option>
                        <option value="cold_runner">Cold runner</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="maintenanceIntervalDays"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Maintenance Interval (days)
                      </label>
                      <input
                        id="maintenanceIntervalDays"
                        type="number"
                        min={0}
                        value={formState.maintenanceIntervalDays}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            maintenanceIntervalDays: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="minorRepairsCount"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Minor Repairs Count
                      </label>
                      <input
                        id="minorRepairsCount"
                        type="number"
                        min={0}
                        value={formState.minorRepairsCount}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            minorRepairsCount: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Production Data
                  </h3>
                  <div className="mt-4 grid gap-4">
                    <div>
                      <label
                        htmlFor="plasticType"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Material
                      </label>
                      <select
                        id="plasticType"
                        value={formState.plasticType}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            plasticType: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {PLASTIC_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="cycleTimeSeconds"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Cycle Time (seconds)
                      </label>
                      <input
                        id="cycleTimeSeconds"
                        type="number"
                        min={0}
                        value={formState.cycleTimeSeconds}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            cycleTimeSeconds: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="hoursPerDay"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Run Hours planned/day
                      </label>
                      <input
                        id="hoursPerDay"
                        type="number"
                        min={0}
                        max={24}
                        value={formState.hoursPerDay}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            hoursPerDay: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="totalCycles"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Mold Cycle Reading (total cycles)
                      </label>
                      <input
                        id="totalCycles"
                        type="number"
                        min={0}
                        value={formState.totalCycles}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            totalCycles: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="anticipatedRunTimeDays"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Anticipated Run Time (days)
                      </label>
                      <input
                        id="anticipatedRunTimeDays"
                        type="number"
                        min={0}
                        value={formState.anticipatedRunTimeDays}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            anticipatedRunTimeDays: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cyclesSinceOverhaul"
                        className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        Cycles since last refurbish
                      </label>
                      <input
                        id="cyclesSinceOverhaul"
                        type="number"
                        min={0}
                        value={formState.cyclesSinceOverhaul}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            cyclesSinceOverhaul: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errors.length > 0 ? (
                <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <button
                  type="button"
                  onClick={() => setHasAgreed((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                    hasAgreed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border text-[10px] ${
                      hasAgreed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-400"
                    }`}
                  >
                    {hasAgreed ? "✓" : ""}
                  </span>
                  Agree
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  Disclaimer.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  By clicking this box and clicking "Run Prediction" button,
                  you confirm that you are a human user and agree to these
                  terms: 1. the user acknowledges that the report (AI-generated)
                  and subsequent email (automated) contents are solely intended
                  for reference purposes, and further agrees that their inputs
                  are factual for the purpose of generating reports with the
                  help of Moldpredict Console webpage. 2. the user acknowledges
                  that the prediction generated may not reflect real-world
                  scenarios. 3. the user consents to the use of all input data
                  towards the purpose of training the model. 4. the user
                  acknowledges that no warranties, express or implied, are made
                  regarding accuracy, completeness, or fitness of the report
                  for any particular purposes. 5. the user acknowledges that
                  the usage, consequences and repercussions of this report is
                  not binding to Moldpredict or to Predilytics Inc.; and any/all
                  decisions based on this report is at the user's own risk
                </p>
              </div>

              <button
                type="submit"
                disabled={isRunning || !hasAgreed}
                className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isRunning ? loadingLabel : "Run prediction"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prediction Status
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {result ? "Prediction Ready" : "Run a prediction"}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getRiskTone(
                    riskText
                  )}`}
                >
                  {riskText ?? "No risk score"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Mold ID
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {formState.moldId || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Days
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {predictedDays ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Cost
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {typeof predictedCost === "number"
                      ? formatCurrency(predictedCost)
                      : "-"}
                  </p>
                </div>
              </div>

              {anticipatedRunTime > 0 ? (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Safe to run</span>
                    <span>Risky to run</span>
                  </div>
                  <div className="relative mt-2 h-2 rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 to-rose-200">
                    <span
                      className="absolute -top-1 h-4 w-1 rounded-full bg-slate-700"
                      style={{ left: riskMarker }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  disabled={emailSent || isEmailSending}
                  onClick={() => {
                    if (emailSent) {
                      return;
                    }
                    setShowEmailForm((prev) => !prev);
                    setEmailStatus(null);
                    setEmailError(null);
                  }}
                  className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                    emailSent
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {emailSent ? "Email sent ✓" : "Email report"}
                </button>

                {showEmailForm ? (
                  <form
                    onSubmit={handleEmailSubmit}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <label
                      htmlFor="reportEmail"
                      className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Email address
                    </label>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <input
                        id="reportEmail"
                        type="email"
                        required
                        value={reportEmail}
                        onChange={(event) =>
                          setReportEmail(event.target.value)
                        }
                        placeholder="you@company.com"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button
                        type="submit"
                        disabled={isEmailSending}
                        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                      >
                        {isEmailSending ? "Sending..." : "Submit"}
                      </button>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-500">
                      By clicking "Submit", you agree to our privacy policy and
                      agree to receive further email notifications regarding
                      product updates and marketing.
                    </div>
                  </form>
                ) : null}
                {emailStatus ? (
                  <p className="text-sm text-emerald-600">
                    {emailStatus}
                  </p>
                ) : null}
                {emailError ? (
                  <p className="text-sm text-rose-600">
                    {emailError}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Want full access and more features?
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Download the MoldPredict Desktop App to unlock full analytics, manage multiple clients from a centralized workspace
                historical tracking of mold forecasts, and production-grade predictions.
              </p>

              <a
                href="https://predilyticsinc.com/moldpredict/downloads"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                Download now!
              </a>
            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Response Details
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                View raw API output for auditing or troubleshooting.
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-blue-700">
                  View raw JSON
                </summary>
                <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
                  {JSON.stringify(result?.data ?? {}, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
