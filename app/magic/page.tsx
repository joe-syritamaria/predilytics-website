import { Suspense } from "react";
import MagicClient from "./MagicClient";

export const dynamic = "force-dynamic";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="text-lg font-semibold">Signing you in...</div>
        <div className="mt-2 text-sm text-gray-600">Preparing session...</div>
      </div>
    </div>
  );
}

export default function MagicPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MagicClient />
    </Suspense>
  );
}
