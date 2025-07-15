import React from "react";
import { Card } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
            <div className="h-8 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                  <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                </div>
                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                <div className="h-8 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
                <div className="h-3 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="h-64 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-shimmer"></div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-500"></div>
      </div>
    </Card>
  );
};

export default Loading;