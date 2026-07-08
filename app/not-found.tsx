import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <div>
      <PageHeader eyebrow="404" title="Page Not Found" description="The route does not exist, but the market dashboard is still one click away." />
      <Card>
        <Link href="/" className="inline-flex rounded-lg bg-mint px-4 py-3 text-sm font-semibold text-ink hover:bg-emerald-300">
          Return to Dashboard
        </Link>
      </Card>
    </div>
  );
}
