import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600 text-white",
    secondary: "from-secondary-500 to-secondary-600 text-white",
    success: "from-accent-500 to-accent-600 text-white",
    warning: "from-yellow-500 to-yellow-600 text-white",
    danger: "from-red-500 to-red-600 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${colors[color]} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
                {trend && (
                  <div className="flex items-center mt-2">
                    <ApperIcon 
                      name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className="text-white/80 mr-1" 
                    />
                    <span className="text-white/80 text-xs">{trendValue}</span>
                  </div>
                )}
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <ApperIcon name={icon} size={24} className="text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;