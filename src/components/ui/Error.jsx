import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-red-50 to-red-100 p-3">
            <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary" className="w-full">
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;