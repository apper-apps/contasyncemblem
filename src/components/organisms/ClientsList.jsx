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
import { companiesService } from "@/services/api/companiesService";

const ClientsList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;
  if (companies.length === 0) return <Empty message="Nu există clienți înregistrați" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienți</h1>
          <p className="text-gray-600">Gestionează clienții și documentele lor</p>
        </div>
        <Button>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Adaugă client
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
    </div>
  );
};

export default ClientsList;