import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getClientIdentifier, rateLimit } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Predilytics <no-reply@predilyticsinc.com>";
const SUPPORT_EMAIL = "support@predilyticsinc.com";

export async function POST(request: Request) {
  const clientId = getClientIdentifier(request);
  const limit = rateLimit(`support-ticket:${clientId}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": Math.ceil(limit.retryAfterMs / 1000).toString() } }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY configuration." },
      { status: 500 }
    );
  }

  let payload: {
    firstName?: string;
    lastName?: string;
    email?: string;
    subject?: string;
    description?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const firstName = payload.firstName?.trim() ?? "";
  const lastName = payload.lastName?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const subject = payload.subject?.trim() ?? "";
  const description = payload.description?.trim() ?? "";

  if (!firstName || !lastName || !email || !subject || !description) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [SUPPORT_EMAIL],
      replyTo: email,
      subject: `Support Ticket: ${subject}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
          <h2 style="margin:0 0 12px;">New Support Ticket</h2>
          <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
          <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 12px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p style="margin:0;"><strong>Description:</strong></p>
          <p style="margin:6px 0 0;white-space:pre-wrap;">${escapeHtml(description)}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: "We received your support ticket",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <h2 style="margin:0 0 12px;">Thanks for reaching out</h2>
            <p style="margin:0 0 12px;">We received your ticket and will reply soon.</p>
            <p style="margin:0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          </div>
        `,
      });
    } catch (confirmationError) {
      console.error("[support-ticket] confirmation email failed", confirmationError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send support ticket." },
      { status: 502 }
    );
  }
}
