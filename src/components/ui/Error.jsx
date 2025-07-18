import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message = "A apărut o eroare", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-white" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Oops! Ceva nu a mers bine
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex items-center justify-center space-x-4">
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Încearcă din nou
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.reload()}
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Reîncarcă pagina
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Dacă problema persistă, contactează echipa de suport la{" "}
            <a href="mailto:support@contasync.ro" className="text-primary font-medium">
              support@contasync.ro
            </a>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;