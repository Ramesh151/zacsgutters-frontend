// src/routes/index.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../pages/Header";
import Home from "../pages/Home";
import ServiceBookingForm from "../components/ServiceBookingForm/index";
import CheckAvailability from "../pages/CheckAvailability";
import Confirmation from "../pages/Confirmation";
import BookingCancelled from "../pages/BookingCancelled";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-service" element={<ServiceBookingForm />} />
            <Route path="/check-availability" element={<CheckAvailability />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/booking-cancelled" element={<BookingCancelled />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRoutes;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import PrivateRoute from './PrivateRoute';
// // import PublicRoute from './PublicRoute';

// // Import your page components
// // import Home from "../pages/Home";
// import BookingForm from "../pages/BookingForm";
// import Confirmation from "../pages/Confirmation";
// import BookingCancelled from "../pages/BookingCancelled";
// import Home from "../pages/Home";
// // import NotFound from "../pages/NotFound";

// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/book-service" element={<BookingForm />} />
//         <Route path="/confirmation" element={<Confirmation />} />
//         <Route path="/booking-cancelled" element={<BookingCancelled />} />
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;
