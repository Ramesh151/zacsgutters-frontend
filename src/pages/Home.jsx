import React from "react";
import { useNavigate } from "react-router-dom";
import CheckAvailability from "./CheckAvailability";
// const Header = () => {
//   const navigate = useNavigate();

//   return (
//     <header className="bg-blue-600 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Gutter Cleaning Service</h1>
//         <nav>
//           <button
//             onClick={() => navigate("/")}
//             className="mr-4 hover:text-blue-200"
//           >
//             Home
//           </button>
//           <button
//             onClick={() => navigate("/book-service")}
//             className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
//           >
//             Book Service
//           </button>
//         </nav>
//       </div>
//     </header>
//   );
// };
const ServiceCard = ({ title, description, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Gutter Cleaning",
      description:
        "Professional cleaning to prevent blockages and water damage.",
      icon: "🧹",
    },
    {
      title: "Gutter Repair",
      description: "Expert repairs to fix leaks and structural issues.",
      icon: "🔧",
    },
    {
      title: "Gutter Replacement",
      description:
        "Complete gutter system replacement for improved water management.",
      icon: "🏠",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Expert Gutter Services
          </h1>
          <p className="text-xl mb-8">
            Protect your home with our professional gutter solutions
          </p>
          <button
            onClick={() => navigate("/book-service")}
            className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100 transition duration-300"
          >
            Book a Service
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-200 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">
                Experienced Professionals
              </h3>
              <p>Our team has years of experience in gutter services.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2">Timely Service</h3>
              <p>We respect your time and always arrive as scheduled.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p>
                We stand behind our work with a 100% satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to protect your home?
          </h2>
          <p className="text-xl mb-8">
            Book our professional gutter services today!
          </p>
          <button
            onClick={() => navigate("/book-service")}
            className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     <Header />
  //     <main className="container mx-auto py-8 px-4">
  //       <h1 className="text-4xl font-bold text-center mb-8">
  //         Welcome to Our Gutter Cleaning Service
  //       </h1>
  //       <div className="grid md:grid-cols-2 gap-8">
  //         <div>
  //           <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
  //           <ul className="list-disc list-inside space-y-2">
  //             <li>Professional gutter cleaning</li>
  //             <li>Gutter repair and maintenance</li>
  //             <li>Downspout cleaning and unclogging</li>
  //             <li>Roof debris removal</li>
  //           </ul>
  //         </div>
  //         <CheckAvailability />
  //       </div>
  //     </main>
  //   </div>
  // );
};

export default Home;
