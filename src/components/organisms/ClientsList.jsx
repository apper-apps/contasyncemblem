import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyTypeBadge from "@/components/molecules/CompanyTypeBadge";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import FormField from "@/components/molecules/FormField";
import { companiesService } from "@/services/api/companiesService";
import { toast } from 'react-toastify';

const ClientsList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Add client form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    cui: "",
    type: "",
    contact_email: "",
    phone: "",
    accountant_id: "",
    Tags: "",
    Owner: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companiesService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Eroare la încărcarea clienților");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

const filteredAndSortedCompanies = companies
    .filter(company => 
      company.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.cui?.includes(searchQuery) ||
      company.contact_email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy === "name" ? "Name" : sortBy];
      const bValue = b[sortBy === "name" ? "Name" : sortBy];
      
      if (sortOrder === "asc") {
        return aValue?.localeCompare(bValue) || 0;
      } else {
        return bValue?.localeCompare(aValue) || 0;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getDocumentStatus = (companyId) => {
    // Mock status calculation - in real app, this would come from documents service
    const statuses = ["completed", "pending", "received"];
    return statuses[companyId % statuses.length];
};

  const validateForm = () => {
    const errors = {};
    
    if (!formData.Name.trim()) {
      errors.Name = "Numele companiei este obligatoriu";
    } else if (formData.Name.trim().length < 2) {
      errors.Name = "Numele companiei trebuie să aibă cel puțin 2 caractere";
    }
    
    if (!formData.cui.trim()) {
      errors.cui = "CUI-ul este obligatoriu";
    } else if (formData.cui.trim().length < 2) {
      errors.cui = "CUI-ul trebuie să aibă cel puțin 2 caractere";
    }
    
    if (!formData.type) {
      errors.type = "Tipul companiei este obligatoriu";
    }
    
    if (!formData.contact_email.trim()) {
      errors.contact_email = "Email-ul de contact este obligatoriu";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      errors.contact_email = "Email-ul nu este valid";
    }
    
    if (formData.phone && !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Numărul de telefon nu este valid";
    }
    
    return errors;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormLoading(true);
    setFormErrors({});
    
    try {
      const newClient = await companiesService.create(formData);
      
      if (newClient) {
        // Add to local state
        setCompanies(prev => [...prev, newClient]);
        
        // Reset form
        setFormData({
          Name: "",
          cui: "",
          type: "",
          contact_email: "",
          phone: "",
          accountant_id: "",
          Tags: "",
          Owner: ""
        });
        
        // Hide form
        setShowAddForm(false);
        
        // Show success message
        toast.success("Client adăugat cu succes!");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Eroare la adăugarea clientului");
    } finally {
      setFormLoading(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (!showAddForm) {
      // Reset form when opening
      setFormData({
        Name: "",
        cui: "",
        type: "",
        contact_email: "",
        phone: "",
        accountant_id: "",
        Tags: "",
        Owner: ""
      });
      setFormErrors({});
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;
  if (companies.length === 0 && !showAddForm) return <Empty message="Nu există clienți înregistrați" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienți</h1>
          <p className="text-gray-600">Gestionează clienții și documentele lor</p>
        </div>
<Button onClick={toggleAddForm}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {showAddForm ? "Anulează" : "Adaugă client"}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <SearchBar
            placeholder="Caută după nume, CUI sau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sortare:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort("name")}
              className="flex items-center space-x-1"
            >
              <span>Nume</span>
              {sortBy === "name" && (
                <ApperIcon 
                  name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                  size={14} 
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSort("type")}
              className="flex items-center space-x-1"
            >
              <span>Tip</span>
              {sortBy === "type" && (
                <ApperIcon 
                  name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                  size={14} 
                />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Afișez {filteredAndSortedCompanies.length} din {companies.length} clienți
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCompanies.map((company, index) => (
          <motion.div
            key={company.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <Link to={`/clients/${company.Id}`} className="block">
                <div className="space-y-4">
                  {/* Company Header */}
                  <div className="flex items-start justify-between">
<div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {company.Name}
                      </h3>
                      <p className="text-sm text-gray-600">CUI: {company.cui}</p>
                    </div>
                    <CompanyTypeBadge type={company.type} />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Mail" size={14} />
                      <span className="truncate">{company.contact_email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Phone" size={14} />
                      <span>{company.phone}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="FileText" size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">Status documente</span>
                    </div>
                    <StatusBadge status={getDocumentStatus(company.Id)} />
                  </div>
                </div>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

{filteredAndSortedCompanies.length === 0 && searchQuery && (
        <Empty 
          message="Nu s-au găsit clienți"
          description={`Nu există clienți care să corespundă cu "${searchQuery}"`}
        />
      )}

      {/* Add Client Form */}
      {showAddForm && (
        <Card className="mt-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Adaugă client nou</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAddForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <FormField
                  label="Nume companie"
                  type="text"
                  required
                  value={formData.Name}
                  onChange={(e) => handleFormChange("Name", e.target.value)}
                  error={formErrors.Name}
                  placeholder="Introduceti numele companiei"
                />

                {/* CUI Field */}
                <FormField
                  label="CUI"
                  type="text"
                  required
                  value={formData.cui}
                  onChange={(e) => handleFormChange("cui", e.target.value)}
                  error={formErrors.cui}
                  placeholder="Introduceti CUI-ul"
                />

                {/* Type Field */}
                <FormField
                  label="Tip companie"
                  type="select"
                  required
                  value={formData.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  error={formErrors.type}
                  options={[
                    { value: "", label: "Selecteaza tipul" },
                    { value: "SRL", label: "SRL" },
                    { value: "PFA", label: "PFA" },
                    { value: "II", label: "II" },
                    { value: "IF", label: "IF" }
                  ]}
                />

                {/* Contact Email Field */}
                <FormField
                  label="Email contact"
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => handleFormChange("contact_email", e.target.value)}
                  error={formErrors.contact_email}
                  placeholder="contact@companie.ro"
                />

                {/* Phone Field */}
                <FormField
                  label="Telefon"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  error={formErrors.phone}
                  placeholder="0721234567"
                />

                {/* Accountant ID Field */}
                <FormField
                  label="ID Contabil"
                  type="text"
                  value={formData.accountant_id}
                  onChange={(e) => handleFormChange("accountant_id", e.target.value)}
                  error={formErrors.accountant_id}
                  placeholder="ID-ul contabilului"
                />

                {/* Tags Field */}
                <FormField
                  label="Etichete"
                  type="text"
                  value={formData.Tags}
                  onChange={(e) => handleFormChange("Tags", e.target.value)}
                  error={formErrors.Tags}
                  placeholder="tag1,tag2,tag3"
                />

                {/* Owner Field */}
                <FormField
                  label="Proprietar"
                  type="text"
                  value={formData.Owner}
                  onChange={(e) => handleFormChange("Owner", e.target.value)}
                  error={formErrors.Owner}
                  placeholder="Numele proprietarului"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={toggleAddForm}
                  disabled={formLoading}
                >
                  Anulează
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="min-w-[120px]"
                >
                  {formLoading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Salvează...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Salvează
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ClientsList;