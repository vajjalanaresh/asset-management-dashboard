import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset } from "./queries";
import { ArrowLeft } from "lucide-react";

// The schema now matches the API's accepted status types
const schema = z.object({
  name: z.string().min(1, "Asset name is required"),
  type: z.string().min(1, "Asset type is required"),
  status: z.enum(["Active", "Inactive"]),
});

type FormData = z.infer<typeof schema>;

export default function AssetCreate() {
  const { customerId, buildingId } = useParams<{
    customerId: string;
    buildingId: string;
  }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createAsset({
        building_id: buildingId!,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", buildingId],
      });
      navigate(`/customers/${customerId}/buildings/${buildingId}/assets`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "Active",
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Asset</h1>
          <p className="text-gray-500">Add a new asset under this building</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Asset Name
          </label>
          <input
            {...register("name")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Asset Type
          </label>
          <input
            {...register("type")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >
            {mutation.isPending ? "Saving..." : "Save Asset"}
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
            Failed to create asset. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
