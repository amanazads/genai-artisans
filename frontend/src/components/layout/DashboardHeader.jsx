import React from "react";
import { Menu, ChevronDown } from "lucide-react";

const DashboardHeader = ({
  title,
  onMenuToggle,
  language = "en",
  onLanguageChange,
}) => {
  const translations = {
    en: {
      language: "English",
      selectLanguage: "Select Language",
    },
    pa: {
      language: "ਪੰਜਾਬੀ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    },
  };

  const t = translations[language];

  const languageOptions = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side: Menu button (mobile) + Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Right side: Language selector */}
        <div className="relative">
          <div className="relative inline-block text-left">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.nativeName}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
