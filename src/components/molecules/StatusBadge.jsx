import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    uploaded: {
      variant: "info",
      label: "Încărcat"
    },
    sent: {
      variant: "warning",
      label: "Trimis"
    },
    received: {
      variant: "success",
      label: "Primit"
    },
    processed: {
      variant: "primary",
      label: "Procesat"
    },
    pending: {
      variant: "warning",
      label: "În așteptare"
    },
    completed: {
      variant: "success",
      label: "Finalizat"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;