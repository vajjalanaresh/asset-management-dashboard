import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCustomers, deleteCustomerCascade } from "./queries";
import { useNavigate } from "react-router-dom";
import { Users, Trash2, Boxes } from "lucide-react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useState } from "react";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

export default function CustomersList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomerCascade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedCustomer(null);
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Customers" }]} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Partner Customers
          </h2>
          <p className="text-gray-500">
            Manage organizational entities and building access.
          </p>
        </div>
        <button
          onClick={() => navigate("/customers/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200"
        >
          + Add Customer
        </button>
      </div>

      {/* ✅ EMPTY STATE */}
      {!customers || customers.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <Boxes className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 font-semibold">No customers found</p>
          <p className="text-gray-400 text-sm mt-1">
            Start by creating your first customer
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => {
            const buildingCount = customer.buildings?.[0]?.count ?? 0;

            return (
              <div
                key={customer.id}
                onClick={() => navigate(`/customers/${customer.id}/buildings`)}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer relative"
              >
                {/* Delete button (only if no buildings) */}
                {buildingCount === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(customer.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Users className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                      {customer.name}
                    </h3>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Customer
                    </span>

                    {buildingCount > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {buildingCount} building(s)
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-blue-600 font-medium">
                    View Buildings
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!selectedCustomer}
        title="Delete Customer"
        description="This will permanently delete the customer, all related buildings, and all assets. This action cannot be undone."
        confirmText="Delete Everything"
        onCancel={() => setSelectedCustomer(null)}
        onConfirm={() =>
          selectedCustomer && deleteMutation.mutate(selectedCustomer)
        }
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
