"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Globe,
  Shield,
  Building2,
  Eye,
  LineChart,
  Zap,
  Github,
  ExternalLink,
  Heart,
  Layers,
  Code2,
  Sparkles,
} from "lucide-react";

const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm p-6 hover:shadow-md transition">
    {children}
  </div>
);

const SectionTitle = ({ eyebrow, title, desc }: any) => (
  <div className="text-center max-w-2xl mx-auto mb-12">
    <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
      {eyebrow}
    </div>
    <h2 className="text-3xl font-semibold mb-3">{title}</h2>
    <p className="text-[rgb(var(--foreground))]/70">{desc}</p>
  </div>
);

const LogoPlaceholder = () => (
<div className="flex justify-center mb-6">
  <div className="overflow-hidden w-28 h-28 md:w-32 md:h-32 bg-white dark:bg-[rgb(var(--card))] flex items-center justify-center">
    <img
      src="/images/gemla-logo.jpeg"
      alt="GEMLA Logo"
      className="w-full h-full object-contain"
    />
  </div>
</div>
);

export default function ExploreArch() {
  return (
    <div className="flex flex-col gap-24 py-20 px-6 md:px-16 max-w-6xl mx-auto">

      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* LOGO PLACEHOLDER */}
        <LogoPlaceholder />

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm mb-6">
          <Sparkles size={14} />
          Architecture & Ecosystem
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold mb-4">
          Explore the Predilytics Intelligence Stack
        </h1>

        <p className="text-[rgb(var(--foreground))]/70 max-w-2xl mx-auto">
          A system that helps machines learn, improve, and adapt over time — similar to how humans learn from experience.
          <br /><br />
          GEMLA is the core framework that powers this: it turns raw data into structured intelligence.
        </p>

        <p className="text-sm text-[rgb(var(--foreground))]/60 mt-4 max-w-xl mx-auto">
          Built by engineers for researchers and developers creating real-world systems that evolve.
        </p>
      </motion.section>

      {/* ================= SDK ================= */}
      <section>
        <SectionTitle
          eyebrow="SDK"
          title="GEMLA SDK"
          desc="A development framework that lets engineers build systems that learn from data, improve over time, and stay under control. Think of it as the operating system for adaptive intelligence."
        />

        <div className="grid md:grid-cols-2 gap-6">

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Layers className="text-blue-600" />
              <h3 className="font-semibold text-lg">Core Architecture SDK</h3>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))]/70 mb-4">
              GEMLA helps break complex real-world signals into structured patterns so systems can learn from them in a stable and explainable way.
            </p>
            <a
              href="https://github.com/Predilytics-Inc/gemla-sdk"
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 text-sm"
            >
              View SDK Repo <ExternalLink size={14} />
            </a>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="text-blue-600" />
              <h3 className="font-semibold text-lg">Pipeline Integration</h3>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))]/70 mb-4">
              Used in real systems where AI needs to continuously improve — like monitoring, forecasting, or decision-making tools.
              It helps models learn from feedback instead of staying static after training.
            </p>
            <span className="text-xs text-[rgb(var(--foreground))]/50">
              Modular • Composable • Production-ready
            </span>
          </Card>

        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section>
        <SectionTitle
          eyebrow="Community"
          title="Open Source & Ecosystem"
          desc="Build on top of the system, contribute improvements, or use it in your own applications."
        />

        <div className="grid md:grid-cols-3 gap-6">

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Github />
              <h3 className="font-semibold">GitHub</h3>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))]/70 mb-4">
              Core SDK, architecture modules, and research implementations.
            </p>
            <a className="text-blue-600 text-sm flex items-center gap-2" href="https://github.com/Predilytics-Inc/gemla-sdk" target="_blank">
              Visit Repo <ExternalLink size={14} />
            </a>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-red-500" />
              <h3 className="font-semibold">GitHub Sponsors</h3>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))]/70 mb-4">
              Support long-term development of adaptive intelligence research.
            </p>
            <a className="text-blue-600 text-sm flex items-center gap-2" href="https://github.com/sponsors/Predilytics-Inc" target="_blank">
              Sponsor <ExternalLink size={14} />
            </a>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-purple-600" />
              <h3 className="font-semibold">Patreon</h3>
            </div>
            <p className="text-sm text-[rgb(var(--foreground))]/70 mb-4">
              Early access to research updates, architecture notes, and experimental systems.
            </p>
            <a className="text-blue-600 text-sm flex items-center gap-2" href="https://www.patreon.com/cw/Predilytics_Inc" target="_blank">
              Support <ExternalLink size={14} />
            </a>
          </Card>

        </div>
      </section>

      {/* ================= SYSTEM NOTE ================= */}
      <section className="text-center">
        <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest uppercase bg-blue-50 text-blue-600 rounded-md border">
          SYSTEM NOTE
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          What GEMLA Actually Does
        </h2>

        <p className="text-[rgb(var(--foreground))]/70 max-w-2xl mx-auto">
          GEMLA is a framework for building systems that learn continuously from real-world data.
          <br /><br />
          Instead of training once and freezing, these systems keep improving as new information arrives — while still following structured rules for safety, stability, and interpretability.
          <br /><br />
          It is used in adaptive AI systems, forecasting engines, monitoring tools, and decision-making environments.
        </p>
      </section>

    </div>
  );
}