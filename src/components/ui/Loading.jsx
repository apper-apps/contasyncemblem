import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-48 shimmer"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-64 shimmer"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-32 shimmer"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl shimmer"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 shimmer"></div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 bg-gray-200 rounded w-12 shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-16 shimmer"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((section) => (
          <Card key={section} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-200 rounded-lg w-40 shimmer"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-24 shimmer"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4 p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-16 shimmer"></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Loading;