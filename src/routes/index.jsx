import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PrivateRoute from './PrivateRoute';
// import PublicRoute from './PublicRoute';

// Import your page components
// import Home from "../pages/Home";
import BookingForm from "../pages/BookingForm";
import Confirmation from "../pages/Confirmation";
import BookingCancelled from "../pages/BookingCancelled";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<PublicRoute><Home /></PublicRoute>} /> */}
        <Route path="/book-service" element={<BookingForm />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/booking-cancelled" element={<BookingCancelled />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
