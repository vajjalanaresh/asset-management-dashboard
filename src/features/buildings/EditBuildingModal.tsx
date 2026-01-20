import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBuilding } from "./queries";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().trim().min(1, "Building name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  // opened_date: z.string().optional(),
  square_footage: z.number().positive("Must be positive").optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  building: {
    id: string;
    customer_id: string;
    name: string;
    description?: string | null;
    address?: string | null;
    status: "Active" | "Inactive";
    // opened_date?: string | null;
    square_footage?: number | null;
  };
};

/* ---------------- Component ---------------- */

export default function EditBuildingModal({ open, onClose, building }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* 🔥 CRITICAL FIX: reset form when modal opens */
  useEffect(() => {
    if (!open) return;

    reset({
      name: building.name,
      description: building.description ?? "",
      address: building.address ?? "",
      status: building.status,
      // opened_date: building.opened_date
      //   ? new Date(building.opened_date).toISOString().split("T")[0] // ✅ FIX
      //   : "",
      square_footage: building.square_footage ?? undefined,
    });
  }, [open, building, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      updateBuilding(building.id, {
        ...data,
        // opened_date: data.opened_date || null,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["buildings"] }),
        queryClient.invalidateQueries({
          queryKey: ["buildings", building.customer_id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["building", building.id],
        }),
      ]);

      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center px-4 py-[10vh]">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Edit Building</h2>
          <p className="text-sm text-gray-500">Update building information</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="p-6 space-y-5 overflow-y-auto"
        >
          {/* Name */}
          <FormField label="Building Name" error={errors.name?.message}>
            <input {...register("name")} className="input" />
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <textarea
              {...register("description")}
              rows={3}
              className="input resize-none"
            />
          </FormField>

          {/* Address */}
          <FormField label="Address">
            <input {...register("address")} className="input" />
          </FormField>

          {/* Status */}
          <FormField label="Status">
            <div className="flex gap-6">
              {["Active", "Inactive"].map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={s}
                    {...register("status")}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </FormField>

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
              className="input"
            />
          </FormField>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Failed to update building"}
            </p>
          )}
        </form>
      </div>
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
