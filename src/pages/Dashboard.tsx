import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../features/dashboard/queries";

import { Users, Building2, Boxes, CheckCircle, Wrench } from "lucide-react";
import { useDashboardRealtime } from "../features/dashboard/useDashboardRealtime";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

/* ---------------- TYPES ---------------- */

type DashboardStats = {
  totalCustomers: number;
  totalBuildings: number;
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
};

type StatConfig = {
  label: string;
  key: keyof DashboardStats;
  icon: React.ElementType;
  bg: string;
  text: string;
  link: string;
};

/* ---------------- CONFIG ---------------- */

const STAT_STYLES: StatConfig[] = [
  {
    label: "Customers",
    key: "totalCustomers",
    icon: Users,
    bg: "bg-blue-50",
    text: "text-blue-600",
    link: "/customers",
  },
  {
    label: "Buildings",
    key: "totalBuildings",
    icon: Building2,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    link: "/buildings",
  },
  {
    label: "Total Assets",
    key: "totalAssets",
    icon: Boxes,
    bg: "bg-purple-50",
    text: "text-purple-600",
    link: "/assets",
  },
  {
    label: "Active Assets",
    key: "activeAssets",
    icon: CheckCircle,
    bg: "bg-green-50",
    text: "text-green-600",
    link: "/assets?status=Active",
  },
  {
    label: "In Maintenance",
    key: "maintenanceAssets",
    icon: Wrench,
    bg: "bg-amber-50",
    text: "text-amber-600",
    link: "/assets?status=Maintenance",
  },
];

/* ---------------- COMPONENT ---------------- */

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  useDashboardRealtime();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!stats) return null;

  /* ---------------- Derived Metrics ---------------- */

  const activePct =
    stats.totalAssets > 0
      ? Math.round((stats.activeAssets / stats.totalAssets) * 100)
      : 0;

  const maintenancePct = Math.round(
    (stats.maintenanceAssets / stats.totalAssets) * 100 || 0,
  );

  const chartData = [
    { name: "Customers", value: stats.totalCustomers },
    { name: "Buildings", value: stats.totalBuildings },
    { name: "Assets", value: stats.totalAssets },
  ];

  const assetDistribution = [
    { name: "Active", value: stats.activeAssets, color: "#22c55e" },
    { name: "Maintenance", value: stats.maintenanceAssets, color: "#f59e0b" },
    {
      name: "Inactive",
      value: stats.totalAssets - stats.activeAssets - stats.maintenanceAssets,
      color: "#94a3b8",
    },
  ];

  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">
            Facility Intelligence Dashboard
          </h2>
          <p className="text-blue-100 leading-relaxed">
            Monitor customers, buildings, and asset health at a glance.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {STAT_STYLES.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.key}
              onClick={() => navigate(stat.link)}
              className="text-left bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.text}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-500 uppercase">
                {stat.label}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">
                {stats[stat.key]}
              </h4>
              <p className="mt-3 text-sm font-semibold text-blue-600">
                View details →
              </p>
            </button>
          );
        })}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          System Health Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HealthBar
            label="Active Assets"
            percent={activePct}
            color="bg-green-500"
          />
          <HealthBar
            label="Assets in Maintenance"
            percent={maintenancePct}
            color="bg-amber-500"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Entity Distribution
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Customers, buildings, and assets overview
          </p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === 2 ? "#2563eb" : "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Status */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Asset Status</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistribution}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {assetDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-2">
            {assetDistribution.map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{a.name}</span>
                <span className="font-semibold text-gray-900">{a.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Helper ---------------- */

function HealthBar({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-700">{percent}%</span>
      </div>
    </div>
  );
}

export default Dashboard;
