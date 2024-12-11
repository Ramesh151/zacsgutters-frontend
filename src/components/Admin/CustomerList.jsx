import React, { useState, useEffect, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import {
  MagnifyingGlassCircleIcon,
  ChevronUpDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";


function CustomerInfoModal({ isOpen, onClose, customerId }) {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && customerId) {
      setLoading(true);
      setError(null);
      axios
        .get(`/api/customers/${customerId}`)
        .then((response) => {
          setCustomerInfo(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load customer information");
          setLoading(false);
        });
    }
  }, [isOpen, customerId]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-lg w-full"
      >
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {customerInfo && (
          <div>
            <p>
              <strong>Name:</strong> {customerInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {customerInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {customerInfo.phone}
            </p>
            {/* Add more customer information fields as needed */}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Booking() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = api.get("")
        setCustomers(response.data);
      } catch (err) {
        setError("Failed to fetch customer data");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`/api/customers/${id}`);
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer. Please try again.");
      }
    }
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortType: "alphanumeric",
      },
      {
        Header: "Date",
        accessor: "date",
        sortType: "basic",
      },
      {
        Header: "Time",
        accessor: "time",
        sortType: "basic",
      },
      {
        Header: "Total",
        accessor: "total",
        sortType: "basic",
        Cell: ({ value }) => `$${value}`,
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        sortType: "basic",
      },
      {
        Header: "Action",
        accessor: "id",
        disableSortBy: true,
        Cell: ({ value }) => (
          <button
            onClick={() => {
              setSelectedCustomerId(value);
              setModalOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        ),
      },
    ],
    []
  );

  const [pageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    pageOptions,
    state: { pageIndex: currentPageIndex, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: customers,
      initialState: { pageIndex, pageSize },
      manualPagination: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
        <input
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || undefined)}
          placeholder="Search all data..."
          className="p-2 border rounded w-full"
        />
      </div>
      {loading && <p>Loading customer data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column.id}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.canSort && (
                            <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <motion.tr
                      key={row.id}
                      {...row.getRowProps()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {row.cells.map((cell) => (
                        <motion.td
                          key={cell.id}
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          {cell.render("Cell")}
                        </motion.td>
                      ))}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination mt-2 flex justify-between items-center">
            <motion.button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Previous
            </motion.button>
            <span>
              Page{" "}
              <strong>
                {currentPageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <motion.button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <CustomerInfoModal
            isOpen={modalOpen}
            onClose={closeModal}
            customerId={selectedCustomerId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}








// import React, { useState, useCallback } from "react";
// import {
//   useTable,
//   useSortBy,
//   usePagination,
//   useGlobalFilter,
// } from "react-table";
// import {
//   MagnifyingGlassCircleIcon,
//   ChevronUpDownIcon,
//   EllipsisHorizontalIcon,
// } from "@heroicons/react/20/solid";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";

// function CustomerInfoModal({ isOpen, onClose, customerId }) {
//   const [customerInfo, setCustomerInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   React.useEffect(() => {
//     if (isOpen && customerId) {
//       setLoading(true);
//       setError(null);
//       axios
//         .get(`/api/customers/${customerId}`)
//         .then((response) => {
//           setCustomerInfo(response.data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           setError("Failed to load customer information");
//           setLoading(false);
//         });
//     }
//   }, [isOpen, customerId]);

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.9 }}
//         className="bg-white rounded-lg p-6 max-w-lg w-full"
//       >
//         <h2 className="text-xl font-bold mb-4">Customer Information</h2>
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {customerInfo && (
//           <div>
//             <p>
//               <strong>Name:</strong> {customerInfo.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {customerInfo.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {customerInfo.phone}
//             </p>
//             {/* Add more customer information fields as needed */}
//           </div>
//         )}
//         <button
//           onClick={onClose}
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Close
//         </button>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default function Booking() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const deleteCustomer = useCallback(async (id) => {
//     if (window.confirm("Are you sure you want to delete this customer?")) {
//       try {
//         // Make an API call to delete the customer
//         await axios.delete(`/api/customers/${id}`);
        
//         // Update the local state
//         setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== id));
//       } catch (error) {
//         console.error("Error deleting customer:", error);
//         alert("Failed to delete customer. Please try again.");
//       }
//     }
//   }, []);

//   const data = React.useMemo(
//     () => [
//       {
//         id: 1,
//         name: "John Doe",
//         date: "2023-08-20",
//         time: "10:00 AM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       {
//         id: 2,
//         name: "Jane Smith",
//         date: "2023-08-21",
//         time: "2:00 PM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       {
//         id: 3,
//         name: "Bob Johnson",
//         date: "2023-08-22",
//         time: "11:30 AM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       {
//         id: 4,
//         name: "Alice Brown",
//         date: "2023-08-23",
//         time: "3:00 PM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       {
//         id: 5,
//         name: "Charlie Davis",
//         date: "2023-08-24",
//         time: "1:00 PM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       {
//         id: 6,
//         name: "Emily Evans",
//         date: "2023-08-25",
//         time: "4:00 PM",
//         total: "120",
//         paymentStatus: "Success",
//       },
//       // Add more data here...
//     ],
//     []
//   );

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "name",
//         sortType: "alphanumeric",
//       },
//       {
//         Header: "Date",
//         accessor: "date",
//         sortType: "basic",
//       },
//       {
//         Header: "Time",
//         accessor: "time",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "total",
//         sortType: "basic",
//         Cell: ({ value }) => `$${value}`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//       },
//       {
//         Header: "Action",
//         accessor: "id",
//         disableSortBy: true,
//         Cell: ({ value }) => (
//           <button
//             onClick={() => {
//               setSelectedCustomerId(value);
//               setModalOpen(true);
//             }}
//             className="text-blue-500 hover:text-blue-700"
//           >
//             <EllipsisHorizontalIcon className="h-5 w-5" />
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   const [pageSize] = useState(10);
//   const [pageIndex, setPageIndex] = useState(0);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     previousPage,
//     nextPage,
//     pageOptions,
//     state: { pageIndex: currentPageIndex, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex, pageSize },
//       manualPagination: false,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={globalFilter || ""}
//           onChange={(e) => setGlobalFilter(e.target.value || undefined)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>
//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table
//               {...getTableProps()}
//               className="min-w-full divide-y divide-gray-200"
//             >
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup) => (
//                   <tr
//                     key={headerGroup.id}
//                     {...headerGroup.getHeaderGroupProps()}
//                   >
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         key={column.id}
//                         {...column.getHeaderProps(
//                           column.getSortByToggleProps()
//                         )}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       >
//                         <div className="flex items-center">
//                           {column.render("Header")}
//                           {column.canSort && (
//                             <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                           )}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody
//                 {...getTableBodyProps()}
//                 className="bg-white divide-y divide-gray-200"
//               >
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <motion.tr
//                       key={row.id}
//                       {...row.getRowProps()}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell) => (
//                         <motion.td
//                           key={cell.id}
//                           {...cell.getCellProps()}
//                           className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                         >
//                           {cell.render("Cell")}
//                         </motion.td>
//                       ))}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div className="pagination mt-2 flex justify-between items-center">
//             <motion.button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Previous
//             </motion.button>
//             <span>
//               Page{" "}
//               <strong>
//                 {currentPageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <motion.button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Next
//             </motion.button>
//           </div>
//         </div>
//       </div>
//       <AnimatePresence>
//         {modalOpen && (
//           <CustomerInfoModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             customerId={selectedCustomerId}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
// import { MagnifyingGlassCircleIcon,ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { motion } from "framer-motion";

// export default function Booking() {
//   const data = React.useMemo(
//     () => [
//       { id: 1, name: "John Doe", date: "2023-08-20", time: "10:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 2, name: "Jane Smith", date: "2023-08-21", time: "2:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 3, name: "Bob Johnson", date: "2023-08-22", time: "11:30 AM", total: "120", paymentStatus: "Success" },
//       { id: 4, name: "Alice Brown", date: "2023-08-23", time: "3:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 5, name: "Charlie Davis", date: "2023-08-24", time: "1:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 6, name: "Emily Evans", date: "2023-08-25", time: "4:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 7, name: "Frank Harris", date: "2023-08-26", time: "9:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 8, name: "Grace Martin", date: "2023-08-27", time: "5:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 9, name: "Henry Nelson", date: "2023-08-28", time: "6:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 10, name: "Isabella Owens", date: "2023-08-29", time: "7:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 11, name: "Jack Phillips", date: "2023-08-30", time: "8:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 12, name: "Katherine Quinn", date: "2023-08-31", time: "12:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 13, name: "Liam Roberts", date: "2023-09-01", time: "2:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 14, name: "Mia Scott", date: "2023-09-02", time: "3:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 15, name: "Noah Taylor", date: "2023-09-03", time: "1:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 16, name: "Olivia Turner", date: "2023-09-04", time: "11:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 17, name: "Paul Underwood", date: "2023-09-05", time: "4:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 18, name: "Quinn Vance", date: "2023-09-06", time: "6:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 19, name: "Riley Walker", date: "2023-09-07", time: "7:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 20, name: "Sophia Young", date: "2023-09-08", time: "8:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 21, name: "Thomas Zimmerman", date: "2023-09-09", time: "10:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 22, name: "Ursula Adams", date: "2023-09-10", time: "11:30 AM", total: "120", paymentStatus: "Success" },
//       { id: 23, name: "Victor Bennett", date: "2023-09-11", time: "1:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 24, name: "Wendy Clark", date: "2023-09-12", time: "3:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 25, name: "Xander Davis", date: "2023-09-13", time: "4:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 26, name: "Yara Evans", date: "2023-09-14", time: "5:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 27, name: "Zachary Ford", date: "2023-09-15", time: "7:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 28, name: "Alice Green", date: "2023-09-16", time: "8:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 29, name: "Brian Harris", date: "2023-09-17", time: "10:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 30, name: "Catherine James", date: "2023-09-18", time: "11:30 AM", total: "120", paymentStatus: "Success" },
//       { id: 31, name: "Daniel King", date: "2023-09-19", time: "1:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 32, name: "Eva Lee", date: "2023-09-20", time: "3:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 33, name: "Freddie Martinez", date: "2023-09-21", time: "4:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 34, name: "Gina Nelson", date: "2023-09-22", time: "5:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 35, name: "Henry O'Connor", date: "2023-09-23", time: "7:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 36, name: "Ivy Parker", date: "2023-09-24", time: "8:00 AM", total: "120", paymentStatus: "Success" },
//       { id: 37, name: "Jacob Quinn", date: "2023-09-25", time: "9:30 AM", total: "120", paymentStatus: "Success" },
//       { id: 38, name: "Kylie Ross", date: "2023-09-26", time: "12:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 39, name: "Liam Smith", date: "2023-09-27", time: "2:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 40, name: "Molly Taylor", date: "2023-09-28", time: "3:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 41, name: "Nathaniel Underwood", date: "2023-09-29", time: "5:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 42, name: "Olivia Vance", date: "2023-09-30", time: "6:30 PM", total: "120", paymentStatus: "Success" },
//       { id: 43, name: "Patrick Walker", date: "2023-10-01", time: "7:00 PM", total: "120", paymentStatus: "Success" },
//       { id: 44, name: "Quinn Young", date: "2023-10-02", time: "8:00 AM", total: "120", paymentStatus: "Success" },
//     ],
//     []
//   );

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "name",
//         sortType: "basic",
//       },
//       {
//         Header: "Date",
//         accessor: "date",
//         sortType: "basic",
//       },
//       {
//         Header: "Time",
//         accessor: "time",
//         sortType: "basic",
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "total",
//         sortType: "basic",
//         Cell: ({ value }) => `$${value}`,
//       },
//     ],
//     []
//   );

//   const [pageSize] = useState(10);
//   const [pageIndex, setPageIndex] = useState(0);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     previousPage,
//     nextPage,
//     pageOptions,
//     state: { pageIndex: currentPageIndex, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex, pageSize },
//       manualPagination: false,
//     },
//     useGlobalFilter, // Use the useGlobalFilter hook for global searching
//     useSortBy, // Use the useSortBy hook for sorting columns
//     usePagination // Add pagination hook
//   );

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={globalFilter || ""}
//           onChange={(e) => setGlobalFilter(e.target.value || undefined)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>
//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//         <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup) => (
//                   <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         key={column.id}
//                         {...column.getHeaderProps(column.getSortByToggleProps())}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                       >
//                         <div className="flex items-center">
//                           {column.render("Header")}
//                           <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
//                 {page.map((row) => {
//                   prepareRow(row);
//                   return (
//                     <motion.tr
//                       key={row.id}
//                       {...row.getRowProps()}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell) => (
//                         <motion.td
//                           key={cell.id}
//                           {...cell.getCellProps()}
//                           className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                         >
//                           {cell.render("Cell")}
//                         </motion.td>
//                       ))}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div className="pagination mt-2 flex justify-between items-center">
//             <motion.button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Previous
//             </motion.button>
//             <span>
//               Page{" "}
//               <strong>
//                 {currentPageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <motion.button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Next
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
// import { MagnifyingGlassCircleIcon, ChevronUpIcon, ChevronDownIcon,ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { motion } from "framer-motion";

// export default function Booking() {
//   const data = React.useMemo(
//     () => [
//       { id: 1, name: "John Doe", date: "2023-08-20", time: "10:00 AM", total: "120" },
//       { id: 2, name: "Jane Smith", date: "2023-08-21", time: "2:00 PM", total: "120" },
//       { id: 3, name: "Bob Johnson", date: "2023-08-22", time: "11:30 AM", total: "120" },
//       // Add more data here...
//     ],
//     []
//   );

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "name",
//         sortType: "basic",
//       },
//       {
//         Header: "Date",
//         accessor: "date",
//         sortType: "basic",
//       },
//       {
//         Header: "Time",
//         accessor: "time",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "total",
//         sortType: "basic",
//       },
//     ],
//     []
//   );

//   const [pageSize] = useState(2);
//   const [pageIndex, setPageIndex] = useState(0);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     previousPage,
//     nextPage,
//     pageOptions,
//     state: { pageIndex: currentPageIndex, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex, pageSize },
//       manualPagination: false,
//     },
//     useGlobalFilter, // Use the useGlobalFilter hook for global searching
//     useSortBy, // Use the useSortBy hook for sorting columns
//     usePagination // Add pagination hook
//   );

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={globalFilter || ""}
//           onChange={(e) => setGlobalFilter(e.target.value || undefined)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>
//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup) => (
//                   <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column) => (
//                       <th
//                         key={column.id}
//                         {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting toggle props
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         <div className="flex items-center">
//                           {column.render("Header")}
//                           {column.isSorted ? (
//                             column.isSortedDesc ? (
//                               <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                             ) : (
//                               <ChevronUpIcon className="ml-2 h-4 w-4 text-gray-400" />
//                             )
//                           ) : (
//                             ""
//                           )}
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
//                 {page.map((row) => {
//                   prepareRow(row);
//                   const { key, ...rowProps } = row.getRowProps();
//                   return (
//                     <motion.tr key={key} {...rowProps} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                       {row.cells.map((cell) => {
//                         const { key, ...cellProps } = cell.getCellProps();
//                         return (
//                           <motion.td key={key} {...cellProps} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {cell.render("Cell")}
//                           </motion.td>
//                         );
//                       })}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//           <div className="pagination mt-2 flex justify-between items-center">
//             <motion.button
//               onClick={() => previousPage()}
//               disabled={!canPreviousPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Previous
//             </motion.button>
//             <span>
//               Page{" "}
//               <strong>
//                 {currentPageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <motion.button
//               onClick={() => nextPage()}
//               disabled={!canNextPage}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               Next
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
