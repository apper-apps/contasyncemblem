import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import DocumentUpload from "@/components/molecules/DocumentUpload";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { documentsService } from "@/services/api/documentsService";
import { messagesService } from "@/services/api/messagesService";
import { companiesService } from "@/services/api/companiesService";

const ClientDashboard = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("upload");
  const [messageLoading, setMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    type: "request"
  });

  useEffect(() => {
    loadClientData();
  }, [companyId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [companyData, documentsData, messagesData] = await Promise.all([
        companiesService.getById(parseInt(companyId)),
        documentsService.getByCompanyId(parseInt(companyId)),
        messagesService.getAll()
      ]);

      setCompany(companyData);
      setDocuments(documentsData);
      setMessages(messagesData.filter(msg => (msg.company_id?.Id || msg.company_id) === parseInt(companyId)));
    } catch (err) {
      setError("Eroare la încărcarea datelor");
      console.error("Error loading client data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (uploadData) => {
    try {
      const uploadPromises = uploadData.files.map(async (file) => {
        const newDocument = {
          company_id: parseInt(companyId),
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.subject.trim() || !newMessage.content.trim()) {
      toast.error("Subiectul și conținutul sunt obligatorii");
      return;
    }

    try {
      setMessageLoading(true);
      
      const messageData = {
        company_id: parseInt(companyId),
        subject: newMessage.subject,
        content: newMessage.content,
        type: newMessage.type,
        timestamp: new Date().toISOString(),
        read: false,
        sender_id: "client",
        platform: "InApp"
      };

      const createdMessage = await messagesService.create(messageData);
      if (createdMessage) {
        setMessages([createdMessage, ...messages]);
        setNewMessage({ subject: "", content: "", type: "request" });
        toast.success("Mesajul a fost trimis cu succes!");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Eroare la trimiterea mesajului");
    } finally {
      setMessageLoading(false);
    }
  };

  const sections = [
    { id: "upload", label: "Încarcă Documente", icon: "Upload" },
    { id: "documents", label: "Documentele Mele", icon: "FileText" },
    { id: "messages", label: "Mesaje", icon: "MessageCircle" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadClientData} />;
  if (!company) return <Error message="Compania nu a fost găsită" />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{company.Name}</h1>
                <p className="text-sm text-gray-600">Portal Client</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Documente active</p>
                <p className="text-lg font-semibold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <ApperIcon name={section.icon} size={16} />
                <span>{section.label}</span>
                {section.id === "messages" && messages.filter(msg => !msg.read).length > 0 && (
                  <Badge variant="error" size="sm">
                    {messages.filter(msg => !msg.read).length}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Încarcă Documente</h2>
              <p className="text-gray-600">Încarcă documentele tale contabile pentru procesare</p>
            </div>
            
            <Card className="p-6">
              <DocumentUpload
                onUpload={handleDocumentUpload}
                companyId={companyId}
              />
            </Card>
          </motion.div>
        )}

        {activeSection === "documents" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentele Mele</h2>
                <p className="text-gray-600">Vizualizează toate documentele încărcate</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total documente</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>

            {documents.length === 0 ? (
              <Empty message="Nu ai încărcat încă documente" />
            ) : (
              <div className="grid gap-4">
                {documents.map((document, index) => (
                  <motion.div
                    key={document.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <ApperIcon name="FileText" size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{document.file_name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
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
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Download" size={14} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeSection === "messages" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesaje</h2>
              <p className="text-gray-600">Comunică cu contabilul tău</p>
            </div>

            {/* Send Message Form */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trimite un mesaj nou</h3>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subiect *
                    </label>
                    <Input
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      placeholder="Subiectul mesajului"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioritate
                    </label>
                    <Select
                      value={newMessage.type}
                      onChange={(e) => setNewMessage({...newMessage, type: e.target.value})}
                    >
                      <option value="request">Cerere</option>
                      <option value="info">Informare</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj *
                  </label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Scrie mesajul tău aici..."
                    rows={4}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={messageLoading}
                  className="w-full md:w-auto"
                >
                  {messageLoading ? (
                    <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                  ) : (
                    <ApperIcon name="Send" size={16} className="mr-2" />
                  )}
                  Trimite Mesaj
                </Button>
              </form>
            </Card>

            {/* Messages List */}
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Empty message="Nu există mesaje" />
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`p-6 ${!message.read ? 'border-l-4 border-l-primary bg-blue-50' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{message.subject}</h4>
                            <Badge 
                              variant={message.type === "urgent" ? "error" : message.type === "info" ? "info" : "primary"}
                              size="sm"
                            >
                              {message.type === "urgent" ? "Urgent" : message.type === "request" ? "Cerere" : "Info"}
                            </Badge>
                            {!message.read && (
                              <Badge variant="primary" size="sm">Nou</Badge>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{message.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{format(new Date(message.timestamp), "dd MMM yyyy, HH:mm", { locale: ro })}</span>
                            <span>•</span>
                            <span>{message.sender_id === "client" ? "Trimis de tine" : "Răspuns de la contabil"}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;