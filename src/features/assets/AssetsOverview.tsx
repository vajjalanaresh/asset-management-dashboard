import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAssets } from "./queries";
import { Boxes, CheckCircle, Wrench, AlertCircle } from "lucide-react";

export default function AssetsOverview() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const { data, isLoading } = useQuery({
    queryKey: ["assets", status],
    queryFn: () => fetchAllAssets(status || undefined),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {status ? `${status} Assets` : "All Assets"}
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of assets across all buildings
        </p>
      </div>

      {/* Empty State */}
      {!data || data.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-24 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
            <Boxes className="w-8 h-8" />
          </div>
          <h3 className="text-gray-600 font-semibold">No assets found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {status
              ? `There are no ${status.toLowerCase()} assets available.`
              : "Assets will appear here once they are created."}
          </p>
        </div>
      ) : (
        /* Assets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Boxes className="w-6 h-6" />
                </div>
                <StatusBadge status={asset.status} />
              </div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {asset.name}
              </h3>
              <p className="text-sm text-gray-500">
                {asset.type || "Unknown type"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
        <CheckCircle className="w-4 h-4" />
        Active
      </span>
    );
  }

  if (status === "Maintenance") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
        <Wrench className="w-4 h-4" />
        Maintenance
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
      <AlertCircle className="w-4 h-4" />
      {status}
    </span>
  );
}
