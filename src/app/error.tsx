"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md space-y-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
    >
      <h2 className="font-semibold text-red-800">Something went wrong</h2>
      <p className="text-sm text-red-700">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
