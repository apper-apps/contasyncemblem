import React from "react";
import { motion } from "framer-motion";
import MessagesList from "@/components/organisms/MessagesList";

const Messages = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <MessagesList />
    </motion.div>
  );
};

export default Messages;