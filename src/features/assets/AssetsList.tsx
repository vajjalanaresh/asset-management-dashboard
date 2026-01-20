import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "./queries";
import { fetchBuildingById } from "../buildings/queries";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import {
  Boxes,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  Building2,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import EditBuildingModal from "../buildings/EditBuildingModal";
import { Pencil } from "lucide-react";
import type { Building } from "../buildings/types";
export default function AssetsList() {
  const { buildingId, customerId } = useParams<{
    customerId: string;
    buildingId: string;
  }>();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [editBuilding, setEditBuilding] = useState<Building | null>(null);

  /* ---------------- Queries ---------------- */

  const { data: building, isLoading: buildingLoading } = useQuery({
    queryKey: ["building", buildingId],
    queryFn: () => fetchBuildingById(buildingId!),
    enabled: !!buildingId,
  });

  const {
    data: assets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assets", buildingId],
    queryFn: () => fetchAssets(buildingId!),
    enabled: !!buildingId,
  });

  if (isLoading || buildingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !building) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        Failed to load assets
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ---------------- Breadcrumbs ---------------- */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/customers" },
          {
            label: "Buildings",
            href: `/customers/${customerId}/buildings`,
          },
          { label: building.name },
        ]}
      />

      {/* ---------------- Building Info Card ---------------- */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Icon + Name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Building2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {building.name}
              </h2>
              <StatusBadge status={building.status} />
            </div>
          </div>

          {/* Right: Assets count + Edit */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="text-sm text-gray-500">
              Assets:{" "}
              <span className="font-semibold text-gray-900">
                {assets?.length ?? 0}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditBuilding(building);
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              aria-label="Edit building"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label="Address"
            value={building.address || "Not provided"}
          />

          <InfoItem
            label="Square Footage"
            value={
              building.square_footage
                ? `${building.square_footage.toLocaleString()} sq ft`
                : "—"
            }
          />

          <InfoItem
            label="Created At"
            value={new Date(building.created_at).toLocaleDateString()}
          />
        </div>

        {/* Description */}
        {building.description && (
          <div className="text-sm text-gray-600">
            <p className={expanded ? "" : "line-clamp-3"}>
              {building.description}
            </p>

            {building.description.length > 120 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-blue-600 font-semibold text-sm"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-500">
            Equipment and infrastructure for this building
          </p>
        </div>

        <Link
          to={`/customers/${customerId}/buildings/${buildingId}/assets/new`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </Link>
      </div>

      {/* ---------------- Assets Grid ---------------- */}
      {!assets?.length ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <Boxes className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 font-semibold">No assets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() =>
                navigate(
                  `/customers/${customerId}/buildings/${buildingId}/assets/${asset.id}`,
                )
              }
              className="cursor-pointer bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Boxes className="w-6 h-6" />
                </div>

                <StatusBadge status={asset.status} />
              </div>

              <h3 className="text-lg font-bold text-gray-900">{asset.name}</h3>

              <p className="text-sm text-gray-500 mt-1">
                {asset.type || "Unknown type"}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-blue-600 font-semibold text-sm">
                  View Details
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      )}
      {editBuilding && (
        <EditBuildingModal
          open={!!editBuilding}
          building={editBuilding}
          onClose={() => setEditBuilding(null)}
        />
      )}
    </div>
  );
}
function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    );
  }

  if (status === "Maintenance") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
        <Wrench className="w-3 h-3" /> Maintenance
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
      <AlertTriangle className="w-3 h-3" /> {status}
    </span>
  );
}
