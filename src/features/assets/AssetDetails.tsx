import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { fetchAssetById, updateAssetStatus, deleteAsset } from "./queries";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  Boxes,
  ArrowLeft,
  CheckCircle,
  Wrench,
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";

/* ---------------- Component ---------------- */

export default function AssetDetails() {
  const { customerId, buildingId, assetId } = useParams<{
    customerId: string;
    buildingId: string;
    assetId: string;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);

  const {
    data: asset,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: () => fetchAssetById(assetId!),
    enabled: !!assetId,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateAssetStatus(assetId!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset", assetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assets", buildingId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAsset(assetId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", buildingId],
      });
      navigate(`/customers/${customerId}/buildings/${buildingId}/assets`);
    },
  });

  /* ---------------- States ---------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        Failed to load asset details
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/customers" },
          {
            label: "Buildings",
            href: `/customers/${customerId}/buildings`,
          },
          {
            label: "Assets",
            href: `/customers/${customerId}/buildings/${buildingId}/assets`,
          },
          { label: asset.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-gray-900">{asset.type || "Unknown type"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(
                `/customers/${customerId}/buildings/${buildingId}/assets/${assetId}/edit`,
              )
            }
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-semibold text-gray-700"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-semibold text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Asset Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top */}
        <div className="p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Boxes className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                Asset Type
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {asset.type || "N/A"}
              </p>
            </div>
          </div>

          <StatusBadge status={asset.status} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Details */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Status" value={asset.status} />
          <DetailItem label="Category" value={asset.type} />
          <DetailItem
            label="Created At"
            value={new Date(asset.created_at).toLocaleDateString()}
          />
        </div>

        {/* Status Actions */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 flex flex-col sm:flex-row gap-4">
          {asset.status !== "Active" && (
            <ActionButton
              label="Mark Active"
              onClick={() => statusMutation.mutate("Active")}
            />
          )}
          {asset.status !== "Inactive" && (
            <ActionButton
              label="Mark Inactive"
              onClick={() => statusMutation.mutate("Inactive")}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDelete}
        title="Delete Asset"
        description="This asset will be permanently deleted. This action cannot be undone."
        confirmText="Delete Asset"
        onCancel={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-900 font-medium">{value || "—"}</p>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-green-50 text-green-700">
        <CheckCircle className="w-4 h-4" />
        Active
      </span>
    );
  }

  if (status === "Maintenance") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-amber-50 text-amber-700">
        <Wrench className="w-4 h-4" />
        Maintenance
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-600">
      <AlertTriangle className="w-4 h-4" />
      {status}
    </span>
  );
}
