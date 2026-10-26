import Link from "next/link";
import PublicationPage from "../components/PublicationPage";

export default function GemlaZetaResearchPage() {
  return (
    <PublicationPage
      date="2026"
      title="GEMLA-Zeta RH Test Evidence Packet"
      dek="A bounded research interface for reviewing GEMLA-Zeta results, theorem-bridge material, controlled test outputs, and versioned evidence without distributing the private implementation repository."
      links={[
        { label: "Open evidence dashboard", href: "/gemla-zeta" },
        { label: "Research access", href: "/gemla-zeta/checkout" },
      ]}
      sections={[
        {
          id: "overview",
          label: "Overview",
          content: (
            <>
              <p>
                GEMLA-Zeta is presented here as a research evidence package rather than a standalone claim of proof. The publication page separates the public research description from the account-gated evidence dashboard and private implementation layer.
              </p>
              <p>
                The public layer explains what is being evaluated, what evidence is exposed, and where the claim boundaries sit. The controlled dashboard is used for result summaries, theorem-bridge reports, selected exports, and bounded test tools.
              </p>
            </>
          ),
        },
        {
          id: "research-question",
          label: "Research question",
          content: (
            <>
              <p>
                The central question is whether a finite, auditable GEMLA pipeline can organize RH-facing numerical and theorem-bridge evidence into explicit gates, margins, controls, and proof-object boundaries without turning computational evidence into an unsupported theorem claim.
              </p>
              <blockquote>
                The evidence system is designed to distinguish computational support, open proof obligations, and theorem-grade conclusions.
              </blockquote>
            </>
          ),
        },
        {
          id: "evidence-model",
          label: "Evidence model",
          content: (
            <>
              <p>The evidence package is organized around four practical layers:</p>
              <ul>
                <li>versioned result summaries and theorem-bridge notes;</li>
                <li>controlled evidence packets and structured exports;</li>
                <li>bounded server-side test tools where enabled; and</li>
                <li>explicit boundaries separating observed evidence from unresolved proof objects.</li>
              </ul>
              <p>
                This keeps the research page readable while allowing deeper inspection through the controlled dashboard.
              </p>
            </>
          ),
        },
        {
          id: "access-and-reproducibility",
          label: "Access and reproducibility",
          content: (
            <>
              <p>
                Access is account-bound. Selected reports and exports may be watermarked, while the private repository and internal validation corpus remain server-side. The goal is to make the exposed research traceable and reviewable without treating source distribution as a prerequisite for every level of access.
              </p>
              <p>
                <Link href="/gemla-zeta">Open the GEMLA-Zeta evidence dashboard overview</Link> for the current access model and included materials.
              </p>
            </>
          ),
        },
        {
          id: "claim-boundary",
          label: "Claim boundary",
          content: (
            <>
              <p>
                The current evidence packet should not be presented as a declaration that the Riemann Hypothesis has been proved, nor as a substitute for the proof standards required by the mathematical community. Its role is narrower: to expose the structure of the computational audit, the evidence it produces, and the proof obligations that remain open.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
