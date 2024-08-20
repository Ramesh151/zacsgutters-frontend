import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "../pages/Header";
import Home from "../pages/Home";
import ServiceBookingForm from "../components/ServiceBookingForm/index";
import CheckAvailability from "../pages/CheckAvailability";
import Confirmation from "../pages/Confirmation";
import BookingCancelled from "../pages/BookingCancelled";
import PayPalReturn from "../pages/PayPalReturn";
import BookingOverview from "../components/BookingOverview";
import LoginPage from "../components/Admin/LoginPage";
import ForgotPassword from "../components/Admin/ForgotPassword";
import ResetPassword from "../components/Admin/ResetPassword";
import VerifyToken from "../components/Admin/VerifyToken";
import Dashboard from "../components/Admin/Dashboard";
import CustomerList from "../components/Admin/CustomerList";
import DashboardLayout from "../components/Admin/DashboardLayout";
import UserProfile from "../components/Admin/UserProfile";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";

const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet /> 
    </main>
  </>
);

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="book-service" element={<ServiceBookingForm />} />
            <Route path="check-availability" element={<CheckAvailability />} />
            <Route path="booking-overview" element={<BookingOverview />} />
            <Route path="confirmation" element={<Confirmation />} />
            <Route path="booking-cancelled" element={<BookingCancelled />} />
            <Route path="paypal/return" element={<PayPalReturn />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-token/:token" element={<VerifyToken />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<PrivateRoute/>}>
            <Route path="" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="booking" element={<CustomerList />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;





// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
// import Header from "../pages/Header";
// import Home from "../pages/Home";
// import ServiceBookingForm from "../components/ServiceBookingForm/index";
// import CheckAvailability from "../pages/CheckAvailability";
// import Confirmation from "../pages/Confirmation";
// import BookingCancelled from "../pages/BookingCancelled";
// import PayPalReturn from "../pages/PayPalReturn";
// import BookingOverview from "../components/BookingOverview";
// import LoginPage from "../components/Admin/LoginPage";
// import ForgotPassword from "../components/Admin/ForgotPassword";
// import ResetPassword from "../components/Admin/ResetPassword";
// import VerifyToken from "../components/Admin/VerifyToken";
// import Dashboard from "../components/Admin/Dashboard";
// import CustomerList from "../components/Admin/CustomerList";
// import DashboardLayout from "../components/Admin/DashboardLayout";
// import UserProfile from "../components/Admin/UserProfile";
// import { AuthProvider } from "../context/AuthContext";
// import ProtectedAdminRoute from "./PrivateRoute";

// const MainLayout = () => (
//   <>
//     <Header />
//     <main>
//       <Outlet /> 
//     </main>
//   </>
// );

// const AppRoutes = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* User-Facing Routes */}
//           <Route path="/" element={<MainLayout />}>
//             <Route index element={<Home />} />
//             <Route path="book-service" element={<ServiceBookingForm />} />
//             <Route path="check-availability" element={<CheckAvailability />} />
//             <Route path="booking-overview" element={<BookingOverview />} />
//             <Route path="confirmation" element={<Confirmation />} />
//             <Route path="booking-cancelled" element={<BookingCancelled />} />
//             <Route path="paypal/return" element={<PayPalReturn />} />
//           </Route>

//           {/* Protected  Routes */}
//           <Route path="/admin" element={<ProtectedAdminRoute />}>
//             <Route element={<DashboardLayout />}>
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="booking" element={<CustomerList />} />
//               <Route path="profile" element={<UserProfile />} />
//             </Route>
//           </Route>
//            {/* Auth Routes */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-token/:token" element={<VerifyToken />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default AppRoutes;


