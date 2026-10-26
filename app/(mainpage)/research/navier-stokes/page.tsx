import Image from "next/image";
import PublicationPage from "../components/PublicationPage";

export default function NavierStokesResearchPage() {
  return (
    <PublicationPage
      date="September 12, 2026"
      category="FrontierGEMLA research"
      title="Navier–Stokes, FrontierGEMLA, and Extending OpenAI’s Millennium Prize Work with Invariant Transport"
      dek="A simple three-layer research pathway from native fluid dynamics, through Bayesian inference under incomplete observation, to a GEMLA invariant-transport PDE and an admissibility boundary verdict."
      author="Biju Jose"
      authorHref="https://www.linkedin.com/in/bijujose1/"
      links={[
        {
          label: "Read the paper",
          href: "/images/NS_gemla%20paper.pdf",
          external: true,
        },
        {
          label: "Zenodo / DOI",
          href: "https://doi.org/10.5281/zenodo.22728908",
          external: true,
        },
        {
          label: "GEMLA SDK",
          href: "https://github.com/Predilytics-Inc/gemla-sdk",
          external: true,
        },
      ]}
      sections={[
        {
          id: "why-this-matters",
          label: "Why this matters",
          content: (
            <>
              <p>
                What do Navier–Stokes equations have in common with injection
                molding? Fluid flow within mold waterlines, telemetry from an
                injection machine, molten plastic moving through the barrel and
                into mold cavities, and simulated moldflow analysis all produce
                evolving patterns.
              </p>

              <p>
                A complete microscopic description of those patterns can be
                expensive or inaccessible. FrontierGEMLA asks a narrower
                observational question: can a stable transport signature still
                be detected under finite resolution?
              </p>

              <p>
                The paper develops that question in four steps: explain
                Navier–Stokes in general terms, summarize the earlier NS-GEMLA
                development, place the September 2026 OpenAI work into the
                research landscape, and formulate an updated three-layer PDE
                program with Bayesian inference for gaps in telemetry.
              </p>

              <blockquote>
                Native dynamics → Bayesian latent state → GEMLA invariant PDE →
                admissibility boundary verdict.
              </blockquote>
            </>
          ),
        },

        {
          id: "overview-figure",
          label: "From cancellation to coherent transport",
          content: (
            <>
              <p>
                The overview figure contrasts an engineered cancellation
                construction with the GEMLA research proposal. GEMLA does not
                try to cancel the geometry. It asks whether measurable transport
                structure survives and stabilizes across resolutions.
              </p>

              <figure className="my-10">
                <Image
                  src="/images/NavierStokes.png"
                  alt="From cancellation to coherent transport — a GEMLA view of Navier-Stokes"
                  width={1536}
                  height={991}
                  className="h-auto w-full rounded-2xl border border-[rgb(var(--border))] bg-white"
                />
                <figcaption>
                  From cancellation to coherent transport — a GEMLA view of
                  Navier–Stokes.
                </figcaption>
              </figure>

              <p>
                The proposed bridge is intentionally incomplete: an observation
                or embedding theorem would first connect Navier–Stokes behavior
                to an invariant transport description, and a separate PDE
                theorem would still be needed to connect that invariant to
                regularity or blowup constraints.
              </p>
            </>
          ),
        },

        {
          id: "navier-stokes-basics",
          label: "Navier–Stokes in general terms",
          content: (
            <>
              <p>
                Navier–Stokes gives a compact mathematical language for fluid
                motion. Velocity changes in time, moving fluid carries its own
                velocity, pressure pushes the fluid, viscosity smooths velocity
                differences, and external forcing can add energy or momentum.
                In three dimensions, vorticity can also be stretched, which is
                one reason the problem is difficult.
              </p>

              <p>
                A finite-time singularity is a sharper mathematical idea than
                ordinary turbulence: a smooth solution continues up to a finite
                time while some norm grows without finite bound. In GEMLA
                terms, this motivates a boundary-approach question — even if
                native fields become highly concentrated, does a normalized
                transport signature remain observable?
              </p>
            </>
          ),
        },

        {
          id: "ns-gemla",
          label: "Earlier NS-GEMLA development",
          content: (
            <>
              <p>
                The earlier NS-GEMLA work treated turbulence as a
                finite-observable transport problem. A resolution-indexed
                surrogate is constructed, transport observables are extracted,
                and the audit asks whether the renormalized geometry stabilizes,
                changes, or keeps revealing new structure under refinement.
              </p>

              <p>
                Candidate observables include lifted phase, winding, braid
                structure, residuals, pressure margins, topology persistence,
                and cross-slice coupling. In a sheet-based representation,
                two-dimensional vorticity structures can be tracked first, then
                coupled across slices to form a three-dimensional surrogate.
              </p>

              <blockquote>
                Two flows may differ in microscopic vorticity texture while
                belonging to the same audited transport class if their
                renormalized transport observables converge under refinement.
              </blockquote>
            </>
          ),
        },

        {
          id: "openai-catalyst",
          label: "The September 2026 catalyst",
          content: (
            <>
              <p>
                The paper treats the September 2026 OpenAI Navier–Stokes
                submission as a catalyst for a more precise GEMLA research
                question. The useful benchmark is a concentrating flow with
                vortex spiraling, stretching, large local terms, and a
                finite-time boundary.
              </p>

              <p>
                FrontierGEMLA asks an adjacent question rather than claiming to
                replace the native PDE proof: can a transport invariant remain
                visible and nonzero as the flow approaches that finite-time
                boundary, with persistence supported by geometry, topology,
                phase coupling, or positive transport magnitude rather than by
                signed residual cancellation?
              </p>
            </>
          ),
        },

        {
          id: "three-layer-program",
          label: "The three-layer PDE program",
          content: (
            <>
              <h3>Layer 1 — native dynamics</h3>

              <p>
                Layer 1 is the domain itself: for Navier–Stokes, velocity,
                pressure, and vorticity; for an engineered process, the
                corresponding physical or telemetry state. GEMLA does not
                replace this native layer.
              </p>

              <h3>Layer 2 — Bayesian latent-state inference</h3>

              <p>
                Layer 2 estimates the hidden state consistent with finite and
                possibly incomplete observations. Missing channels are carried
                explicitly through a missingness mask. The intended rule is to
                infer latent state and widen uncertainty, rather than silently
                invent missing data as certified observation.
              </p>

              <h3>Layer 3 — GEMLA invariant transport</h3>

              <p>
                Layer 3 maps the posterior into a probability density over a
                GEMLA invariant manifold and transports that density through
                drift, uncertainty diffusion, organized transport, admissible
                sector transitions, and missing-data effects. This layer
                produces the observable transport geometry and boundary verdict;
                it is not itself a proof of the native Navier–Stokes PDE.
              </p>
            </>
          ),
        },

        {
          id: "invariant-question",
          label: "The nonvanishing invariant question",
          content: (
            <>
              <p>
                The core research target is a resolution-stable packet built
                from quantities such as lifted transport phase, winding count,
                braid structure, helicity-like linking, persistent topology, and
                cross-slice phase structure.
              </p>

              <p>
                Two conditions matter. First, the transport representation
                should stabilize as observation resolution increases. Second,
                its magnitude should remain nonzero instead of surviving only
                because large signed quantities cancel. Near a finite-time
                event, increasing resolution can be coupled to the remaining
                time before the boundary.
              </p>

              <p>
                The program is falsifiable: the proposed invariant can vanish,
                fail to stabilize, collapse under matched controls, or prove
                under-observed. Each of those is a valid research outcome.
              </p>
            </>
          ),
        },

        {
          id: "moldpredict",
          label: "MoldPredict as an engineered analogue",
          content: (
            <>
              <p>
                MoldPredict gives the same observation structure a practical
                engineering embodiment. Pressure, temperature, screw position,
                velocity, RPM, back pressure, injection time, hold time,
                recovery time, material state, and quality outputs form coupled
                trajectories.
              </p>

              <p>
                Missing telemetry is handled through the Bayesian layer. The
                system can continue predicting with a wider posterior and lower
                action confidence rather than stalling immediately. A
                phase-critical gap can produce a low-observability warning or
                safe hold, while still distinguishing process risk from
                observation risk.
              </p>

              <blockquote>
                In the engineered embodiment, the finite-time idea becomes
                operational: predict approach to an inadmissible process
                boundary before the machine produces rejects.
              </blockquote>
            </>
          ),
        },

        {
          id: "research-protocol",
          label: "Research protocol",
          content: (
            <>
              <ol>
                <li>
                  Choose a declared Navier–Stokes dataset, simulation, or
                  proof-derived benchmark family.
                </li>

                <li>
                  Define a resolution family and compute velocity, vorticity,
                  and slice fields.
                </li>

                <li>
                  Extract sheet-level and cross-slice coupling packets.
                </li>

                <li>
                  Build the transport invariant from phase, winding, braid,
                  linking, persistence, and cross-slice observables.
                </li>

                <li>Test stability across resolutions.</li>

                <li>
                  Test nonvanishing with positive-magnitude and
                  topology-persistence metrics.
                </li>

                <li>
                  Compare against time shuffle, slice shuffle, phase
                  randomization, energy-preserving scramble, and
                  residual-cancellation controls.
                </li>

                <li>
                  Report only the supported outcome: stable, unstable,
                  open-ended, control-collapsed, or under-observed.
                </li>
              </ol>
            </>
          ),
        },
      ]}
    />
  );
}