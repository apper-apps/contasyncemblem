import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import CompanyTypeBadge from "@/components/molecules/CompanyTypeBadge";
import DocumentUpload from "@/components/molecules/DocumentUpload";
import StatusBadge from "@/components/molecules/StatusBadge";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { documentsService } from "@/services/api/documentsService";
import { messagesService } from "@/services/api/messagesService";
import { companiesService } from "@/services/api/companiesService";
const ClientDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [companyData, documentsData, messagesData] = await Promise.all([
        companiesService.getById(parseInt(id)),
        documentsService.getAll(),
        messagesService.getAll()
      ]);

setCompany(companyData);
      setDocuments(documentsData.filter(doc => (doc.company_id?.Id || doc.company_id) === parseInt(id)));
      setMessages(messagesData.filter(msg => (msg.company_id?.Id || msg.company_id) === parseInt(id)));
    } catch (err) {
      setError("Eroare la încărcarea datelor clientului");
      console.error("Error loading client data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (uploadData) => {
    try {
      // Simulate multiple file uploads
      const uploadPromises = uploadData.files.map(async (file) => {
const newDocument = {
          company_id: parseInt(id),
          month: uploadData.month,
          year: uploadData.year,
          type: uploadData.documentType,
          file_name: file.name,
          upload_date: new Date().toISOString(),
          physical_sent_date: null,
          physical_received_date: null,
          status: "uploaded"
        };
        
        return await documentsService.create(newDocument);
      });

      const newDocuments = await Promise.all(uploadPromises);
      setDocuments([...documents, ...newDocuments]);
      toast.success("Documentele au fost încărcate cu succes!");
    } catch (err) {
      console.error("Error uploading documents:", err);
      toast.error("Eroare la încărcarea documentelor");
    }
  };

  const updateDocumentStatus = async (documentId, newStatus) => {
    try {
      const document = documents.find(doc => doc.Id === documentId);
      if (!document) return;

const updatedDocument = {
        ...document,
        status: newStatus,
        physical_received_date: newStatus === "received" ? new Date().toISOString() : document.physical_received_date
      };

      await documentsService.update(documentId, updatedDocument);
      setDocuments(documents.map(doc => 
        doc.Id === documentId ? updatedDocument : doc
      ));
      toast.success("Statusul documentului a fost actualizat!");
    } catch (err) {
      console.error("Error updating document status:", err);
      toast.error("Eroare la actualizarea statusului");
    }
  };

  const tabs = [
    { id: "documents", label: "Documente", icon: "FileText" },
    { id: "messages", label: "Mesaje", icon: "MessageCircle" },
    { id: "info", label: "Informații", icon: "Info" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClientData} />;
  if (!company) return <Error message="Clientul nu a fost găsit" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
<Link to="/clients" className="hover:text-primary">Clienți</Link>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-gray-900 font-medium">{company.Name}</span>
      </div>
      {/* Company Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
              <ApperIcon name="Building" size={32} className="text-white" />
            </div>
            <div>
<div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{company.Name}</h1>
                <CompanyTypeBadge type={company.type} />
              </div>
              <p className="text-gray-600 mb-1">CUI: {company.cui}</p>
<div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Mail" size={14} />
                  <span>{company.contact_email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Phone" size={14} />
                  <span>{company.phone}</span>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Documente active</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.id === "messages" && messages.filter(msg => !msg.read).length > 0 && (
                  <Badge variant="error" size="sm">
                    {messages.filter(msg => !msg.read).length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "documents" && (
            <div className="space-y-6">
              {/* Document Upload */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Încarcă documente noi
                </h3>
                <DocumentUpload
                  onUpload={handleDocumentUpload}
                  companyId={id}
                />
              </Card>

              {/* Documents List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documente existente ({documents.length})
                </h3>
                {documents.length === 0 ? (
                  <Empty message="Nu există documente încărcate pentru acest client" />
                ) : (
                  <div className="space-y-3">
                    {documents.map((document, index) => (
                      <motion.div
                        key={document.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <ApperIcon name="FileText" size={16} className="text-white" />
                          </div>
<div>
                            <p className="font-medium text-gray-900">{document.file_name}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{document.month} {document.year}</span>
                              <span>•</span>
                              <span>{document.type}</span>
                              <span>•</span>
                              <span>{format(new Date(document.upload_date), "dd MMM yyyy", { locale: ro })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <StatusBadge status={document.status} />
                          <div className="flex items-center space-x-2">
                            {document.status === "sent" && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => updateDocumentStatus(document.Id, "received")}
                              >
                                <ApperIcon name="Check" size={14} className="mr-1" />
                                Confirmă primirea
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Download" size={14} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Empty message="Nu există mesaje pentru acest client" />
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      !message.read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{message.subject}</h4>
                          <Badge variant={message.type === "urgent" ? "error" : "info"} size="sm">
                            {message.type === "urgent" ? "Urgent" : message.type === "request" ? "Cerere" : "Info"}
                          </Badge>
                          {!message.read && (
                            <Badge variant="primary" size="sm">Nou</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{message.content}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(message.timestamp), "dd MMM yyyy, HH:mm", { locale: ro })}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ApperIcon name="Reply" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informații Companie
                </h3>
                <div className="space-y-3">
<div>
                    <p className="text-sm text-gray-600">Numele companiei</p>
                    <p className="font-medium text-gray-900">{company.Name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CUI</p>
                    <p className="font-medium text-gray-900">{company.cui}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipul companiei</p>
<CompanyTypeBadge type={company.type} />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informații Contact
                </h3>
                <div className="space-y-3">
                  <div>
<p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{company.contact_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefon</p>
                    <p className="font-medium text-gray-900">{company.phone}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientDetail;