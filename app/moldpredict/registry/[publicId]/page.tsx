import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WarmServer from "./WarmServer";

interface MoldRegistryPageProps {
  params: { publicId: string };
}

export default async function MoldRegistryPublicPage({ params }: MoldRegistryPageProps) {
  const { publicId } = params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("mold_registry")
    .select(
      `
        id,
        public_id,
        country,
        region_state,
        years_in_existence,
        ownership_type,
        mold_cost_original,
        mold_cost_registry,
        created_at,
        mold_identifiers (
          owner_mold_id,
          owner_company,
          active,
          valid_from,
          valid_to
        ),
        mold_registry_events (
          id,
          current_state,
          comments,
          created_at
        )
      `
    )
    .eq("public_id", publicId)
    .order("created_at", { ascending: false, referencedTable: "mold_registry_events" })
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const activeIdentifier = data.mold_identifiers?.find((item) => item.active) ?? null;

  return (
    <section className="px-6 py-16">
      <WarmServer />
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-10 shadow-sm">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Global Mold Registry
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[rgb(var(--foreground))]">
              Mold Record {data.public_id}
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Universal mold record and history.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--input))] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mold Details
              </p>
              <dl className="mt-4 space-y-3 text-sm text-slate-700">
                <div>
                  <dt className="font-semibold text-slate-900">Current Owner Mold ID</dt>
                  <dd>{activeIdentifier?.owner_mold_id ?? "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Owner Company</dt>
                  <dd>{activeIdentifier?.owner_company ?? "Unspecified"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Country</dt>
                  <dd>{data.country}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Region / State</dt>
                  <dd>{data.region_state}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Years in existence</dt>
                  <dd>{data.years_in_existence}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Ownership type</dt>
                  <dd>{data.ownership_type}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Original mold cost</dt>
                  <dd>${Number(data.mold_cost_original).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Registry mold cost</dt>
                  <dd>${Number(data.mold_cost_registry).toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--input))] p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Timeline
              </p>
              <div className="mt-4 space-y-4">
                {data.mold_registry_events?.length ? (
                  data.mold_registry_events.map((event) => (
                    <div key={event.id} className="rounded-xl border border-[rgb(var(--border))] bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {event.current_state}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{event.comments}</p>
                      <p className="mt-3 text-xs text-slate-500">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No events recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
