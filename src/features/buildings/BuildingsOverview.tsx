import { useQuery } from "@tanstack/react-query";
import { fetchAllBuildings } from "./queries";
import { Building2, Boxes } from "lucide-react";

export default function BuildingsOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: fetchAllBuildings,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
      <p className="text-gray-500">
        Manage equipment and assets within each building.
      </p>

      {/* ✅ Empty State */}
      {!data || data.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <Boxes className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 font-semibold">No buildings found</p>
          <p className="text-gray-400 text-sm mt-1">
            Buildings will appear here once they are created
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Building2 className="w-6 h-6" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {b.name}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {b.address || "No address provided"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
