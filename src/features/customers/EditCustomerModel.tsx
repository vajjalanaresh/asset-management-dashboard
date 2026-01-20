import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "./queries";

/* ---------------- Schema ---------------- */

const schema = z.object({
  name: z.string().trim().min(1, "Customer name is required"),
});

type FormData = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function EditCustomerModal({
  open,
  onClose,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  customer: { id: string; name: string };
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateCustomer(customer.id, data),

    onSuccess: async () => {
      // ✅ Invalidate ALL dependent queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["customers"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["customer", customer.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["buildings", customer.id],
        }),
      ]);

      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer.name,
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center px-4 py-[10vh]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
          <p className="text-sm text-gray-500">Update customer information</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Customer Name
            </label>
            <input
              {...register("name")}
              className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
              Failed to update customer. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
