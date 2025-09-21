import React from "react";

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = "purple",
}) => {
  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      text: "text-purple-600",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      text: "text-blue-600",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      text: "text-orange-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.purple;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                changeType === "increase" ? "text-green-600" : "text-red-600"
              }`}
            >
              {changeType === "increase" ? "+" : "-"}
              {change}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
          >
            <Icon size={24} className={colors.icon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
