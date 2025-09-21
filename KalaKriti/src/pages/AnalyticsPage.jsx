import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  IndianRupee,
  Eye,
  Calendar,
  MapPin,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/api";

const AnalyticsPage = () => {
  const { language, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("sales");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load analytics data from backend
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products to calculate analytics
      const result = await apiService.getProducts("artisan_001");
      const products = result.products || [];

      // Calculate analytics from product data
      const calculatedAnalytics = calculateAnalytics(products);
      setAnalyticsData(calculatedAnalytics);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      setError("Failed to load analytics data");

      // Fallback to mock data
      setAnalyticsData(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (products) => {
    const totalProducts = products.length;
    const totalRevenue = products.reduce(
      (sum, product) => sum + product.price * (product.sold || 0),
      0
    );
    const avgPrice =
      totalProducts > 0
        ? products.reduce((sum, product) => sum + product.price, 0) /
          totalProducts
        : 0;
    const totalOrders = products.reduce(
      (sum, product) => sum + (product.sold || 0),
      0
    );
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalProducts,
      avgPrice,
      topProducts: products
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 5),
      categoryBreakdown: getCategoryBreakdown(products),
    };
  };

  const getCategoryBreakdown = (products) => {
    const categories = {};
    products.forEach((product) => {
      const category = product.category || "other";
      categories[category] = (categories[category] || 0) + 1;
    });
    return categories;
  };

  const getMockAnalytics = () => ({
    totalRevenue: 125000,
    totalOrders: 84,
    avgOrderValue: 1488,
    totalProducts: 15,
    avgPrice: 2200,
    topProducts: [],
    categoryBreakdown: { textiles: 8, pottery: 3, jewelry: 2, woodwork: 2 },
  });

  const translations = {
    en: {
      pageTitle: "Analytics",
      sales: "Sales",
      audience: "Audience",
      trends: "Trends",
      totalRevenue: "Total Revenue",
      totalOrders: "Total Orders",
      avgOrderValue: "Avg. Order Value",
      conversionRate: "Conversion Rate",
      pageViews: "Page Views",
      uniqueVisitors: "Unique Visitors",
      bounceRate: "Bounce Rate",
      topSellingProducts: "Top Selling Products",
      revenueOverTime: "Revenue Over Time",
      ordersByCity: "Orders by City",
      visitorInsights: "Visitor Insights",
      productPerformance: "Product Performance",
      monthlyTrends: "Monthly Trends",
      demographics: "Demographics",
      salesByCategory: "Sales by Category",
      customerSegments: "Customer Segments",
    },
    pa: {
      pageTitle: "ਵਿਸ਼ਲੇਸ਼ਣ",
      sales: "ਵਿਕਰੀ",
      audience: "ਦਰਸ਼ਕ",
      trends: "ਰੁਝਾਨ",
      totalRevenue: "ਕੁੱਲ ਆਮਦਨ",
      totalOrders: "ਕੁੱਲ ਆਰਡਰ",
      avgOrderValue: "ਔਸਤ ਆਰਡਰ ਮੁੱਲ",
      conversionRate: "ਰੂਪਾਂਤਰਣ ਦਰ",
      pageViews: "ਪੰਨਾ ਦਰਸ਼ਨ",
      uniqueVisitors: "ਵਿਸ਼ੇਸ਼ ਵਿਜ਼ਿਟਰ",
      bounceRate: "ਬਾਊਂਸ ਦਰ",
      topSellingProducts: "ਸਿਖਰ ਵਿਕਰੀ ਉਤਪਾਦ",
      revenueOverTime: "ਸਮੇਂ ਨਾਲ ਆਮਦਨ",
      ordersByCity: "ਸ਼ਹਿਰ ਦੁਆਰਾ ਆਰਡਰ",
      visitorInsights: "ਵਿਜ਼ਿਟਰ ਜਾਣਕਾਰੀ",
      productPerformance: "ਉਤਪਾਦ ਪ੍ਰਦਰਸ਼ਨ",
      monthlyTrends: "ਮਾਸਿਕ ਰੁਝਾਨ",
      demographics: "ਜਨਸਾਂਖਿਆ",
      salesByCategory: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਵਿਕਰੀ",
      customerSegments: "ਗਾਹਕ ਵਰਗ",
    },
  };

  const t = translations[language];

  const tabs = [
    { id: "sales", label: t.sales, icon: TrendingUp },
    { id: "audience", label: t.audience, icon: Users },
    { id: "trends", label: t.trends, icon: Calendar },
  ];

  const getSalesStats = () => {
    if (!analyticsData) return [];

    return [
      {
        title: t.totalRevenue,
        value: `₹${analyticsData.totalRevenue.toLocaleString()}`,
        change: "23%", // This would be calculated based on historical data
        changeType: "increase",
        icon: IndianRupee,
        color: "green",
      },
      {
        title: t.totalOrders,
        value: analyticsData.totalOrders.toString(),
        change: "12",
        changeType: "increase",
        icon: TrendingUp,
        color: "blue",
      },
      {
        title: t.avgOrderValue,
        value: `₹${Math.round(analyticsData.avgOrderValue).toLocaleString()}`,
        change: "8%",
        changeType: "increase",
        icon: IndianRupee,
        color: "purple",
      },
      {
        title: "Total Products",
        value: analyticsData.totalProducts.toString(),
        change: "5",
        changeType: "increase",
        icon: TrendingUp,
        color: "orange",
      },
    ];
  };

  const audienceStats = [
    {
      title: t.pageViews,
      value: "12,547",
      change: "18%",
      changeType: "increase",
      icon: Eye,
      color: "blue",
    },
    {
      title: t.uniqueVisitors,
      value: "2,847",
      change: "15%",
      changeType: "increase",
      icon: Users,
      color: "green",
    },
    {
      title: t.bounceRate,
      value: "42%",
      change: "5%",
      changeType: "decrease",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const trendsStats = [
    {
      title: t.monthlyTrends,
      value: "↗️ Growing",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: t.topSellingProducts,
      value: "Phulkari Dupatta",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === "en"
              ? "Loading analytics..."
              : "ਵਿਸ਼ਲੇਸ਼ਣ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..."}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === "en"
              ? "Error loading analytics"
              : "ਵਿਸ਼ਲੇਸ਼ਣ ਲੋਡ ਕਰਨ ਵਿੱਚ ਗਲਤੀ"}
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadAnalyticsData}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {language === "en" ? "Try Again" : "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ"}
          </button>
        </div>
      );
    }

    const salesStats = getSalesStats();

    switch (activeTab) {
      case "sales":
        return (
          <div className="space-y-6">
            {/* Sales Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {salesStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.revenueOverTime}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <iframe
                    src="https://datastudio.google.com/embed/reporting/sample-revenue-chart"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    className="rounded-lg"
                    title="Revenue Chart"
                  />
                </div>
              </div>

              {/* Orders by City */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.ordersByCity}
                </h3>
                <div className="space-y-4">
                  {[
                    { city: "Delhi", orders: 28, percentage: 33 },
                    { city: "Mumbai", orders: 21, percentage: 25 },
                    { city: "Chandigarh", orders: 15, percentage: 18 },
                    { city: "Bangalore", orders: 12, percentage: 14 },
                    { city: "Others", orders: 8, percentage: 10 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {item.city}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {item.orders}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.topSellingProducts}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Traditional Punjabi Phulkari Dupatta",
                    sales: 45,
                    revenue: "₹1,12,500",
                  },
                  {
                    name: "Handcrafted Clay Water Pot",
                    sales: 23,
                    revenue: "₹19,550",
                  },
                  {
                    name: "Silver Kundan Earrings",
                    sales: 16,
                    revenue: "₹51,200",
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "audience":
        return (
          <div className="space-y-6">
            {/* Audience Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {audienceStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Visitor Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.visitorInsights}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <iframe
                    src="https://datastudio.google.com/embed/reporting/sample-audience-chart"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    className="rounded-lg"
                    title="Audience Chart"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.demographics}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Age 25-34</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Age 35-44</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Age 45-54</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Others</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "trends":
        return (
          <div className="space-y-6">
            {/* Trends Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendsStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.salesByCategory}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <iframe
                    src="https://datastudio.google.com/embed/reporting/sample-category-chart"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    className="rounded-lg"
                    title="Category Chart"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t.productPerformance}
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <iframe
                    src="https://datastudio.google.com/embed/reporting/sample-performance-chart"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    className="rounded-lg"
                    title="Performance Chart"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title={t.pageTitle}
      language={language}
      onLanguageChange={changeLanguage}
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
