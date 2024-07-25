// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          GutterCo
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`hover:text-blue-200 ${
              isActive("/") ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/book-service"
            className={`hover:text-blue-200 ${
              isActive("/book-service") ? "font-bold" : ""
            }`}
          >
            Book Service
          </Link>
          <Link
            to="/check-availability"
            className={`hover:text-blue-200 ${
              isActive("/check-availability") ? "font-bold" : ""
            }`}
          >
            Check Availability
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
