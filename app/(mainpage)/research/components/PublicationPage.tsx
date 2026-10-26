import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicationLink } from "../data";

export type PublicationSection = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type PublicationPageProps = {
  date: string;
  category?: string;
  title: string;
  dek: string;
  author?: string;
  authorHref?: string;
  publisher?: string;
  links?: PublicationLink[];
  sections: PublicationSection[];
};

export default function PublicationPage({
  date,
  category = "Research publication",
  title,
  dek,
  author,
  authorHref,
  publisher = "Predilytics Inc.",
  links = [],
  sections,
}: PublicationPageProps) {
  return (
    <article className="mx-auto w-full max-w-7xl px-6 py-14 md:py-20">
      <header className="mx-auto max-w-5xl border-b border-[rgb(var(--border))] pb-10 md:pb-14">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[rgb(var(--foreground))]/60">
          <span>{publisher}</span>
          <span aria-hidden="true">•</span>
          <span>{date}</span>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-[rgb(var(--foreground))]/70">
            Research
          </span>
          <span className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-[rgb(var(--foreground))]/70">
            {category}
          </span>
        </div>

        <h1 className="max-w-5xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-[rgb(var(--foreground))]/70 md:text-xl">
          {dek}
        </p>

        {author && (
          <p className="mt-5 text-sm text-[rgb(var(--foreground))]/60">
            By {authorHref ? (
              <a
                href={authorHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[rgb(var(--foreground))] underline decoration-[rgb(var(--border))] underline-offset-4"
              >
                {author}
              </a>
            ) : (
              <span className="font-semibold text-[rgb(var(--foreground))]">{author}</span>
            )}
          </p>
        )}

        {links.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => {
              const className =
                "inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 underline decoration-blue-600/35 underline-offset-4 transition hover:text-blue-500";

              if (link.external) {
                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {link.label}
                    <ArrowUpRight size={14} />
                  </a>
                );
              }

              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className={className}
                >
                  {link.label}
                  <ArrowUpRight size={14} />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 lg:border-0 lg:bg-transparent lg:p-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[rgb(var(--foreground))]/45">
              On this page
            </p>
            <nav aria-label="Publication sections">
              <ul className="space-y-1 border-l border-[rgb(var(--border))]">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block border-l border-transparent px-4 py-2 text-sm leading-5 text-[rgb(var(--foreground))]/60 transition hover:border-blue-600 hover:text-blue-600"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={`scroll-mt-28 ${index === 0 ? "" : "mt-16 border-t border-[rgb(var(--border))] pt-16"}`}
            >
              <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">
                {section.label}
              </h2>
              <div className="space-y-5 text-[17px] leading-8 text-[rgb(var(--foreground))]/78 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-600 [&_blockquote]:pl-5 [&_blockquote]:text-[rgb(var(--foreground))]/70 [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:leading-6 [&_figcaption]:text-[rgb(var(--foreground))]/55 [&_h3]:pt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol]:space-y-2 [&_ul]:space-y-2">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
