import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { messagesService } from "@/services/api/messagesService";
import { companiesService } from "@/services/api/companiesService";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [messagesData, companiesData] = await Promise.all([
        messagesService.getAll(),
        companiesService.getAll()
      ]);
      setMessages(messagesData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Eroare la încărcarea mesajelor");
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const message = messages.find(msg => msg.Id === messageId);
      if (!message) return;

      const updatedMessage = { ...message, read: true };
      await messagesService.update(messageId, updatedMessage);
      setMessages(messages.map(msg => 
        msg.Id === messageId ? updatedMessage : msg
      ));
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === parseInt(companyId?.Id || companyId));
    return company ? company.Name : "Necunoscut";
  };

  const getMessageTypeConfig = (type) => {
    const config = {
      request: { label: "Cerere", variant: "info", icon: "MessageCircle" },
      info: { label: "Informare", variant: "default", icon: "Info" },
      urgent: { label: "Urgent", variant: "error", icon: "AlertCircle" }
    };
    return config[type] || config.info;
  };

const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         getCompanyName(msg.company_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || msg.type === filterType;
    const matchesCompany = !filterCompany || msg.company_id?.Id === parseInt(filterCompany) || msg.company_id === parseInt(filterCompany);

    return matchesSearch && matchesType && matchesCompany;
  });

  const typeOptions = [
    { value: "", label: "Toate tipurile" },
    { value: "request", label: "Cerere" },
    { value: "info", label: "Informare" },
    { value: "urgent", label: "Urgent" }
  ];

  const companyOptions = [
    { value: "", label: "Toate companiile" },
...companies.map(company => ({ value: company.Id.toString(), label: company.Name }))
  ];

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.Id);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (messages.length === 0) return <Empty message="Nu există mesaje" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesaje</h1>
          <p className="text-gray-600">Comunicarea cu clienții</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Caută mesaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FormField
            type="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={typeOptions}
          />
          <FormField
            type="select"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            options={companyOptions}
          />
        </div>
      </Card>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Afișez {filteredMessages.length} din {messages.length} mesaje
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {messages.filter(msg => !msg.read).length} necitite
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message, index) => {
            const typeConfig = getMessageTypeConfig(message.type);
            return (
              <motion.div
                key={message.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    !message.read ? 'border-l-4 border-l-primary bg-blue-50/50' : ''
                  } ${
                    selectedMessage?.Id === message.Id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={typeConfig.variant} size="sm">
                            <ApperIcon name={typeConfig.icon} size={12} className="mr-1" />
                            {typeConfig.label}
                          </Badge>
                          {!message.read && (
                            <Badge variant="primary" size="sm">Nou</Badge>
                          )}
                        </div>
                        <h3 className={`font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </h3>
<p className="text-sm text-gray-600 mt-1">
                          {getCompanyName(message.company_id)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), "dd MMM yyyy", { locale: ro })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), "HH:mm")}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Message Detail */}
        <div className="lg:sticky lg:top-6">
          {selectedMessage ? (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={getMessageTypeConfig(selectedMessage.type).variant}>
                    <ApperIcon name={getMessageTypeConfig(selectedMessage.type).icon} size={14} className="mr-2" />
                    {getMessageTypeConfig(selectedMessage.type).label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedMessage.subject}
</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{getCompanyName(selectedMessage.company_id)}</span>
                    <span>•</span>
                    <span>{format(new Date(selectedMessage.timestamp), "dd MMM yyyy, HH:mm", { locale: ro })}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button variant="primary">
                    <ApperIcon name="Reply" size={16} className="mr-2" />
                    Răspunde
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Archive" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Flag" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Selectează un mesaj pentru a-l vizualiza</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {filteredMessages.length === 0 && (searchQuery || filterType || filterCompany) && (
        <Empty 
          message="Nu s-au găsit mesaje"
          description="Încearcă să modifici filtrele pentru a vedea rezultate"
        />
      )}
    </div>
  );
};

export default MessagesList;