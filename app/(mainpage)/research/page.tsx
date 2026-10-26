import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { researchPublications } from "./data";

export default function ResearchPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
      <header className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">
          Predilytics Research Lab
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Research and technical publications
        </h1>
        <p className="mt-6 text-lg leading-8 text-[rgb(var(--foreground))]/70">
          Technical work on GEMLA, calibrated invariant transport, and bounded research systems.
          Each publication page includes a direct paper or evidence link and a quick-scroll section guide.
        </p>
      </header>

      <div className="mt-14 border-t border-[rgb(var(--border))]">
        {researchPublications.map((publication) => (
          <article
            key={publication.slug}
            className="grid gap-5 border-b border-[rgb(var(--border))] py-8 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-start"
          >
            <div className="text-sm text-[rgb(var(--foreground))]/50">
              <p>{publication.date}</p>
              <p className="mt-1">Publication</p>
            </div>

            <div>
              <Link href={publication.href} className="group inline-block">
                <h2 className="text-2xl font-semibold tracking-tight transition group-hover:text-blue-600 md:text-3xl">
                  {publication.title}
                </h2>
              </Link>
              <p className="mt-3 max-w-3xl leading-7 text-[rgb(var(--foreground))]/68">
                {publication.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {publication.links.map((link) =>
                  link.external ? (
                    <a
                      key={`${publication.slug}-${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <Link
                      key={`${publication.slug}-${link.label}`}
                      href={link.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </Link>
                  ),
                )}
              </div>
            </div>

            <Link
              href={publication.href}
              aria-label={`Open ${publication.title}`}
              className="hidden rounded-full border border-[rgb(var(--border))] p-3 text-[rgb(var(--foreground))]/65 transition hover:border-blue-600 hover:text-blue-600 md:inline-flex"
            >
              <ArrowRight size={18} />
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
