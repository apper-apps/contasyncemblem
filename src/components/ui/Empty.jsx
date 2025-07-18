import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  message = "Nu există date", 
  description = "Începe prin a adăuga primul element",
  action,
  actionText = "Adaugă primul element",
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {action && (
          <Button onClick={action} variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <ApperIcon name="Lightbulb" size={16} />
            <span className="text-sm font-medium">Sfat:</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Odată ce vei avea date, această secțiune va deveni activă și vei putea vedea informații detaliate.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;