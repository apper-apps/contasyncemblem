import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { companiesService } from "@/services/api/companiesService";
import { documentsService } from "@/services/api/documentsService";
import { messagesService } from "@/services/api/messagesService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    unreadMessages: 0,
    completedThisMonth: 0,
    receivedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [companies, documents, messages] = await Promise.all([
        companiesService.getAll(),
        documentsService.getAll(),
        messagesService.getAll()
      ]);

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      setStats({
        totalClients: companies.length,
        totalDocuments: documents.length,
        pendingDocuments: documents.filter(doc => doc.status === "uploaded" || doc.status === "sent").length,
        unreadMessages: messages.filter(msg => !msg.read).length,
        completedThisMonth: documents.filter(doc => {
          const docDate = new Date(doc.uploadDate);
          return docDate.getMonth() === currentMonth && 
                 docDate.getFullYear() === currentYear &&
                 doc.status === "processed";
        }).length,
        receivedToday: documents.filter(doc => {
          const docDate = new Date(doc.uploadDate);
          return docDate.toDateString() === today.toDateString();
        }).length
      });
    } catch (err) {
      setError("Eroare la încărcarea statisticilor");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  const statCards = [
    {
      title: "Total Clienți",
      value: stats.totalClients,
      icon: "Users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Total Documente",
      value: stats.totalDocuments,
      icon: "FileText",
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "În Așteptare",
      value: stats.pendingDocuments,
      icon: "Clock",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: "-5%",
      changeType: "decrease"
    },
    {
      title: "Mesaje Necitite",
      value: stats.unreadMessages,
      icon: "MessageCircle",
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "+3",
      changeType: "increase"
    },
    {
      title: "Finalizate Luna Aceasta",
      value: stats.completedThisMonth,
      icon: "CheckCircle",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "+15%",
      changeType: "increase"
    },
    {
      title: "Primite Astăzi",
      value: stats.receivedToday,
      icon: "Download",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+7",
      changeType: "increase"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <ApperIcon name={stat.icon} size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}>
                  <ApperIcon 
                    name={stat.changeType === "increase" ? "TrendingUp" : "TrendingDown"} 
                    size={16} 
                  />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">vs luna trecută</p>
              </div>
            </div>
            
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <div className={`w-full h-full rounded-full ${stat.bgColor} transform translate-x-8 -translate-y-8`}></div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;