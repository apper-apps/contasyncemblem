import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  placeholder = "Căutare...", 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <ApperIcon name="Search" size={16} />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4"
        {...props}
      />
    </div>
  );
};

export default SearchBar;