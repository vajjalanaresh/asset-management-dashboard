import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBuilding } from "./queries";
import { ArrowLeft, Building2 } from "lucide-react";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().trim().min(1, "Building name is required"),
  description: z.string().trim().optional(),
  address: z.string().trim().optional(),
  status: z.enum(["Active", "Inactive"]),
  square_footage: z.number().positive("Must be a positive number").optional(),
});

/* Explicit form type */
type FormData = {
  name: string;
  description?: string;
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
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600"
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
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8"
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <Building2 className="w-7 h-7" />
        </div>

        {/* -------- BASIC INFO -------- */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <FormField label="Building Name" error={errors.name?.message}>
            <input
              {...register("name")}
              placeholder="e.g. Corporate Tower"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Optional description about this building"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </FormField>

          <FormField label="Address">
            <input
              {...register("address")}
              placeholder="City, State"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </FormField>
        </section>

        {/* -------- STATUS -------- */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Active"
                {...register("status")}
                className="accent-blue-600"
              />
              Active
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Inactive"
                {...register("status")}
                className="accent-blue-600"
              />
              Inactive
            </label>
          </div>
        </section>

        {/* -------- METADATA -------- */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Additional Details
          </h3>

          <FormField
            label="Square Footage"
            error={errors.square_footage?.message}
          >
            <input
              type="number"
              {...register("square_footage", {
                valueAsNumber: true,
                setValueAs: (v) =>
                  v === "" || Number.isNaN(v) ? undefined : v,
              })}
              placeholder="e.g. 12000"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </FormField>
        </section>

        {/* -------- ACTIONS -------- */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
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

        {mutation.isError && (
          <p className="text-red-600 text-sm">
            Failed to create building. Please check the details and try again.
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
