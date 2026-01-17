import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import { fetchAssetById, updateAsset } from "./queries";
import { ArrowLeft, Boxes } from "lucide-react";
import { useEffect } from "react";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().min(1, "Asset name is required"),
  type: z.string().min(1, "Asset type is required"),
  status: z.enum(["Active", "Maintenance", "Inactive"]),
});

type FormData = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function AssetEdit() {
  const { customerId, buildingId, assetId } = useParams<{
    customerId: string;
    buildingId: string;
    assetId: string;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Fetch existing asset */
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: () => fetchAssetById(assetId!),
    enabled: !!assetId,
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateAsset(assetId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset", assetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assets", buildingId],
      });
      navigate(
        `/customers/${customerId}/buildings/${buildingId}/assets/${assetId}`,
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* Populate form when data loads */
  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        type: asset.type,
        status: asset.status,
      });
    }
  }, [asset, reset]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        Failed to load asset
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-bold text-black">Edit Asset</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Boxes className="w-7 h-7" />
        </div>

        {/* Name */}
        <FormField label="Asset Name" error={errors.name?.message}>
          <input
            {...register("name")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </FormField>

        {/* Type */}
        <FormField label="Asset Type" error={errors.type?.message}>
          <input
            {...register("type")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </FormField>

        {/* Status */}
        <FormField label="Status">
          <select
            {...register("status")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FormField>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {mutation.isError && (
          <p className="text-red-600 text-sm">
            Failed to update asset. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
