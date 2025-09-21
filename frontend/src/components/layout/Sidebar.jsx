import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Palette, BarChart3, User, LogOut, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, language = "en" }) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      dashboard: "Dashboard",
      myProducts: "My Products",
      analytics: "Analytics",
      profile: "My Profile",
      logout: "Logout",
      userName: "Artisan Name",
    },
    pa: {
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      myProducts: "ਮੇਰੇ ਉਤਪਾਦ",
      analytics: "ਵਿਸ਼ਲੇਸ਼ਣ",
      profile: "ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ",
      logout: "ਲਾਗਆਊਟ",
      userName: "ਕਾਰੀਗਰ ਨਾਮ",
    },
  };

  const t = translations[language];

  const menuItems = [
    { path: "/artisan/dashboard", icon: Home, label: t.dashboard },
    { path: "/artisan/products", icon: Palette, label: t.myProducts },
    { path: "/artisan/analytics", icon: BarChart3, label: t.analytics },
    { path: "/artisan/profile", icon: User, label: t.profile },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out
        lg:sticky lg:translate-x-0 lg:z-auto lg:flex lg:flex-col lg:h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KK</span>
            </div>
            <span className="text-xl font-bold">KalaKriti AI</span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                      ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t.userName}</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
