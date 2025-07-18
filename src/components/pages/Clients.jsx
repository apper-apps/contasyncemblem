import React from "react";
import { motion } from "framer-motion";
import ClientsList from "@/components/organisms/ClientsList";

const Clients = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <ClientsList />
    </motion.div>
  );
};

export default Clients;