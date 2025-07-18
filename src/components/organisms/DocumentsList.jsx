import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { documentsService } from "@/services/api/documentsService";
import { companiesService } from "@/services/api/companiesService";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [documentsData, companiesData] = await Promise.all([
        documentsService.getAll(),
        companiesService.getAll()
      ]);
      setDocuments(documentsData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Eroare la încărcarea documentelor");
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (documentId, newStatus) => {
    try {
      const document = documents.find(doc => doc.Id === documentId);
      if (!document) return;

      const updatedDocument = {
        ...document,
        status: newStatus,
        physicalReceivedDate: newStatus === "received" ? new Date().toISOString() : document.physicalReceivedDate
      };

      await documentsService.update(documentId, updatedDocument);
      setDocuments(documents.map(doc => 
        doc.Id === documentId ? updatedDocument : doc
      ));
    } catch (err) {
      console.error("Error updating document status:", err);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === parseInt(companyId));
    return company ? company.name : "Necunoscut";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         getCompanyName(doc.companyId).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    const matchesCompany = !filterCompany || doc.companyId === filterCompany;
    const matchesMonth = !filterMonth || doc.month === filterMonth;

    return matchesSearch && matchesStatus && matchesCompany && matchesMonth;
  });

  const statusOptions = [
    { value: "", label: "Toate statusurile" },
    { value: "uploaded", label: "Încărcat" },
    { value: "sent", label: "Trimis" },
    { value: "received", label: "Primit" },
    { value: "processed", label: "Procesat" }
  ];

  const companyOptions = [
    { value: "", label: "Toate companiile" },
    ...companies.map(company => ({ value: company.Id.toString(), label: company.name }))
  ];

  const monthOptions = [
    { value: "", label: "Toate lunile" },
    { value: "ianuarie", label: "Ianuarie" },
    { value: "februarie", label: "Februarie" },
    { value: "martie", label: "Martie" },
    { value: "aprilie", label: "Aprilie" },
    { value: "mai", label: "Mai" },
    { value: "iunie", label: "Iunie" },
    { value: "iulie", label: "Iulie" },
    { value: "august", label: "August" },
    { value: "septembrie", label: "Septembrie" },
    { value: "octombrie", label: "Octombrie" },
    { value: "noiembrie", label: "Noiembrie" },
    { value: "decembrie", label: "Decembrie" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (documents.length === 0) return <Empty message="Nu există documente încărcate" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documente</h1>
          <p className="text-gray-600">Gestionează toate documentele clienților</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            placeholder="Caută documente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FormField
            type="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
          />
          <FormField
            type="select"
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            options={companyOptions}
          />
          <FormField
            type="select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            options={monthOptions}
          />
        </div>
      </Card>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Afișez {filteredDocuments.length} din {documents.length} documente
        </p>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document, index) => (
          <motion.div
            key={document.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" size={20} className="text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{document.fileName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{getCompanyName(document.companyId)}</span>
                      <span>•</span>
                      <span>{document.month} {document.year}</span>
                      <span>•</span>
                      <span>{document.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Încărcat: {format(new Date(document.uploadDate), "dd MMM yyyy", { locale: ro })}
                    </div>
                    {document.physicalReceivedDate && (
                      <div className="text-sm text-gray-600">
                        Primit: {format(new Date(document.physicalReceivedDate), "dd MMM yyyy", { locale: ro })}
                      </div>
                    )}
                  </div>

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
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (searchQuery || filterStatus || filterCompany || filterMonth) && (
        <Empty 
          message="Nu s-au găsit documente"
          description="Încearcă să modifici filtrele pentru a vedea rezultate"
        />
      )}
    </div>
  );
};

export default DocumentsList;