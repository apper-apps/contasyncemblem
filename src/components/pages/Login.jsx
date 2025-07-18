import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

function Login() {
  const { isInitialized } = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState("accountant");
  
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        {/* Login Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginMode("accountant")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              loginMode === "accountant"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Contabil
          </button>
          <button
            onClick={() => setLoginMode("client")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              loginMode === "client"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Client
          </button>
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-2xl 2xl:text-3xl font-bold">
            C
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              {loginMode === "accountant" ? "Sign in to ContaSync" : "Portal Client ContaSync"}
            </div>
            <div className="text-center text-sm text-gray-500">
              {loginMode === "accountant" 
                ? "Welcome back, please sign in to continue" 
                : "Accesează documentele și comunică cu contabilul"}
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;