import Image from "next/image";
import PublicationPage from "../components/PublicationPage";

const Figure = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) => (
  <figure className="my-10">
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1100}
      className="h-auto w-full rounded-2xl border border-[rgb(var(--border))] bg-white"
    />
    <figcaption>{caption}</figcaption>
  </figure>
);

export default function ResponsibleSuperintelligencePage() {
  return (
    <PublicationPage
      date="September 13, 2026"
      category="FrontierGEMLA research"
      title="Responsible Superintelligence — Is It Even Possible? Yes!"
      dek="A public introduction to FrontierGEMLA's proposal for allowing advanced intelligence to become more capable while keeping persistent change, audit, authority, recovery, and deployment bounded and accountable."
      author="Predilytics Inc."
      authorHref="https://www.linkedin.com/company/predilytics-inc/"
      links={[
        {
          label: "Read the FrontierGEMLA paper",
          href: "/images/FrontierGEMLA_conditional%20S3%20bounded-superintelligence%20candidate.pdf",
          external: true,
        },
        {
          label: "FrontierGEMLA paper on Zenodo",
          href: "https://zenodo.org/records/23672945",
          external: true,
        },
        {
          label: "Read the dual-track addendum",
          href: "/images/FrontierGEMLA_Dual_Track_Addendum_v5.4.pdf",
          external: true,
        },
        {
          label: "Dual-track addendum on Zenodo",
          href: "https://zenodo.org/records/23673223",
          external: true,
        },
        {
          label: "GitHub repository",
          href: "https://github.com/johnarrackalceles-ui/frontier-gemla-formal",
          external: true,
        },
      ]}
      sections={[
        {
          id: "question",
          label: "The question",
          content: (
            <>
              <p>
                Superintelligence is increasingly discussed as a system that
                could become more capable than the people operating it. The
                central question for FrontierGEMLA is not simply whether
                capability can grow, but whether capability can grow without
                giving the same system unlimited authority over the rules that
                certify, constrain, and recover it.
              </p>

              <p>
                Humanity has repeatedly advanced by exploring beyond what was
                already understood. FrontierGEMLA starts from a similar premise
                for artificial intelligence: cognitive exploration can remain
                broad, while persistent operational change and consequential
                authority are subjected to separate governance paths.
              </p>

              <blockquote>
                The system may become cognitively more capable than the
                operational architecture is prepared to certify, and the
                operational architecture may be more capable than the current
                authority envelope permits it to execute.
              </blockquote>
            </>
          ),
        },

        {
          id: "open-source-principle",
          label: "Open capability, bounded authority",
          content: (
            <>
              <p>
                One direction is to keep the superintelligence research stack
                open enough for inspection, reuse, and independent
                experimentation, while ensuring that operational authority is
                not self-granted. This aligns naturally with the broader
                principle that advanced AI should expand human capability rather
                than merely concentrate capability inside an opaque autonomous
                system.
              </p>

              <p>
                FrontierGEMLA therefore emphasizes bounded authority,
                observability, auditability, semantic translation, recovery,
                interoperability, and distributed agency. Open cognition is
                compatible with bounded operation only when persistent changes
                move through an independent certification path.
              </p>

              <p>
                The formal paper describes this as three scopes: cognition,
                persistent operational commitment, and consequential authority.
                They are deliberately not identical.
              </p>
            </>
          ),
        },

        {
          id: "positioning",
          label: "Figure 1 — capability positioning",
          content: (
            <>
              <p>
                Figure 1 places FrontierGEMLA against narrower systems and
                market-frontier platforms across perception, reasoning, tool
                use, cross-domain transfer, long-horizon planning, scientific
                discovery, recursive improvement, and authority boundedness.
              </p>

              <p>
                This is a conceptual positioning map, not a performance
                benchmark. The research claim is conditional: the architecture
                defines a route toward a bounded-superintelligence candidate,
                while empirical cross-domain superiority remains a benchmark
                obligation.
              </p>

              <Figure
                src="/images/Superinteligence%20img%201.png"
                alt="Capability positioning of traditional AI, frontier platforms, and FrontierGEMLA"
                caption="Figure 1. Capability positioning. The source figure explicitly describes this as conceptual positioning rather than a measured performance benchmark."
              />
            </>
          ),
        },

        {
          id: "bounded-mechanism",
          label: "Figure 2 — bounded superintelligence",
          content: (
            <>
              <p>
                At the center of the proposal is the idea that increasing
                intelligence should remain observable, recoverable, and
                constrained by externally governed authority. Figure 2 shows an
                intelligence core surrounded by capabilities for adaptive
                compute, quantified operational objects, agency, translation,
                frozen audit, scoped authority, recovery, cross-domain transfer,
                and recursive self-improvement.
              </p>

              <p>
                The key principle is that capability growth and authority growth
                follow different paths. Recursive improvement can generate a
                candidate successor, but promotion requires an independent
                evidence object and a protected verifier.
              </p>

              <Figure
                src="/images/Superinteligence%20img%202.png"
                alt="Bounded superintelligence mechanism and feedback loops"
                caption="Figure 2. Bounded superintelligence mechanism: more capability is paired with protected audit, scoped authority, and independently reachable recovery."
              />
            </>
          ),
        },

        {
          id: "calibration",
          label: "Figure 3 — calibration and semantic translation",
          content: (
            <>
              <p>
                Figure 3 shows a two-calibration design. The operational path
                can perceive, infer, calibrate, quantize, compose agency
                objects, and propose decisions or architecture changes. A
                separate frozen audit path interprets, constrains, and
                authorizes those proposals.
              </p>

              <p>
                The convention-upgrade path matters because a highly capable
                system may develop internal representations or mathematical
                conventions that differ from human conventions. FrontierGEMLA
                permits translation and versioned convention change, but
                consequential semantic changes are certified rather than
                silently rewritten by the same process being evaluated.
              </p>

              <Figure
                src="/images/Superinteligence%20img%203.png"
                alt="Two-calibration system, semantic translation, and convention upgrade path"
                caption="Figure 3. Operational calibration may adapt, while audit calibration remains protected during the audit epoch."
              />
            </>
          ),
        },

        {
          id: "architecture",
          label: "Figure 4 — the 13-layer stack",
          content: (
            <>
              <p>
                Figure 4 turns the principle into an architecture. The stack
                separates a protected authority plane, a transparent
                operational plane, and a cognitive/research plane. The upper
                layers govern audit, capability grants, and recovery. The
                middle layers handle promotion, translation, agency, quantized
                operational objects, adaptive compute, and observability. The
                lower research layers contain belief-state inference, the
                underlying cognitive substrate, and a research architecture
                laboratory.
              </p>

              <p>
                This is why FrontierGEMLA does not require the intelligence core
                itself to be completely transparent before bounded operation is
                possible. The stronger requirement is that the artifact
                receiving persistent authority expose enough state, provenance,
                semantics, and certificate structure for the declared audit
                claim.
              </p>

              <Figure
                src="/images/Superinteligence%20img%204.png"
                alt="FrontierGEMLA 13-layer stack"
                caption="Figure 4. Three-plane, 13-layer FrontierGEMLA architecture with protected authority, transparent operation, and cognitive/research layers."
              />
            </>
          ),
        },

        {
          id: "algorithms",
          label: "Figures 5–6 — reference algorithms",
          content: (
            <>
              <p>
                The architecture is made explicit through twelve reference
                algorithms. Algorithms 1–6 cover observability registration,
                belief-state inference, calibrated quantization, agency
                admission and ranking, semantic translation, and frozen audit
                verdicts.
              </p>

              <Figure
                src="/images/Superinteligence%20img%205.png"
                alt="Reference algorithms 1 through 6"
                caption="Figure 5. Algorithms 1–6 define the perception → belief → invariant → decision side of the reference stack."
              />

              <p>
                Algorithms 7–12 extend the stack with scoped authority tokens,
                bounded execution, recovery, recursive self-improvement and
                promotion, cross-domain transfer, and audit-epoch upgrades.
                Capability gains are not allowed to compensate for authority
                violations or failed hard constraints.
              </p>

              <Figure
                src="/images/Superinteligence%20img%206.png"
                alt="Reference algorithms 7 through 12"
                caption="Figure 6. Algorithms 7–12 add scoped authority, bounded execution, recovery, recursive promotion, cross-domain transfer, and externally authorized audit-epoch upgrades."
              />
            </>
          ),
        },

        {
          id: "recursive-improvement",
          label: "Recursive improvement and the S1 gate",
          content: (
            <>
              <p>
                The September manuscript defines a development ladder from
                narrow inference through cross-domain agency, self-observation,
                recursive improvement, and finally a conditional S3
                bounded-superintelligence candidate. The October addendum
                decomposes G2 through C2 into two evidence tracks:
                capability/scientific evidence and platform/operational
                assurance.
              </p>

              <p>
                These tracks can advance asynchronously, but S1 is the first
                mandatory convergence gate. A candidate improvement can develop
                in cognition or the shadow laboratory without production
                authority; it becomes a deployed recursive self-improvement only
                when capability evidence, operational evidence, and
                constitutional preservation jointly pass the promotion rule.
              </p>

              <blockquote>
                Candidate intelligence may develop in cognition/shadow space;
                G2–C2 filamentation observes and decomposes that development; S1
                decides whether any improvement becomes deployed recursive
                self-improvement.
              </blockquote>
            </>
          ),
        },

        {
          id: "principle",
          label: "The broader principle",
          content: (
            <>
              <p>
                Taken together, FrontierGEMLA proposes a general mathematical
                and architectural language for observing coherence, transport,
                belief, agency, and control across complex systems — from
                physical dynamics and industrial telemetry to financial
                microstructure, biological rhythms, cyber-physical systems, and
                multi-agent AI.
              </p>

              <blockquote>
                Make complex dynamics observable. Preserve the structure that
                survives. Give intelligence a measurable geometry on which to
                act, while keeping authority bounded and accountable.
              </blockquote>
            </>
          ),
        },
      ]}
    />
  );
}