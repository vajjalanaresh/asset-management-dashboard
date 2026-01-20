import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "./queries";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { getErrorMessage } from "../../utils/getErrorMessage";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().trim().min(1, "Customer name is required"),
});

type FormData = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function CustomerCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => createCustomer(data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Customer</h1>
          <p className="text-gray-500">
            Add a new customer to your organization
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6"
      >
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Users className="w-8 h-8" />
        </div>

        {/* Customer Name */}
        <FormField label="Customer Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="e.g. Acme Corporation"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </FormField>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {mutation.isPending ? "Saving..." : "Create Customer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {/* 🔥 Contextual Error */}
        {mutation.isError && (
          <p className="text-red-600 text-sm">
            {getErrorMessage(mutation.error)}
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
