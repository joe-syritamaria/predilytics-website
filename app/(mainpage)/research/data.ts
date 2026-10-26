export type PublicationLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ResearchPublication = {
  slug: string;
  title: string;
  shortTitle: string;
  date: string;
  category: string;
  description: string;
  href: string;
  links: PublicationLink[];
};

export const researchPublications: ResearchPublication[] = [
  {
    slug: "gemla-zeta",
    title: "GEMLA-Zeta RH Test Evidence Packet",
    shortTitle: "GEMLA-Zeta",
    date: "2026",
    category: "Research publication",
    description:
      "A bounded research interface for inspecting GEMLA-Zeta result summaries, theorem-bridge reports, evidence packets, and controlled test outputs without exposing the private implementation repository.",
    href: "/research/gemla-zeta",
    links: [
      { label: "Research overview", href: "/research/gemla-zeta" },
      { label: "Evidence dashboard", href: "/gemla-zeta" },
    ],
  },
  {
    slug: "responsible-superintelligence",
    title: "Responsible Superintelligence — Is It Even Possible?",
    shortTitle: "Responsible superintelligence",
    date: "September 13, 2026",
    category: "FrontierGEMLA research",
    description:
      "A public introduction to FrontierGEMLA's proposal for increasing capability while keeping persistent change, authority, audit, recovery, and recursive self-improvement bounded and independently governed.",
    href: "/research/responsible-superintelligence",
    links: [
      { label: "Read the paper", href: "/research/responsible-superintelligence/frontier-gemla-superintelligence.pdf", external: true },
      { label: "Read the addendum", href: "/research/responsible-superintelligence/frontier-gemla-dual-track-addendum.pdf", external: true },
      { label: "GitHub", href: "https://github.com/johnarrackalceles-ui/frontier-gemla-formal", external: true },
    ],
  },
  {
    slug: "navier-stokes",
    title: "Navier–Stokes, FrontierGEMLA, and Extending OpenAI’s Millennium Prize Work with Invariant Transport",
    shortTitle: "Navier–Stokes",
    date: "September 12, 2026",
    category: "FrontierGEMLA research",
    description:
      "A three-layer research pathway from native fluid dynamics through Bayesian latent-state inference to a GEMLA invariant-transport PDE and finite-observation admissibility boundary verdict.",
    href: "/research/navier-stokes",
    links: [
      { label: "Read the paper", href: "/research/navier-stokes/navier-stokes-frontier-gemla.pdf", external: true },
      { label: "Zenodo / DOI", href: "https://doi.org/10.5281/zenodo.22728908", external: true },
      { label: "GEMLA SDK", href: "https://github.com/Predilytics-Inc/gemla-sdk", external: true },
    ],
  },
];
