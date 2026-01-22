import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Predylitics <no-reply@predilytics.com>";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY configuration." },
      { status: 500 }
    );
  }

  let payload: { toEmail?: string; reportData?: unknown };
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

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: "Your MoldPredict Report",
      html: `
        <p>Thanks for using Predylitics MoldPredict.</p>
        <p>Your latest prediction details are below:</p>
        <pre style="background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;white-space:pre-wrap;">${JSON.stringify(
          reportData,
          null,
          2
        )}</pre>
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
