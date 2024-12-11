import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeModernIcon,
  CalendarDateRangeIcon,
  BellAlertIcon,
  UserIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/outline";
import Dashboard from "./Dashboard";
import Booking from "./CustomerList";
import UserProfile from "./UserProfile";
import { useAuth } from '../../context/AuthContext';
const sidebarItems = [
  { name: "Dashboard", icon: HomeModernIcon, path: "/admin/dashboard" },
  { name: "Booking", icon: CalendarDateRangeIcon, path: "/admin/booking" },
];

export default function DashboardLayout({ children }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const { logout } = useAuth(); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleLogout = () => {
  //   if (window.confirm("Are you sure you want to log out?")) {
  //     try {
  //       // Call the API to log out
  //       const response =  logout()
  //       console.log("addDT LOGOUT",response);
  //       navigate("/admin/login");
  //      }
  //      catch(error){
  //        console.log(error);
         
  //      }
  //    }  
  //   }

    const handleLogout = async (e) => {
      if (window.confirm("Are you sure you want to log out?")) {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      try {
        await logout(); // Use login function from context
        navigate("/");
      } catch (err) {
        console.error('Login error:', err);
  
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please check your credentials.");
        } else {
          setError("An error occurred during login. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }};
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);
  const renderPage = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return <Dashboard />;
      case "/admin/booking":
        return <Booking />;
      case "/admin/profile":
        return <UserProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">
            {/* <img src="https://www.zacsgutters.co.uk/assets/images/logo1.png" alt="Logo" /> */}
          </h1>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
                location.pathname === item.path
                  ? "bg-gray-800"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {sidebarItems.find((item) => item.path === location.pathname)
                ?.name || "Dashboard"}
            </h2>
            <div className="flex items-center">
              {/* Notification Bell */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <BellAlertIcon className="h-6 w-6" />
              </button>

              {/* User Avatar and Dropdown */}
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <UserIcon className="h-8 w-8 text-gray-400" />
                    <ChevronDoubleDownIcon className="ml-2 h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}




// import React, { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   HomeModernIcon,
//   CalendarDateRangeIcon,
//   BellAlertIcon,
//   UserIcon,
//   ChevronDoubleDownIcon,
// } from "@heroicons/react/24/outline";
// import Dashboard from "../Admin/Dashboard";
// import Booking from "../Admin/CustomerList"; 
// import UserProfile from "../Admin/UserProfile"; 

// const sidebarItems = [
//   { name: "Dashboard", icon: HomeModernIcon, path: "/admin/dashboard" },
//   { name: "Booking", icon: CalendarDateRangeIcon, path: "/admin/booking" },
// ];

// export default function DashboardLayout() {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     // Implement logout logic here
//     navigate("/login");
//   };

//   const renderPage = () => {
//     switch (location.pathname) {
//       case "/admin/dashboard":
//         return <Dashboard />;
//       case "/admin/booking":
//         return <Booking />;
//       case "/admin/profile":
//         return <UserProfile />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white">
//         <div className="p-4">
//           <h1 className="text-2xl font-bold">
//             <img src="https://www.zacsgutters.co.uk/assets/images/logo1.png" alt="Logo" />
//           </h1>
//         </div>
//         <nav className="mt-8">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`flex items-center px-4 py-2 mt-2 text-gray-100 ${
//                 location.pathname === item.path
//                   ? "bg-gray-800"
//                   : "hover:bg-gray-700"
//               }`}
//             >
//               <item.icon className="w-6 h-6 mr-3" />
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//             <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//               {sidebarItems.find((item) => item.path === location.pathname)
//                 ?.name || "Dashboard"}
//             </h2>
//             <div className="flex items-center">
//               {/* Notification Bell */}
//               <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 <BellAlertIcon className="h-6 w-6" />
//               </button>

//               {/* User Avatar and Dropdown */}
//               <div className="ml-3 relative">
//                 <div>
//                   <button
//                     className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   >
//                     <UserIcon className="h-8 w-8 text-gray-400" />
//                     <ChevronDoubleDownIcon className="ml-2 h-5 w-5 text-gray-400" />
//                   </button>
//                 </div>
//                 <AnimatePresence>
//                   {isProfileOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//                     >
//                       <Link
//                         to="/admin/profile"
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Edit Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//           <div className="container mx-auto px-6 py-8">{renderPage()}</div>
//         </main>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   HomeModernIcon,
//   CalendarDateRangeIcon,
//   BellAlertIcon,
//   UserIcon,
//   ChevronDoubleDownIcon,
// } from "@heroicons/react/24/outline";
// import { Dialog, Transition } from "@headlessui/react";
// import Dashboard from "./Dashboard";
// import Booking from "./CustomerList";
// // import UserProfile from "./UserProfile";

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: HomeModernIcon,
//     current: true,
//   },
//   {
//     name: "Booking",
//     href: "/booking",
//     icon: CalendarDateRangeIcon,
//     current: false,
//   },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function DashboardLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState("Dashboard");

//   const renderPage = () => {
//     switch (currentPage) {
//       case "Dashboard":
//         return <Dashboard />;
//       case "Booking":
//         return <Booking />;
//       case "Profile":
//         return <UserProfile />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="h-screen flex overflow-hidden bg-gray-100">
//       <Transition.Root show={sidebarOpen} as={React.Fragment}>
//         <Dialog
//           as="div"
//           static
//           className="fixed inset-0 flex z-40 md:hidden"
//           open={sidebarOpen}
//           onClose={setSidebarOpen}
//         >
//           <Transition.Child
//             as={React.Fragment}
//             enter="transition-opacity ease-linear duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="transition-opacity ease-linear duration-300"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
//           </Transition.Child>
//           <Transition.Child
//             as={React.Fragment}
//             enter="transition ease-in-out duration-300 transform"
//             enterFrom="-translate-x-full"
//             enterTo="translate-x-0"
//             leave="transition ease-in-out duration-300 transform"
//             leaveFrom="translate-x-0"
//             leaveTo="-translate-x-full"
//           >
//             <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
//               <Transition.Child
//                 as={React.Fragment}
//                 enter="ease-in-out duration-300"
//                 enterFrom="opacity-0"
//                 enterTo="opacity-100"
//                 leave="ease-in-out duration-300"
//                 leaveFrom="opacity-100"
//                 leaveTo="opacity-0"
//               >
//                 <div className="absolute top-0 right-0 -mr-12 pt-2">
//                   <button
//                     className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//                     onClick={() => setSidebarOpen(false)}
//                   >
//                     <span className="sr-only">Close sidebar</span>
//                     <ChevronDoubleDownIcon
//                       className="h-6 w-6 text-white"
//                       aria-hidden="true"
//                     />
//                   </button>
//                 </div>
//               </Transition.Child>
//               <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
//                 <div className="flex-shrink-0 flex items-center px-4">
//                   <img
//                     className="h-8 w-auto"
//                     src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
//                     alt="Workflow"
//                   />
//                 </div>
//                 <nav className="mt-5 px-2 space-y-1">
//                   {navigation.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.href}
//                       className={classNames(
//                         item.current
//                           ? "bg-indigo-800 text-white"
//                           : "text-white hover:bg-indigo-600 hover:bg-opacity-75",
//                         "group flex items-center px-2 py-2 text-base font-medium rounded-md"
//                       )}
//                       onClick={() => setCurrentPage(item.name)}
//                     >
//                       <item.icon
//                         className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
//                         aria-hidden="true"
//                       />
//                       {item.name}
//                     </Link>
//                   ))}
//                 </nav>
//               </div>
//               <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
//                 <Link
//                   to="#"
//                   className="flex-shrink-0 group block"
//                   onClick={() => setCurrentPage("Profile")}
//                 >
//                   <div className="flex items-center">
//                     <div>
//                       <img
//                         className="inline-block h-10 w-10 rounded-full"
//                         src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                         alt=""
//                       />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-base font-medium text-white">
//                         Tom Cook
//                       </p>
//                       <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
//                         View profile
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </Transition.Child>
//           <div className="flex-shrink-0 w-14" aria-hidden="true">
//             {/* Force sidebar to shrink to fit close icon */}
//           </div>
//         </Dialog>
//       </Transition.Root>

//       {/* Static sidebar for desktop */}
//       <div className="hidden bg-indigo-700 md:flex md:flex-shrink-0">
//         <div className="flex flex-col w-64">
//           {/* Sidebar component, swap this element with another sidebar if you like */}
//           <div className="flex flex-col h-0 flex-1">
//             <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
//               <div className="flex items-center flex-shrink-0 px-4">
//                 <img
//                   className="h-8 w-auto"
//                   src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
//                   alt="Workflow"
//                 />
//               </div>
//               <nav className="mt-5 flex-1 px-2 space-y-1">
//                 {navigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={classNames(
//                       item.current
//                         ? "bg-indigo-800 text-white"
//                         : "text-white hover:bg-indigo-600 hover:bg-opacity-75",
//                       "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
//                     )}
//                     onClick={() => setCurrentPage(item.name)}
//                   >
//                     <item.icon
//                       className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
//                       aria-hidden="true"
//                     />
//                     {item.name}
//                   </Link>
//                 ))}
//               </nav>
//             </div>
//             <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
//               <Link
//                 to="#"
//                 className="flex-shrink-0 w-full group block"
//                 onClick={() => setCurrentPage("Profile")}
//               >
//                 <div className="flex items-center">
//                   <div>
//                     <img
//                       className="inline-block h-9 w-9 rounded-full"
//                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                       alt=""
//                     />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm font-medium text-white">Tom Cook</p>
//                     <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
//                       View profile
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col w-0 flex-1 overflow-hidden">
//         <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
//           <button
//             className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <span className="sr-only">Open sidebar</span>
//             <ChevronDoubleDownIcon className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>
//         <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//               <h1 className="text-2xl font-semibold text-gray-900">
//                 {currentPage}
//               </h1>
//             </div>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
//               {/* Replace with your content */}
//               <div className="py-4">{renderPage()}</div>
//               {/* /End replace */}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
