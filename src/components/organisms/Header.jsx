import React from "react";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  searchValue = "", 
  onSearchChange,
  onMenuClick,
  actions = []
}) => {
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="md"
              onClick={onMenuClick}
              className="lg:hidden mr-3 p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {showSearch && (
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search students..."
                className="w-full sm:w-80"
              />
            )}
            
            {actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "primary"}
                    size={action.size || "md"}
                    onClick={action.onClick}
                    className="flex-shrink-0"
                  >
                    {action.icon && <ApperIcon name={action.icon} size={16} className="mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;