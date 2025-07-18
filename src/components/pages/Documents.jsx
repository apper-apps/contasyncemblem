import React from "react";
import { motion } from "framer-motion";
import DocumentsList from "@/components/organisms/DocumentsList";

const Documents = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <DocumentsList />
    </motion.div>
  );
};

export default Documents;