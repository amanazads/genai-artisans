import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  language = "en",
  onDelete,
  onStatusChange,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {language === "en" ? "No products found" : "ਕੋਈ ਉਤਪਾਦ ਨਹੀਂ ਮਿਲਿਆ"}
        </h3>
        <p className="text-gray-600">
          {language === "en"
            ? "Try adjusting your search or filter criteria."
            : "ਆਪਣੀ ਖੋਜ ਜਾਂ ਫਿਲਟਰ ਮਾਪਦੰਡ ਨੂੰ ਐਡਜਸਟ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          language={language}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
