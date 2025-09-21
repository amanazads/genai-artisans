import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  IndianRupee,
  Package,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import StoryPreviewCard from "../components/ui/StoryPreviewCard";
import { useLanguage } from "../context/LanguageContext";

const DashboardHomePage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();

  const translations = {
    en: {
      pageTitle: "Dashboard",
      goodMorning: "Good morning",
      goodAfternoon: "Good afternoon",
      goodEvening: "Good evening",
      addNewCreation: "+ Add a New Creation",
      earningsThisMonth: "Earnings this Month",
      totalProducts: "Total Products",
      monthlyViews: "Monthly Views",
      newOrders: "New Orders",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
      orderReceived: "New order received",
      productApproved: "Product approved",
      profileUpdated: "Profile updated",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      daysAgo: "days ago",
      viewAllProducts: "View All Products",
      manageProfile: "Manage Profile",
      viewAnalytics: "View Analytics",
    },
    pa: {
      pageTitle: "ਡੈਸ਼ਬੋਰਡ",
      goodMorning: "ਸ਼ੁਭ ਸਵੇਰ",
      goodAfternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ",
      goodEvening: "ਸ਼ੁਭ ਸ਼ਾਮ",
      addNewCreation: "+ ਇੱਕ ਨਵੀਂ ਰਚਨਾ ਸ਼ਾਮਲ ਕਰੋ",
      earningsThisMonth: "ਇਸ ਮਹੀਨੇ ਦੀ ਕਮਾਈ",
      totalProducts: "ਕੁੱਲ ਉਤਪਾਦ",
      monthlyViews: "ਮਾਸਿਕ ਦਰਸ਼ਨ",
      newOrders: "ਨਵੇ ਆਰਡਰ",
      recentActivity: "ਹਾਲ ਦੀ ਗਤੀਵਿਧੀ",
      quickActions: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
      orderReceived: "ਨਵਾਂ ਆਰਡਰ ਮਿਲਿਆ",
      productApproved: "ਉਤਪਾਦ ਮਨਜ਼ੂਰ",
      profileUpdated: "ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ",
      minutesAgo: "ਮਿੰਟ ਪਹਿਲਾਂ",
      hoursAgo: "ਘੰਟੇ ਪਹਿਲਾਂ",
      daysAgo: "ਦਿਨ ਪਹਿਲਾਂ",
      viewAllProducts: "ਸਾਰੇ ਉਤਪਾਦ ਦੇਖੋ",
      manageProfile: "ਪ੍ਰੋਫਾਈਲ ਪ੍ਰਬੰਧਨ",
      viewAnalytics: "ਵਿਸ਼ਲੇਸ਼ਣ ਦੇਖੋ",
    },
  };

  const t = translations[language];

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  // Sample data
  const stats = [
    {
      title: t.earningsThisMonth,
      value: "₹12,500",
      change: "15%",
      changeType: "increase",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: t.totalProducts,
      value: "24",
      change: "3",
      changeType: "increase",
      icon: Package,
      color: "blue",
    },
    {
      title: t.monthlyViews,
      value: "1,247",
      change: "28%",
      changeType: "increase",
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: t.newOrders,
      value: "8",
      change: "2",
      changeType: "increase",
      icon: Users,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      type: "order",
      message: t.orderReceived,
      time: "5 " + t.minutesAgo,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      type: "approval",
      message: t.productApproved,
      time: "2 " + t.hoursAgo,
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      type: "profile",
      message: t.profileUpdated,
      time: "1 " + t.daysAgo,
      icon: AlertCircle,
      color: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: t.viewAllProducts,
      path: "/artisan/products",
      icon: Package,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: t.manageProfile,
      path: "/artisan/profile",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: t.viewAnalytics,
      path: "/artisan/analytics",
      icon: TrendingUp,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {getGreeting()}, Rajesh Kumar!
              </h1>
              <p className="text-purple-100 text-lg">
                {language === "en"
                  ? "Ready to showcase your beautiful creations today?"
                  : "ਅੱਜ ਆਪਣੀਆਂ ਸੁੰਦਰ ਰਚਨਾਵਾਂ ਪ੍ਰਦਰਸ਼ਿਤ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?"}
              </p>
            </div>

            <button
              onClick={() => navigate("/artisan/add-product")}
              className="bg-white text-purple-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 w-fit"
            >
              <Plus size={20} />
              <span>{t.addNewCreation}</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Preview - Takes 2 columns */}
          <div className="lg:col-span-2">
            <StoryPreviewCard language={language} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.quickActions}
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`w-full ${action.color} text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-3`}
                  >
                    <Icon size={18} />
                    <span>{action.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.recentActivity}
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon size={18} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
