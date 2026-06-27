"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  FileText,
  FlaskConical,
  Gauge,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  WalletCards,
  XCircle,
} from "lucide-react";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm transition hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <div className="mb-3 inline-block rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs uppercase tracking-widest text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
      {eyebrow}
    </div>
    <h2 className="mb-3 text-3xl font-semibold">{title}</h2>
    <p className="text-[rgb(var(--foreground))]/70">{desc}</p>
  </div>
);

const Feature = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) => (
  <Card>
    <div className="mb-3 flex items-center gap-3">
      <Icon className="text-blue-600 dark:text-blue-300" size={22} />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-[rgb(var(--foreground))]/70">{desc}</p>
  </Card>
);

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 text-sm text-[rgb(var(--foreground))]/75">
    <BadgeCheck className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-300" size={18} />
    <span>{children}</span>
  </li>
);

const ExcludedItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 text-sm text-[rgb(var(--foreground))]/75">
    <XCircle className="mt-0.5 shrink-0 text-[rgb(var(--foreground))]/45" size={18} />
    <span>{children}</span>
  </li>
);

export default function GemlaZetaPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-20 md:px-16">
      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <Sparkles size={14} />
          One-time research license
        </div>

        <h1 className="mb-4 text-4xl font-semibold md:text-5xl">
          GEMLA-Zeta RH Test Evidence Packet
        </h1>

        <p className="mx-auto max-w-2xl text-[rgb(var(--foreground))]/70">
          Access a controlled research dashboard for GEMLA-Zeta results, theorem-bridge reports,
          watermarked downloads, and limited test tools. Built for researchers, developers, and
          technical reviewers who want to inspect the evidence without receiving the raw private repo.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/gemla-zeta/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Buy access
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/gemla-zeta/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-6 py-3 text-sm font-semibold text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Open dashboard
          </Link>
        </div>

        <p className="mx-auto mt-4 max-w-xl text-sm text-[rgb(var(--foreground))]/55">
          One-time access to v1.0. Major future versions may be sold separately.
        </p>
      </motion.section>

      {/* ================= PRODUCT SUMMARY ================= */}
      <section>
        <SectionTitle
          eyebrow="Access model"
          title="A Steam-like license model for research content"
          desc="The content is not distributed as a public ZIP. Your account receives a license, and the portal controls what can be viewed, downloaded, or tested."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={WalletCards}
            title="Pay once"
            desc="A single purchase grants an account-bound license to the GEMLA-Zeta v1.0 evidence packet."
          />
          <Feature
            icon={LockKeyhole}
            title="Account-gated"
            desc="Access is checked through login and entitlement status before dashboard, download, or test routes open."
          />
          <Feature
            icon={ShieldCheck}
            title="Traceable exports"
            desc="Reports and data exports are watermarked with license and export identifiers to discourage redistribution."
          />
        </div>
      </section>

      {/* ================= INCLUDED ================= */}
      <section>
        <SectionTitle
          eyebrow="Included"
          title="What buyers get"
          desc="The first version focuses on controlled review of published GEMLA-Zeta results, not full raw repository transfer."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-3">
              <FileText className="text-blue-600 dark:text-blue-300" />
              <h3 className="text-xl font-semibold">Research dashboard</h3>
            </div>
            <ul className="space-y-3">
              <CheckItem>Published GEMLA-Zeta result summaries and theorem-bridge reports.</CheckItem>
              <CheckItem>Versioned v1.0 access to selected evidence packets and technical notes.</CheckItem>
              <CheckItem>Result pages organized by theorem branch, status, and evidence type.</CheckItem>
            </ul>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <Download className="text-blue-600 dark:text-blue-300" />
              <h3 className="text-xl font-semibold">Watermarked downloads</h3>
            </div>
            <ul className="space-y-3">
              <CheckItem>Watermarked PDF or Markdown reports where downloads are enabled.</CheckItem>
              <CheckItem>Selected CSV/JSON summaries when the result supports structured export.</CheckItem>
              <CheckItem>Download logs tied to account, license, export ID, and timestamp.</CheckItem>
            </ul>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <FlaskConical className="text-blue-600 dark:text-blue-300" />
              <h3 className="text-xl font-semibold">Controlled test tools</h3>
            </div>
            <ul className="space-y-3">
              <CheckItem>Run approved test cases through bounded server-side forms.</CheckItem>
              <CheckItem>Inspect controlled outputs without exposing private runner scripts.</CheckItem>
              <CheckItem>Rate-limited usage to preserve platform stability.</CheckItem>
            </ul>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <Gauge className="text-blue-600 dark:text-blue-300" />
              <h3 className="text-xl font-semibold">Versioned access</h3>
            </div>
            <ul className="space-y-3">
              <CheckItem>Lifetime access to the purchased v1.0 product while the account remains in good standing.</CheckItem>
              <CheckItem>v1.x corrections and clarifications can be included without changing the license model.</CheckItem>
              <CheckItem>Major releases, such as v2.0, may be handled as separate upgrades.</CheckItem>
            </ul>
          </Card>
        </div>
      </section>

      {/* ================= NOT INCLUDED ================= */}
      <section>
        <SectionTitle
          eyebrow="Boundaries"
          title="What is not included"
          desc="The product is designed to provide serious access while protecting the private research implementation and raw archive."
        />

        <Card className="mx-auto max-w-3xl">
          <ul className="space-y-3">
            <ExcludedItem>No raw private GitHub repository access for normal buyers.</ExcludedItem>
            <ExcludedItem>No resale, sublicensing, reposting, or redistribution rights.</ExcludedItem>
            <ExcludedItem>No public ZIP archive containing the full scripts, raw outputs, or internal validation corpus.</ExcludedItem>
            <ExcludedItem>No guarantee that the Riemann Hypothesis is proven by the current evidence packet.</ExcludedItem>
            <ExcludedItem>No unlimited custom research support or unlimited future major-version access.</ExcludedItem>
            <ExcludedItem>Not intended to claim RH polya proof in the available manner or any user modified version.</ExcludedItem>
            <ExcludedItem>Not intended to be used as support for Clay Mathematics Institute Millenium Prize Problems</ExcludedItem>
          </ul>
        </Card>
      </section>

      {/* ================= SECURITY NOTE ================= */}
      <section>
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-sm md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs uppercase tracking-widest text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
            <ShieldCheck size={14} />
            Anti-redistribution design
          </div>

          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <h2 className="mb-4 text-3xl font-semibold">Built to reduce uncontrolled sharing</h2>
              <p className="text-[rgb(var(--foreground))]/70">
                Once raw files leave a server, perfect copy prevention is impossible. This system reduces
                that risk by keeping the valuable core server-side, limiting normal downloads to selected
                watermarked exports, and logging access activity for abuse review.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[rgb(var(--foreground))]">
                <TerminalSquare className="text-blue-600 dark:text-blue-300" size={18} />
                License controls
              </div>
              <ul className="space-y-2 text-sm text-[rgb(var(--foreground))]/70">
                <li>• Account-bound entitlement checks</li>
                <li>• Watermark IDs on exports</li>
                <li>• Download and test-run audit logs</li>
                <li>• Access revocation after refunds, chargebacks, leaks, or abuse</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LICENSE SUMMARY ================= */}
      <section>
        <SectionTitle
          eyebrow="License summary"
          title="Simple terms for a one-time research license"
          desc="The full license page should contain the binding terms, but the sales page should make the main rules clear before checkout."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <h3 className="mb-2 text-lg font-semibold">You may view</h3>
            <p className="text-sm text-[rgb(var(--foreground))]/70">
              Use the dashboard, read published result pages, and inspect included evidence materials for your own review.
            </p>
          </Card>
          <Card>
            <h3 className="mb-2 text-lg font-semibold">You may download</h3>
            <p className="text-sm text-[rgb(var(--foreground))]/70">
              Download enabled reports or exports for personal/internal review, subject to watermarking and usage limits.
            </p>
          </Card>
          <Card>
            <h3 className="mb-2 text-lg font-semibold">You may not resell</h3>
            <p className="text-sm text-[rgb(var(--foreground))]/70">
              Do not repost, resell, repackage, share login access, or use the materials to create a competing redistributed bundle.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-sm md:p-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <Sparkles size={14} />
            GEMLA-Zeta v1.0
          </div>
          <h2 className="mb-4 text-3xl font-semibold">Ready to review the evidence packet?</h2>
          <p className="mx-auto mb-8 max-w-xl text-[rgb(var(--foreground))]/70">
            Purchase a one-time account-bound license and access the protected dashboard after payment confirmation.
          </p>
          <Link
            href="/gemla-zeta/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Buy access
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
