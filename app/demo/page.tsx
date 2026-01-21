"use client";

import { useEffect, useMemo, useState } from "react";

type FormState = {
  moldId: string;
  modelSelection: string;
  yearSelection: string;
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

const DOWNLOAD_URL =
  "https://github.com/your-org/your-repo/releases/latest";

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

const pickFirstNumber = (source: unknown, keys: string[]) => {
  if (!source || typeof source !== "object") {
    return null;
  }
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return null;
};

const pickFirstString = (source: unknown, keys: string[]) => {
  if (!source || typeof source !== "object") {
    return null;
  }
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
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

export default function DemoPage() {
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => [
      { label: `Past (${currentYear - 1})`, value: `${currentYear - 1}` },
      { label: `Present (${currentYear})`, value: `${currentYear}` },
      { label: `Future (${currentYear + 1})`, value: `${currentYear + 1}` },
    ],
    [currentYear]
  );

  const [formState, setFormState] = useState<FormState>({
    moldId: "",
    modelSelection: "xgb",
    yearSelection: `${currentYear}`,
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

  useEffect(() => {
    fetch("/api/health")
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (response.ok) {
          setHealthStatus("Demo server is warm.");
          return;
        }
        setHealthStatus(payload?.error ?? "Demo server unavailable.");
      })
      .catch(() => {
        setHealthStatus("Demo server unavailable.");
      });
  }, []);

  const predictionValue = getPredictionField(result?.data ?? null);
  const predictedDays = pickFirstNumber(predictionValue ?? result?.data, [
    "days",
    "predicted_days",
    "predicted_runtime_days",
    "predicted_run_days",
  ]);
  const predictedCost = pickFirstNumber(predictionValue ?? result?.data, [
    "cost",
    "predicted_cost",
    "estimated_cost",
    "repair_cost",
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
    setFormState((prev) => {
      if (prev.moldId && prev.moldId !== value) {
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

  const anticipatedRunTime = toNumber(
    formState.anticipatedRunTimeDays,
    0
  );
  const riskMarker =
    riskText && riskText.toLowerCase().includes("high")
      ? "75%"
      : riskText && riskText.toLowerCase().includes("medium")
      ? "50%"
      : riskText && riskText.toLowerCase().includes("low")
      ? "25%"
      : "50%";

  return (
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Predylitics Demo
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              MoldPredict Console
            </h1>
          </div>
          <a
            href={DOWNLOAD_URL}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
          >
            Download Full App
          </a>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          {healthStatus ?? "Checking demo server availability..."}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="modelSelection"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Select Prediction Model
                </label>
                <select
                  id="modelSelection"
                  value={formState.modelSelection}
                  disabled
                  className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 shadow-sm"
                >
                  <option value="xgb">XGBoost</option>
                  <option value="ngb">NGBoost</option>
                </select>
                <p className="mt-1 text-xs text-slate-400">
                  Demo uses XGBoost only.
                </p>
              </div>
              <div>
                <label
                  htmlFor="yearSelection"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Select Year
                </label>
                <select
                  id="yearSelection"
                  value={formState.yearSelection}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      yearSelection: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {yearOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
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

              <button
                type="submit"
                disabled={isRunning}
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
                    Latest Prediction
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
                    {predictedCost ?? "-"}
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

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Get Coverage
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
                >
                  Email report
                </button>
              </div>
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
