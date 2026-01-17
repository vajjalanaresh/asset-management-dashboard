// import { Routes, Route, Navigate } from "react-router-dom";
// import { ProtectedRoute } from "./app/routes/ProtectedRoute";

// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";

// import CustomersList from "./features/customers/CustomersList";
// import CustomerCreate from "./features/customers/CustomerCreate";

// import BuildingsList from "./features/buildings/BuildingsList";
// import BuildingCreate from "./features/buildings/BuildingCreate";

// import AssetsList from "./features/assets/AssetsList";
// import AssetCreate from "./features/assets/AssetCreate";

// import AppLayout from "./components/layout/AppLayout";
// import AssetDetails from "./features/assets/AssetDetails";
// import AssetEdit from "./features/assets/AssetEdit";
// import AssetsOverview from "./features/assets/AssetsOverview";
// import BuildingsOverview from "./features/buildings/BuildingsOverview";

// export default function App() {
//   return (
//     <Routes>
//       {/* Public Route */}
//       <Route path="/login" element={<Login />} />

//       {/* Protected App Layout */}
//       <Route
//         element={
//           <ProtectedRoute>
//             <AppLayout />
//           </ProtectedRoute>
//         }
//       >
//         {/* Default redirect */}
//         <Route path="/" element={<Navigate to="/dashboard" />} />

//         {/* Dashboard */}
//         <Route path="/dashboard" element={<Dashboard />} />

//         {/* Customers */}
//         <Route path="/customers" element={<CustomersList />} />
//         <Route path="/customers/new" element={<CustomerCreate />} />

//         {/* Buildings */}
//         <Route
//           path="/customers/:customerId/buildings"
//           element={<BuildingsList />}
//         />
//         <Route
//           path="/customers/:customerId/buildings/new"
//           element={<BuildingCreate />}
//         />

//         {/* Assets */}
//         <Route
//           path="/customers/:customerId/buildings/:buildingId/assets"
//           element={<AssetsList />}
//         />
//         <Route
//           path="/customers/:customerId/buildings/:buildingId/assets/new"
//           element={<AssetCreate />}
//         />
//       </Route>
//       <Route
//         path="/customers/:customerId/buildings/:buildingId/assets/:assetId"
//         element={<AssetDetails />}
//       />
//       <Route
//         path="/customers/:customerId/buildings/:buildingId/assets/:assetId/edit"
//         element={<AssetEdit />}
//       />
//       <Route path="/assets" element={<AssetsOverview />} />
//       <Route path="/buildings" element={<BuildingsOverview />} />
//     </Routes>
//   );
// }

import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./app/routes/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import CustomersList from "./features/customers/CustomersList";
import CustomerCreate from "./features/customers/CustomerCreate";

import BuildingsList from "./features/buildings/BuildingsList";
import BuildingsOverview from "./features/buildings/BuildingsOverview";
import BuildingCreate from "./features/buildings/BuildingCreate";

import AssetsList from "./features/assets/AssetsList";
import AssetsOverview from "./features/assets/AssetsOverview";
import AssetCreate from "./features/assets/AssetCreate";
import AssetDetails from "./features/assets/AssetDetails";
import AssetEdit from "./features/assets/AssetEdit";

import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Customers */}
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/customers/new" element={<CustomerCreate />} />

        {/* Buildings */}
        <Route path="/buildings" element={<BuildingsOverview />} />
        <Route
          path="/customers/:customerId/buildings"
          element={<BuildingsList />}
        />
        <Route
          path="/customers/:customerId/buildings/new"
          element={<BuildingCreate />}
        />

        {/* Assets */}
        <Route path="/assets" element={<AssetsOverview />} />
        <Route
          path="/customers/:customerId/buildings/:buildingId/assets"
          element={<AssetsList />}
        />
        <Route
          path="/customers/:customerId/buildings/:buildingId/assets/new"
          element={<AssetCreate />}
        />
        <Route
          path="/customers/:customerId/buildings/:buildingId/assets/:assetId"
          element={<AssetDetails />}
        />
        <Route
          path="/customers/:customerId/buildings/:buildingId/assets/:assetId/edit"
          element={<AssetEdit />}
        />
      </Route>
    </Routes>
  );
}
