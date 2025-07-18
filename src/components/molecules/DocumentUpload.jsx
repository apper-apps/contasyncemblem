import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const DocumentUpload = ({ 
  onUpload, 
  className,
  companyId,
  ...props 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [documentType, setDocumentType] = useState("");

  const documentTypes = [
    { value: "", label: "Selectează tipul documentului" },
    { value: "facturi", label: "Facturi" },
    { value: "chitante", label: "Chitanțe" },
    { value: "extrasebanca", label: "Extrase bancare" },
    { value: "contracte", label: "Contracte" },
    { value: "alte", label: "Alte documente" }
  ];

  const months = [
    { value: "", label: "Selectează luna" },
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && month && documentType) {
      const uploadData = {
        files: selectedFiles,
        month,
        year,
        documentType,
        companyId
      };
      onUpload(uploadData);
      setSelectedFiles([]);
      setMonth("");
      setDocumentType("");
    }
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Luna"
          type="select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          options={months}
          required
        />
        <FormField
          label="Anul"
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          min="2020"
          max="2030"
          required
        />
        <FormField
          label="Tipul documentului"
          type="select"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          options={documentTypes}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ApperIcon name="Upload" size={40} className="text-gray-400 mb-4" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click pentru a încărca</span> sau drag & drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Fișiere selectate:</h4>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="File" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || !month || !documentType}
          className="w-full"
        >
          <ApperIcon name="Upload" size={16} className="mr-2" />
          Încarcă documentele
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;