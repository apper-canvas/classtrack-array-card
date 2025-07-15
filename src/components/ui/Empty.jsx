import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction,
  icon = "Database"
}) => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <ApperIcon name={icon} size={48} className="text-gray-400" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{description}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary" className="w-full">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;