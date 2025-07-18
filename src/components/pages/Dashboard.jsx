import React from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import RecentActivity from "@/components/organisms/RecentActivity";

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bună ziua, Contabil Principal!
        </h1>
        <p className="text-blue-100 text-lg">
          Iată o privire de ansamblu asupra activității din contul dvs.
        </p>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Statistici Generale
        </h2>
        <DashboardStats />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Activitate Recentă
        </h2>
        <RecentActivity />
      </div>
    </motion.div>
  );
};

export default Dashboard;