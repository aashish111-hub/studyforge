import { headers } from "next/headers";

interface HealthData {
  status: string;
  service: string;
  timestamp: string;
}

async function getHealth(): Promise<HealthData | null> {
  try {
    const h = await headers();
    const host = h.get("host");
    const protocol = host?.startsWith("localhost") ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/health`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HealthPage() {
  const data = await getHealth();

  return (
    <div className="space-y-4">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
        System health
      </h1>
      {data ? (
        <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-semibold text-emerald-600">{data.status}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Service</dt>
            <dd className="font-semibold">{data.service}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Checked at</dt>
            <dd className="font-semibold">{data.timestamp}</dd>
          </div>
        </dl>
      ) : (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Health check failed — could not reach /api/health.
        </p>
      )}
    </div>
  );
}
