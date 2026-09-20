import { GenerateClient } from "@/components/GenerateClient";

// Server Component shell; all interactivity/data-fetching lives in the
// client child since it depends on sessionStorage and a POST request.
export default function GeneratePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Generated study material</h1>
      <GenerateClient />
    </div>
  );
}
