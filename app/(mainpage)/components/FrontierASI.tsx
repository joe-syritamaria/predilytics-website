"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Eye,
  Layers,
  Sparkles,
  ArrowRight,
  Lock,
  Network,
  Activity,
  Database,
  RefreshCw,
  Scale,
} from "lucide-react";

const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-[rgb(var(--border))]
    bg-[rgb(var(--card))] shadow-sm p-6
    hover:shadow-md transition">
    {children}
  </div>
);

const SectionTitle = ({ eyebrow, title, desc }: any) => (
  <div className="text-center max-w-3xl mx-auto mb-12">
    <div className="inline-block mb-3 px-3 py-1 text-xs tracking-widest
      uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600
      dark:text-blue-400 rounded-md border border-blue-100
      dark:border-blue-900">
      {eyebrow}
    </div>

    <h2 className="text-3xl md:text-4xl font-semibold mb-4">
      {title}
    </h2>

    <p className="text-[rgb(var(--foreground))]/70">
      {desc}
    </p>
  </div>
);


/* ============================================================
   IMAGE PLACEHOLDER
   Replace src with the final generated image.
   ============================================================ */

const ImagePlaceholder = ({
  src,
  alt,
  label,
}: {
  src?: string;
  alt: string;
  label: string;
}) => (
  <div className="rounded-3xl overflow-hidden border
    border-[rgb(var(--border))]
    bg-[rgb(var(--card))]
    shadow-sm">

    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover"
      />
    ) : (
      <div className="aspect-[16/9] flex flex-col items-center
        justify-center text-center
        bg-[rgb(var(--background))]
        border-dashed border-2
        border-[rgb(var(--border))]">

        <Layers className="mb-3 opacity-40" size={42} />

        <div className="font-medium">
          {label}
        </div>

        <div className="text-xs mt-2
          text-[rgb(var(--foreground))]/50">
          IMAGE PLACEHOLDER
        </div>
      </div>
    )}

  </div>
);


/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function FrontierASI() {
  return (
    <div className="flex flex-col gap-28 py-20 px-6 md:px-16
      max-w-7xl mx-auto">


      {/* ======================================================
          HERO
      ====================================================== */}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl overflow-hidden
            bg-white dark:bg-[rgb(var(--card))]
            border border-[rgb(var(--border))]">

            <img
              src="/images/gemla-logo.jpeg"
              alt="GEMLA"
              className="w-full h-full object-contain"
            />

          </div>
        </div>


        <div className="inline-flex items-center gap-2 px-4 py-1
          rounded-full bg-blue-100 dark:bg-blue-950/50
          text-blue-700 dark:text-blue-400 text-sm mb-6">

          <Sparkles size={14} />

          Frontier Intelligence Architecture

        </div>


        <h1 className="text-5xl md:text-7xl font-semibold
          tracking-tight mb-6">

          Let Intelligence Grow.
          <br />

          <span className="text-blue-600">
            Keep Its Actions Bounded.
          </span>

        </h1>


        <p className="text-lg md:text-xl
          text-[rgb(var(--foreground))]/70
          max-w-3xl mx-auto leading-relaxed">

          Frontier GEMLA is an architecture for building highly
          capable adaptive AI while keeping operational changes,
          decisions, and authority independently controlled.

        </p>


        <div className="flex flex-wrap justify-center gap-3 mt-8">

          <div className="px-4 py-2 rounded-full border
            text-sm flex items-center gap-2">

            <Brain size={16} />

            Open Cognition

          </div>

          <div className="px-4 py-2 rounded-full border
            text-sm flex items-center gap-2">

            <Eye size={16} />

            Transparent Operation

          </div>

          <div className="px-4 py-2 rounded-full border
            text-sm flex items-center gap-2">

            <Shield size={16} />

            Bounded Authority

          </div>

        </div>

      </motion.section>



      {/* ======================================================
          IMAGE 1 — CAPABILITY POSITIONING
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="The Big Picture"
          title="A Different Way to Build Advanced AI"
          desc="Frontier GEMLA separates intelligence from authority. A system can become more capable without automatically gaining permission to change the world."
        />

        <ImagePlaceholder
          label="Frontier GEMLA Capability Positioning"
          alt="Conceptual comparison of AI capability architectures"
          src="/images/frontier-gemla-capability-positioning.png"
        />

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <Card>
            <Brain className="text-blue-600 mb-4" />

            <h3 className="font-semibold text-lg mb-2">
              Think Freely
            </h3>

            <p className="text-sm text-[rgb(var(--foreground))]/70">
              The intelligence layer can explore ideas, generate
              hypotheses, simulate possibilities, and discover new
              strategies.
            </p>
          </Card>


          <Card>
            <Eye className="text-blue-600 mb-4" />

            <h3 className="font-semibold text-lg mb-2">
              Make Changes Visible
            </h3>

            <p className="text-sm text-[rgb(var(--foreground))]/70">
              Changes that matter operationally pass through
              structured calibration, translation, and audit.
            </p>
          </Card>


          <Card>
            <Shield className="text-blue-600 mb-4" />

            <h3 className="font-semibold text-lg mb-2">
              Keep Authority Separate
            </h3>

            <p className="text-sm text-[rgb(var(--foreground))]/70">
              Becoming smarter does not automatically mean gaining
              more permission to act.
            </p>
          </Card>

        </div>

      </section>



      {/* ======================================================
          SIMPLE FORMULA
      ====================================================== */}

      <section className="text-center">

        <div className="rounded-3xl border
          border-[rgb(var(--border))]
          bg-[rgb(var(--card))]
          p-10 md:p-14">

          <div className="text-xs uppercase tracking-widest
            text-blue-600 mb-6">
            The Core Idea
          </div>

          <div className="text-xl md:text-3xl font-mono
            tracking-tight leading-relaxed">

            <span>Cognitive Capability</span>

            <span className="mx-3 text-blue-600">
              ⊇
            </span>

            <span>Certified Capability</span>

            <span className="mx-3 text-blue-600">
              ⊇
            </span>

            <span>Authorized Action</span>

          </div>

          <p className="max-w-2xl mx-auto mt-6
            text-[rgb(var(--foreground))]/65">

            The system may know more than it is allowed to do.
            That is intentional.

          </p>

        </div>

      </section>



      {/* ======================================================
          IMAGE 2 — ASI MECHANISM
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Frontier Architecture"
          title="How Bounded ASI Could Work"
          desc="Frontier GEMLA provides a control architecture around the intelligence core rather than requiring the intelligence itself to remain small."
        />

        <ImagePlaceholder
          label="Bounded ASI Mechanism"
          alt="Frontier GEMLA bounded ASI architecture"
          src="/images/frontier-gemla-bounded-asi.png"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          {[
            ["Open Intelligence", Brain],
            ["Adaptive Compute", Activity],
            ["Continuous Learning", RefreshCw],
            ["Bounded Authority", Shield],
          ].map(([title, Icon]: any) => (
            <Card key={title}>
              <Icon className="text-blue-600 mb-4" />

              <h3 className="font-semibold mb-2">
                {title}
              </h3>

              <p className="text-sm
                text-[rgb(var(--foreground))]/65">

                {title === "Open Intelligence" &&
                  "Use the strongest available intelligence model without requiring it to think like a human."}

                {title === "Adaptive Compute" &&
                  "Allocate reasoning and computation where they provide the most value."}

                {title === "Continuous Learning" &&
                  "Allow strategies and capabilities to evolve through controlled improvement."}

                {title === "Bounded Authority" &&
                  "Keep consequential actions behind independent certification and authority controls."}

              </p>
            </Card>
          ))}

        </div>

      </section>



      {/* ======================================================
          TWO CALIBRATION
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Calibration"
          title="Two Checks. One Clear Boundary."
          desc="Frontier GEMLA separates learning from certification."
        />

        <div className="grid md:grid-cols-2 gap-6">

          <Card>

            <div className="flex items-center gap-3 mb-5">

              <Activity className="text-blue-600" />

              <h3 className="font-semibold text-xl">
                Operational Calibration
              </h3>

            </div>

            <p className="text-[rgb(var(--foreground))]/70">
              The system can explore, test, simulate, optimize,
              and search for better solutions.
            </p>

            <div className="mt-6 text-sm font-mono
              text-blue-600">

              Explore → Learn → Adapt

            </div>

          </Card>


          <Card>

            <div className="flex items-center gap-3 mb-5">

              <Lock className="text-blue-600" />

              <h3 className="font-semibold text-xl">
                Audit Calibration
              </h3>

            </div>

            <p className="text-[rgb(var(--foreground))]/70">
              A separate layer determines whether a change is
              sufficiently understood and certified for operational use.
            </p>

            <div className="mt-6 text-sm font-mono
              text-blue-600">

              Verify → Certify → Authorize

            </div>

          </Card>

        </div>

      </section>



      {/* ======================================================
          IMAGE 3 — TRANSLATION
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Universal Agency"
          title="The ASI Does Not Have to Think Like Us"
          desc="Its internal reasoning can remain radically different from human reasoning. What matters is a trustworthy bridge to shared audit semantics."
        />

        <ImagePlaceholder
          label="Two-Calibration + Certified Translation"
          alt="Universal Agency Operator and certified semantic translation"
          src="/images/frontier-gemla-certified-translation.png"
        />

        <div className="mt-8 rounded-3xl border
          border-[rgb(var(--border))]
          bg-[rgb(var(--card))]
          p-8 text-center">

          <div className="font-mono text-lg md:text-2xl
            mb-5">

            G★(G★(⋯), G★(⋯))

          </div>

          <div className="text-blue-600 text-2xl mb-5">
            ↓
          </div>

          <div className="font-mono text-base md:text-xl">

            Φ : ASI Internal Algebra → Shared Audit Semantics

          </div>

          <p className="text-sm
            text-[rgb(var(--foreground))]/60
            max-w-2xl mx-auto mt-6">

            Human oversight does not need to out-reason the ASI.
            It needs a reliable way to understand and certify what
            becomes operational.

          </p>

        </div>

      </section>



      {/* ======================================================
          SYNTHETIC DATA
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Evidence"
          title="More Data Does Not Always Mean More Visibility"
          desc="When reliable evidence becomes scarce, synthetic data can help the system explore — but it should never be mistaken for newly certified evidence."
        />

        <ImagePlaceholder
          label="Synthetic Mesh — Evidence Visibility"
          alt="Synthetic data mesh and empirical evidence visibility"
          src="/images/frontier-gemla-synthetic-mesh.png"
        />

        <div className="grid md:grid-cols-4 gap-4 mt-8">

          {[
            ["Certified", "Directly supported evidence", Database],
            ["Uncertified", "Observed but not fully verified", Eye],
            ["Synthetic", "Generated or imputed evidence", Network],
            ["Counterfactual", "Possible worlds and scenarios", Scale],
          ].map(([title, desc, Icon]: any) => (
            <Card key={title}>

              <Icon className="text-blue-600 mb-3" />

              <h3 className="font-semibold mb-1">
                {title}
              </h3>

              <p className="text-xs
                text-[rgb(var(--foreground))]/60">
                {desc}
              </p>

            </Card>
          ))}

        </div>


        <div className="mt-8 text-center">

          <div className="inline-block rounded-2xl
            border border-blue-200 dark:border-blue-900
            bg-blue-50 dark:bg-blue-950/30
            px-6 py-4">

            <div className="font-semibold text-blue-700
              dark:text-blue-400">

              Synthetic density ≠ empirical visibility

            </div>

          </div>

        </div>

      </section>



      {/* ======================================================
          MESSED WINDOW IDEA
      ====================================================== */}

      <section>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div>

            <div className="text-xs uppercase tracking-widest
              text-blue-600 mb-4">

              Evidence Boundaries

            </div>

            <h2 className="text-3xl md:text-4xl
              font-semibold mb-5">

              The AI Can Explore
              <br />
              Beyond What It Can Certify.

            </h2>

            <p className="text-[rgb(var(--foreground))]/70
              leading-relaxed">

              Synthetic data can make a model more useful,
              especially when reliable data is scarce.

              <br /><br />

              But as synthetic assumptions increase, the system
              should become more careful about what it treats as
              established fact.

            </p>

          </div>


          <div className="rounded-3xl border
            border-[rgb(var(--border))]
            bg-[rgb(var(--card))]
            p-8">

            <div className="font-mono text-sm leading-8">

              <div>
                C<sub>cognitive</sub>
              </div>

              <div className="text-blue-600">
                ↓
              </div>

              <div>
                C<sub>possible</sub>
              </div>

              <div className="text-blue-600">
                ↓
              </div>

              <div>
                C<sub>robust</sub>
              </div>

              <div className="text-blue-600">
                ↓
              </div>

              <div>
                C<sub>certified</sub>
              </div>

              <div className="text-blue-600">
                ↓
              </div>

              <div className="font-semibold">
                C<sub>authorized</sub>
              </div>

            </div>

            <p className="text-xs
              text-[rgb(var(--foreground))]/50 mt-6">

              More possibilities can exist internally while
              fewer actions are authorized externally.

            </p>

          </div>

        </div>

      </section>



      {/* ======================================================
          RECURSIVE IMPROVEMENT
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Self-Improvement"
          title="Better Intelligence Without Automatic Power"
          desc="Frontier GEMLA is designed so that recursive improvement does not automatically become recursive authority."
        />

        <div className="grid md:grid-cols-5 gap-3">

          {[
            ["01", "Discover"],
            ["02", "Test"],
            ["03", "Audit"],
            ["04", "Promote"],
            ["05", "Authorize"],
          ].map(([number, title]) => (

            <div
              key={number}
              className="rounded-2xl border
                border-[rgb(var(--border))]
                bg-[rgb(var(--card))]
                p-5 text-center"
            >

              <div className="text-xs text-blue-600
                font-mono mb-3">

                {number}

              </div>

              <div className="font-semibold">
                {title}
              </div>

            </div>

          ))}

        </div>

      </section>



      {/* ======================================================
          CONVENTIONS
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Human Conventions"
          title="Standards Can Evolve Too"
          desc="When definitions, structures, notation, or norms change, the architecture provides a controlled path for updating the shared rules."
        />

        <div className="grid md:grid-cols-4 gap-5">

          {[
            ["Notation", "How we represent things"],
            ["Definitions", "What things mean"],
            ["Structure", "How things fit together"],
            ["Norms", "What is permitted"],
          ].map(([title, desc]) => (

            <Card key={title}>

              <div className="text-blue-600 text-xl mb-3">
                ◇
              </div>

              <h3 className="font-semibold mb-2">
                {title}
              </h3>

              <p className="text-sm
                text-[rgb(var(--foreground))]/60">
                {desc}
              </p>

            </Card>

          ))}

        </div>

        <div className="text-center mt-8
          font-mono text-sm md:text-base
          text-[rgb(var(--foreground))]/60">

          Propose → Translate → Verify → Approve → New Audit Epoch

        </div>

      </section>



      {/* ======================================================
          12 LAYERS
      ====================================================== */}

      <section>

        <SectionTitle
          eyebrow="Architecture"
          title="One Stack. Twelve Layers."
          desc="A layered architecture separates intelligence, evidence, operations, audit, recovery, and authority."
        />

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">

          {[
            "Governance",
            "Frozen Audit",
            "Authority Broker",
            "Recovery",
            "Promotion Firewall",
            "Semantic Translation",
            "GEMLA Agency",
            "Quantized Objects",
            "Adaptive Compute",
            "Observability",
            "Intelligence Core",
            "Shadow Lab",
          ].map((layer, i) => (

            <div
              key={layer}
              className="rounded-xl border
                border-[rgb(var(--border))]
                bg-[rgb(var(--card))]
                p-4 flex items-center gap-3"
            >

              <div className="w-7 h-7 rounded-lg
                bg-blue-100 dark:bg-blue-950/50
                text-blue-600 flex items-center
                justify-center text-xs font-mono">

                {i + 1}

              </div>

              <span className="text-sm font-medium">
                {layer}
              </span>

            </div>

          ))}

        </div>

      </section>



      {/* ======================================================
          FINAL STATEMENT
      ====================================================== */}

      <section className="text-center">

        <div className="rounded-3xl
          bg-blue-600 text-white
          p-10 md:p-16">

          <Sparkles
            className="mx-auto mb-6"
            size={36}
          />

          <h2 className="text-3xl md:text-5xl
            font-semibold mb-5">

            Intelligence Can Be Open.
            <br />
            Authority Can Stay Bounded.

          </h2>

          <p className="max-w-2xl mx-auto
            text-white/80 leading-relaxed">

            Frontier GEMLA is designed around a simple separation:
            let the intelligence discover what it can,
            make operational changes visible,
            and keep consequential authority independently controlled.

          </p>

          <div className="flex justify-center mt-8">

            <button
              className="inline-flex items-center gap-2
                bg-white text-blue-600
                px-6 py-3 rounded-xl
                font-medium hover:bg-blue-50 transition"
            >

              Explore the Architecture

              <ArrowRight size={17} />

            </button>

          </div>

        </div>

      </section>


    </div>
  );
}