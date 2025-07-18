import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import CompanyTypeBadge from "@/components/molecules/CompanyTypeBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { documentsService } from "@/services/api/documentsService";
import { messagesService } from "@/services/api/messagesService";
import { companiesService } from "@/services/api/companiesService";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const RecentActivity = () => {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [documents, messages, companiesData] = await Promise.all([
        documentsService.getAll(),
        messagesService.getAll(),
        companiesService.getAll()
      ]);

      // Sort by date and get recent items
const sortedDocuments = documents
        .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
        .slice(0, 5);

      const sortedMessages = messages
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      setRecentDocuments(sortedDocuments);
      setRecentMessages(sortedMessages);
      setCompanies(companiesData);
    } catch (err) {
      setError("Eroare la încărcarea activității recente");
      console.error("Error loading recent activity:", err);
    } finally {
      setLoading(false);
    }
  };

const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === parseInt(companyId?.Id || companyId));
    return company ? company.Name : "Necunoscut";
  };

  const getCompanyType = (companyId) => {
    const company = companies.find(c => c.Id === parseInt(companyId?.Id || companyId));
    return company ? company.type : "SRL";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRecentActivity} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Documents */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Documente Recente</h2>
          <Link to="/documents">
            <Button variant="ghost" size="sm">
              Vezi toate
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentDocuments.length === 0 ? (
            <Empty message="Nu există documente recente" />
          ) : (
            recentDocuments.map((document, index) => (
              <motion.div
                key={document.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={16} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
<p className="font-medium text-gray-900 truncate">
                      {document.file_name}
                    </p>
                    <CompanyTypeBadge type={getCompanyType(document.company_id)} size="sm" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{getCompanyName(document.company_id)}</span>
                    <span>•</span>
                    <span>{format(new Date(document.upload_date), "dd MMM", { locale: ro })}</span>
                  </div>
                </div>
                
                <StatusBadge status={document.status} size="sm" />
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Messages */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Mesaje Recente</h2>
          <Link to="/messages">
            <Button variant="ghost" size="sm">
              Vezi toate
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentMessages.length === 0 ? (
            <Empty message="Nu există mesaje recente" />
          ) : (
            recentMessages.map((message, index) => {
              const getMessageIcon = (type) => {
                switch (type) {
                  case "urgent": return "AlertCircle";
                  case "request": return "MessageCircle";
                  default: return "Info";
                }
              };

              const getMessageColor = (type) => {
                switch (type) {
                  case "urgent": return "from-red-500 to-red-600";
                  case "request": return "from-blue-500 to-blue-600";
                  default: return "from-gray-500 to-gray-600";
                }
              };

              return (
                <motion.div
                  key={message.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    !message.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${getMessageColor(message.type)} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={getMessageIcon(message.type)} size={16} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 truncate">
                        {message.subject}
                      </p>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
<div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{getCompanyName(message.company_id)}</span>
                      <span>•</span>
                      <span>{format(new Date(message.timestamp), "dd MMM", { locale: ro })}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(new Date(message.timestamp), "HH:mm")}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecentActivity;