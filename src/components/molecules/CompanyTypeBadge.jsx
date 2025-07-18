import React from "react";
import Badge from "@/components/atoms/Badge";

const CompanyTypeBadge = ({ type, ...props }) => {
  const typeConfig = {
    SRL: {
      variant: "primary",
      label: "SRL"
    },
    PFA: {
      variant: "success",
      label: "PFA"
    },
    II: {
      variant: "warning",
      label: "II"
    },
    IF: {
      variant: "info",
      label: "IF"
    }
  };

  const config = typeConfig[type] || typeConfig.SRL;

  return (
    <Badge variant={config.variant} {...props}>
      {config.label}
    </Badge>
  );
};

export default CompanyTypeBadge;