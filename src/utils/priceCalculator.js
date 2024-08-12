const servicePrices = {
  gutterCleaning: {
    Garage: 40,
    Conservatory: 40,
    Extension: 40,
  },
  gutterRepairs: {
    "Running Outlet": 65,
    "Union Joint": 65,
    Corner: 65,
    "Gutter Bracket": 65,
    Downpipe: 65,
    "Gutter Length Replacement": 85,
  },
};

const housePrices = {
  Terrace: {
    Bungalow: 59,
    "2 bed House": 69,
    "3 bed House": 79,
    "4 bed House": 99,
    "5 bed House": 129,
    "Town House/3 Stories": 129,
  },
  "Semi-Detached": {
    Bungalow: 69,
    "2 bed House": 79,
    "3 bed House": 89,
    "4 bed House": 99,
    "5 bed House": 139,
    "Town House/3 Stories": 139,
  },
  Detached: {
    Bungalow: 79,
    "2 bed House": 89,
    "3 bed House": 99,
    "4 bed House": 119,
    "5 bed House": 149,
    "Town House/3 Stories": 149,
  },
};

export const calculateTotalPrice = (formData) => {
  let totalPrice = 0;

  // Calculate base price based on house type and style
  const basePrice =
    housePrices[formData.selectHomeStyle]?.[formData.selectHomeType];
  if (basePrice) {
    totalPrice += basePrice;
  }

  // Add prices for gutter cleaning options
  if (formData.selectService === "Gutter Cleaning") {
    formData.gutterCleaningOptions.forEach((option) => {
      totalPrice += servicePrices.gutterCleaning[option] || 0;
    });
  }

  // Add prices for gutter repair options
  if (formData.selectService === "Gutter Repair") {
    formData.gutterRepairsOptions.forEach((option) => {
      totalPrice += servicePrices.gutterRepairs[option] || 0;
    });
  }

  return totalPrice;
};
// // utils/priceCalculator.js
// const servicePrices = {
//   gutterCleaning: {
//     Garage: 40,
//     Conservatory: 40,
//     Extension: 40,
//   },
//   gutterRepairs: {
//     RunningOutlet: 65,
//     UnionJoint: 65,
//     Corner: 65,
//     GutterBracket: 65,
//     Downpipe: 65,
//     GutterLengthReplacement: 85,
//   },
// };

// const housePrices = {
//   Terrace: {
//     Bungalow: 59,
//     "2 bed House": 69,
//     "3 bed House": 79,
//     "4 bed House": 99,
//     "5 bed House": 129,
//   },
//   SemiDetached: {
//     Bungalow: 69,
//     "2 bed House": 79,
//     "3 bed House": 89,
//     "4 bed House": 99,
//     "5 bed House": 139,
//   },
//   Detached: {
//     Bungalow: 79,
//     "2 bed House": 89,
//     "3 bed House": 99,
//     "4 bed House": 119,
//     "5 bed House": 149,
//   },
// };

// /**
//  * Calculates the total price based on the selected services, house type, and house style.
//  * @param {string} selectService - The selected service ('gutterCleaning' or 'gutterRepairs').
//  * @param {string[]} gutterCleaningOptions - The selected options for gutter cleaning.
//  * @param {string[]} gutterRepairsOptions - The selected options for gutter repairs.
//  * @param {string} selectHomeType - The type of home (e.g., '2 bed House').
//  * @param {string} selectHomeStyle - The style of home (e.g., 'Terrace').
//  * @returns {number} - The total calculated price.
//  * @throws {Error} - Throws an error if inputs are invalid.
//  */
// function calculatePrice({
//   selectService,
//   gutterCleaningOptions = [],
//   gutterRepairsOptions = [],
//   selectHomeType = "",
//   selectHomeStyle = "",
// }) {
//   let totalPrice = 0;

//   if (selectService === "gutterCleaning") {
//     gutterCleaningOptions.forEach((option) => {
//       const price = servicePrices.gutterCleaning[option];
//       if (price === undefined) {
//         throw new Error(`Invalid gutter cleaning option: ${option}`);
//       }
//       totalPrice += price;
//     });
//   } else if (selectService === "gutterRepairs") {
//     gutterRepairsOptions.forEach((option) => {
//       const price = servicePrices.gutterRepairs[option];
//       if (price === undefined) {
//         throw new Error(`Invalid gutter repairs option: ${option}`);
//       }
//       totalPrice += price;
//     });
//   }

//   // If house type and style are provided, calculate house cleaning price
//   if (selectHomeType && selectHomeStyle) {
//     const stylePrices = housePrices[selectHomeStyle];
//     if (!stylePrices) {
//       throw new Error("Invalid house style.");
//     }
//     const housePrice = stylePrices[selectHomeType];
//     if (housePrice === "BY QUOTE") {
//       throw new Error("Price is by quote.");
//     }
//     if (housePrice === undefined) {
//       throw new Error("Invalid house type for the selected house style.");
//     }
//     totalPrice += housePrice;
//   }

//   return totalPrice;
// }
// export { calculatePrice };
// Example usage
// try {
//   const formData = {
//     selectService: "gutterCleaning", // 'gutterCleaning' or 'gutterRepairs'
//     gutterCleaningOptions: ["Garage", "Extension"], // Selected gutter cleaning options
//     gutterRepairsOptions: [], // Empty if not applicable
//     selectHomeType: "3 bed House", // Relevant if house cleaning applies
//     selectHomeStyle: "Detached", // Relevant if house cleaning applies
//   };

//   const totalPrice = calculatePrice(formData);
//   console.log(`Total price: £${totalPrice.toFixed(2)}`);
// } catch (error) {
//   console.error(`Error calculating price: ${error.message}`);
// }

// Example usage
// try {
//   const serviceType = "gutterCleaning"; // 'gutterCleaning', 'gutterRepairs', or 'houseCleaning'
//   const selectedServiceOptions = ["Garage", "Extension"]; // Multiple options
//   const houseType = "3 bed House"; // Relevant for 'houseCleaning'
//   const houseStyle = "Detached"; // Relevant for 'houseCleaning'

//   const totalPrice = calculatePrice(
//     serviceType,
//     selectedServiceOptions,
//     houseType,
//     houseStyle
//   );
//   console.log(`Total price: £${totalPrice.toFixed(2)}`);
// } catch (error) {
//   console.error(`Error calculating price: ${error.message}`);
// }
