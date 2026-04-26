"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Globe,
  Shield,
  Building2,
  Eye,
  LineChart,
  CheckCircle,
  Zap,
} from "lucide-react";

const IconWrap = ({ children }: any) => (
  <div className="w-10 h-10 rounded-full bg-blue-50 border flex items-center justify-center text-blue-600">
    {children}
  </div>
);

const OutlineIcon = ({ icon: Icon }: any) => (
  <div className="flex justify-center mb-3 text-blue-600">
    <Icon size={22} strokeWidth={1.8} />
  </div>
);

export function HomeSection() {
  return (
    <div className="flex flex-col gap-28">

      {/* ================= HERO ================= */}
      <motion.section
        className="grid md:grid-cols-2 gap-14 items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <span className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            Adaptive Intelligence Infrastructure
          </span>

          <h1 className="text-4xl font-semibold mb-6 leading-tight">
            We build self-improving intelligence systems
            <br />
            that learn from reality.
          </h1>

          <p className="text-gray-600 mb-6">
            Predilytics is a governed multi-agent intelligence platform that continuously learns,
            adapts, and evolves through real-world feedback.
          </p>

          <button className="mb-6 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Explore Our Architecture
          </button>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <IconWrap><Zap size={16} /></IconWrap>
              Self Improving
            </div>
            <div className="flex items-center gap-2">
              <IconWrap><CheckCircle size={16} /></IconWrap>
              Governed & Auditable
            </div>
            <div className="flex items-center gap-2">
              <IconWrap><Globe size={16} /></IconWrap>
              Real-World Impact
            </div>
          </div>
        </motion.div>

        <div className="rounded-2xl border shadow-sm overflow-hidden h-[360px]">
          <img
            src="/images/FIG1CoreArch.png"
            className="w-full h-full object-contain bg-white dark:bg-[rgb(var(--card))]"
          />
        </div>
      </motion.section>

      {/* ================= CORE PLATFORM ================= */}
      <motion.section className="grid md:grid-cols-2 gap-8 items-center">

        <div>
          <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
            THE CORE PLATFORM
          </div>

          <h2 className="text-3xl font-semibold mb-4">
            A Multi-Layer Intelligence System
          </h2>

          <p className="text-gray-600">
            Our architecture transforms raw signals into structured, governed intelligence across multiple layers.
          </p>
        </div>

        <div className="rounded-2xl border shadow-sm overflow-hidden h-[420px] flex items-center justify-center bg-white dark:bg-[rgb(var(--card))]">
          <img
            src="/images/FIG2CoreArch.png"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.section>

      {/* ================= META AGENT ================= */}
      <motion.section className="grid md:grid-cols-2 gap-10 items-center">

        <div className="rounded-2xl border shadow-sm overflow-hidden h-[420px] flex items-center justify-center bg-white dark:bg-[rgb(var(--card))]">
          <img
            src="/images/FIG3CoreArch.png"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Self-Improving Intelligence Loop
          </h2>

          <p className="text-gray-600 mb-6 text-base leading-relaxed">
            The meta-agent continuously evaluates outcomes, learns from feedback,
            and improves system behavior within governance constraints.
          </p>

          <div className="space-y-3 text-base text-gray-600">

            <div className="flex items-center gap-3">
              <IconWrap><Eye size={16} /></IconWrap>
              Monitors real-world outcomes
            </div>

            <div className="flex items-center gap-3">
              <IconWrap><LineChart size={16} /></IconWrap>
              Measures performance and errors
            </div>

            <div className="flex items-center gap-3">
              <IconWrap><Brain size={16} /></IconWrap>
              Generates structured learning signals
            </div>

            <div className="flex items-center gap-3">
              <IconWrap><Zap size={16} /></IconWrap>
              Updates system intelligence dynamically
            </div>

            <div className="flex items-center gap-3">
              <IconWrap><Shield size={16} /></IconWrap>
              Evolves under governance control
            </div>

          </div>
        </div>
      </motion.section>

      {/* ================= CONTINUOUS SYSTEM EVOLUTION ================= */}
      <motion.section className="text-center">

        <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
          CONTINUOUS SYSTEM EVOLUTION
        </div>

        <h2 className="text-3xl font-semibold mb-10 text-center">
          Four Write-Back Loops That Make Us Different
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            { icon: Brain, title: "Cognition Loop", desc: "Refines reasoning and entity understanding continuously." },
            { icon: Globe, title: "World Model Loop", desc: "Maintains real-time alignment with system reality." },
            { icon: Shield, title: "Risk Correction Loop", desc: "Reduces uncertainty through feedback correction." },
            { icon: Building2, title: "Governance Loop", desc: "Ensures safe and auditable system evolution." },
          ].map((i, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border bg-[rgb(var(--card))] shadow-sm text-center"
            >
              <OutlineIcon icon={i.icon} />
              <h3 className="font-semibold mb-2">{i.title}</h3>
              <p className="text-sm text-gray-500">{i.desc}</p>
            </div>
          ))}

        </div>

        {/* EMPHASIS STRIP */}
        <div className="mt-10 p-6 rounded-xl border bg-gradient-to-r from-transparent via-[rgb(var(--card))] to-transparent flex items-center justify-center gap-3 text-center">
          <LineChart size={18} className="text-blue-500" />
          <span className="text-lg font-medium">
            This is not just analytics — this is intelligence that improves.
          </span>
        </div>

      </motion.section>

      {/* ================= APPLICATIONS ECOSYSTEM (RESTORED) ================= */}
      <motion.section className="text-center">

        <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
          APPLICATIONS ECOSYSTEM
        </div>

        <h2 className="text-3xl font-semibold mb-4">
          Intelligence for every critical domain
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Predilytics Inc powers a growing ecosystem of domain-specific applications.
          Each application leverages the same adaptive intelligence infrastructure.
        </p>

        <div className="flex flex-wrap justify-center gap-8 text-base text-gray-600">

          <div>🏭 Industrial Systems</div>
          <div>⚙️ Materials & Manufacturing</div>
          <div>🌿 Environmental Intelligence</div>
          <div>📈 Economic Forecasting</div>
          <div>🏗 Infrastructure Resilience</div>
          <div>⚡ Energy & Utilities</div>
          <div>🌍 And Many More</div>

        </div>

      </motion.section>

      {/* ================= GOVERNANCE ================= */}
        <motion.section>

        <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
          GOVERNANCE & TRUST
        </div>

        {/* ✅ SINGLE GRID WRAPPING EVERYTHING */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT COLUMN */}
          <div>

            <h2 className="text-3xl font-semibold mb-6">
              Governed Intelligence by Design
            </h2>

            <p className="text-gray-600 max-w-md">
              We ensure intelligence remains safe, transparent, and accountable through structured governance systems.
            </p>

          </div>

          {/* RIGHT COLUMN */}
          <div className="grid grid-cols-2 gap-4 text-sm items-start">

            <div className="p-4 border rounded-lg h-fit">
              👥 AEAL / DAO Governance<br />
              Community-aligned decision systems
            </div>

            <div className="p-4 border rounded-lg h-fit">
              🔍 Auditability<br />
              Fully traceable system evolution
            </div>

            <div className="p-4 border rounded-lg h-fit">
              🔒 Safety Constraints<br />
              Hard governance guardrails
            </div>

            <div className="p-4 border rounded-lg h-fit">
              🧭 Alignment by Design<br />
              Built for societal benefit
            </div>

          </div>

        </div>

        </motion.section>

    </div>
  );
}