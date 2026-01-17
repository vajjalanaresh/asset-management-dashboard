import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuilding } from "./queries";
import { ArrowLeft, Building2 } from "lucide-react";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().min(1, "Building name is required"),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  square_footage: z.number().positive("Must be a positive number").optional(),
});

/* ✅ Explicit form type (DO NOT infer here) */
type FormData = {
  name: string;
  address?: string;
  status: "Active" | "Inactive";
  square_footage?: number;
};

/* ---------------- Component ---------------- */

export default function BuildingCreate() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createBuilding({
        customer_id: customerId!,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buildings", customerId],
      });
      navigate(`/customers/${customerId}/buildings`);
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Building</h1>
          <p className="text-gray-500">
            Add a new building under this customer
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6"
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Building2 className="w-7 h-7" />
        </div>

        {/* Name */}
        <FormField label="Building Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="e.g. Corporate Tower"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </FormField>

        {/* Address */}
        <FormField label="Address">
          <input
            {...register("address")}
            placeholder="City, State"
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
            <option value="Inactive">Inactive</option>
          </select>
        </FormField>

        {/* Square Footage */}
        <FormField
          label="Square Footage"
          error={errors.square_footage?.message}
        >
          <input
            type="number"
            {...register("square_footage", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" || Number.isNaN(v) ? undefined : v),
            })}
            placeholder="e.g. 12000"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </FormField>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
          >
            {mutation.isPending ? "Saving..." : "Save Building"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* Error */}
        {mutation.isError && (
          <p className="text-red-600 text-sm">
            Failed to create building. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

/* ---------------- Reusable Field ---------------- */

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
