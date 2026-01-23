import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Predilytics <no-reply@predilyticsinc.com>";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY configuration." },
      { status: 500 }
    );
  }

  let payload: {
    toEmail?: string;
    reportData?: unknown;
    moldId?: string;
    riskLabel?: string;
    formData?: Record<string, unknown>;
  };
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const toEmail = payload.toEmail?.trim();
  if (!toEmail) {
    return NextResponse.json(
      { error: "Missing recipient email." },
      { status: 400 }
    );
  }

  const reportData = payload.reportData ?? {};
  const moldId =
    payload.moldId?.trim() ||
    (typeof reportData === "object" &&
    reportData !== null &&
    "mold_id" in reportData
      ? String(
          (reportData as Record<string, unknown>).mold_id ?? ""
        )
      : "Unknown");
  const riskLabel = payload.riskLabel?.trim() || "Risk level unknown";
  const subject = `MoldPredict Report: ${moldId} - ${riskLabel}`;
  const formData = payload.formData ?? {};

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const pickNumber = (data: unknown, key: string) => {
    if (!data || typeof data !== "object") {
      return null;
    }
    const record = data as Record<string, unknown>;
    const value = record[key];
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const predictedDays =
    pickNumber(reportData, "estimated_time_to_repair_days") ??
    pickNumber(reportData, "predicted_days") ??
    pickNumber(reportData, "days");
  const predictedCost =
    pickNumber(reportData, "estimated_repair_cost_usd") ??
    pickNumber(reportData, "predicted_cost") ??
    pickNumber(reportData, "cost");
  const formatCurrency = (value: number | null) => {
    if (typeof value !== "number") {
      return "N/A";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  };

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
          <h2 style="margin:0 0 12px;">Predilytics MoldPredict</h2>
          <p style="margin:0 0 16px;">Thanks for using Predilytics MoldPredict. Here is your report summary.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:10px;border-bottom:2px solid #e2e8f0;">Mold Data</th>
                <th style="text-align:left;padding:10px;border-bottom:2px solid #e2e8f0;">Production Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Complexity: ${escapeHtml(formData.complexity)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Material: ${escapeHtml(formData.plasticType)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Size: ${escapeHtml(formData.size)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Cycle time: ${escapeHtml(formData.cycleTimeSeconds)} sec</td>
              </tr>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Side actions: ${escapeHtml(formData.sideActions)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Run hours planned/day: ${escapeHtml(formData.hoursPerDay)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Runner type: ${escapeHtml(formData.runnerType)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Mold cycle reading: ${escapeHtml(formData.totalCycles)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Maintenance int days: ${escapeHtml(formData.maintenanceIntervalDays)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Anticipated run days: ${escapeHtml(formData.anticipatedRunTimeDays)}</td>
              </tr>
              <tr>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Minor repairs count: ${escapeHtml(formData.minorRepairsCount)}</td>
                <td style="padding:8px;border-bottom:1px solid #e2e8f0;">Cycles since last refurbish: ${escapeHtml(formData.cyclesSinceOverhaul)}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin:0 0 8px;"><strong>Pending refurbish</strong> = ${predictedDays ?? "N/A"} days</p>
          <p style="margin:0;"><strong>Estimate</strong> = ${formatCurrency(predictedCost)}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 502 }
    );
  }
}
