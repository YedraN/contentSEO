import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const dynamic = 'force-dynamic';

function DashboardLoading() {
  return (
    <div className="animate-pulse p-8 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClient />
    </Suspense>
  );
}
