import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes/AppRoutes";

import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <UserProvider>
            <Router>
              <div className="App">
                <AppRoutes />
              </div>
            </Router>
          </UserProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
