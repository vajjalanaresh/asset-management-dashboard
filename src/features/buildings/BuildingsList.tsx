import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBuildings, deleteBuildingCascade } from "./queries";
import { fetchCustomerById } from "../customers/queries";
import {
  Building2,
  MapPin,
  ArrowRight,
  Plus,
  Trash2,
  Users,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Breadcrumbs from "../../components/ui/Breadcrumbs";
import EditCustomerModal from "../customers/EditCustomerModel";

export default function BuildingsList() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ---------------- Queries ---------------- */

  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => fetchCustomerById(customerId!),
    enabled: !!customerId,
  });

  const {
    data: buildings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["buildings", customerId],
    queryFn: () => fetchBuildings(customerId!),
    enabled: !!customerId,
  });

  const deleteMutation = useMutation({
    mutationFn: (buildingId: string) => deleteBuildingCascade(buildingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buildings", customerId],
      });
      setSelectedBuilding(null);
    },
  });

  if (isLoading || customerLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        Failed to load data
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Customers", href: "/customers" },
          { label: customer.name },
        ]}
      />

      {/* Customer Info Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Buildings:{" "}
            <span className="font-semibold text-gray-900">
              {buildings?.length ?? 0}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditCustomer({
                id: customer.id,
                name: customer.name,
              });
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Edit customer"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
          <p className="text-gray-500 mt-1">
            Facilities and sites under this customer
          </p>
        </div>

        <Link
          to={`/customers/${customerId}/buildings/new`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Building
        </Link>
      </div>

      {/* Buildings Grid */}
      {!buildings?.length ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
          <Building2 className="w-10 h-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 font-semibold">No buildings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <div
              key={building.id}
              onClick={() =>
                navigate(
                  `/customers/${customerId}/buildings/${building.id}/assets`,
                )
              }
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBuilding(building.id);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Building2 className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                {building.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <MapPin className="w-4 h-4" />
                {building.address || "No address provided"}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-blue-600 font-semibold text-sm">
                  View Assets
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!selectedBuilding}
        title="Delete Building"
        description="This will delete the building and all related assets. This action cannot be undone."
        confirmText="Delete Building"
        onCancel={() => setSelectedBuilding(null)}
        onConfirm={() =>
          selectedBuilding && deleteMutation.mutate(selectedBuilding)
        }
        loading={deleteMutation.isPending}
      />

      {/* Edit Customer Modal */}
      {editCustomer && (
        <EditCustomerModal
          open={!!editCustomer}
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
        />
      )}
    </div>
  );
}
