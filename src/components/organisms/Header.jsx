import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/clients", label: "Clienți", icon: "Users" },
    { path: "/documents", label: "Documente", icon: "FileText" },
    { path: "/messages", label: "Mesaje", icon: "MessageCircle" },
    { path: "/settings", label: "Setări", icon: "Settings" }
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Calculator" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ContaSync</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name={item.icon} size={16} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Contabil Principal</p>
                <p className="text-gray-500">contabil@contasync.ro</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" size={16} />
              <span>Ieșire</span>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name={item.icon} size={16} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:text-error hover:bg-red-50 transition-colors w-full"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="font-medium">Ieșire</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;