const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Offers definition
const offers = {
  OFR001: {
    discount: 0.1,
    distance: (d) => d < 200,
    weight: (w) => w >= 70 && w <= 200,
  },
  OFR002: {
    discount: 0.07,
    distance: (d) => d >= 50 && d <= 150,
    weight: (w) => w >= 100 && w <= 250,
  },
  OFR003: {
    discount: 0.05,
    distance: (d) => d >= 50 && d <= 250,
    weight: (w) => w >= 10 && w <= 150,
  },
};

let baseCost, noOfPackages;
let packages = [];
let vehiclesInfo = null;
let currentLine = 0;

console.log("\nEnter input in the following format:\n");
console.log(
  "base_delivery_cost    no_of_packges\npkg_id1    pkg_weight1_in_kg    distance1_in_km offer_code1\npkg_id2    pkg_weight2_in_kg    distance2_in_km    offer_code2\n...\nno_of_vehicles    max_speed max_carriable_weight\n"
);
console.log(
  "Enter base delivery cost and number of packages in the format -- base_delivery_cost    no_of_packges"
);

// Check discount eligibility
function getDiscount(deliveryCost, offerCode, distance, weight) {
  const offer = offers[offerCode];
  if (offer && offer.distance(distance) && offer.weight(weight)) {
    return deliveryCost * offer.discount;
  }
  return 0;
}

function handleBaseInput(line) {
  const [bc, np] = line.trim().split(" ");
  if (isNaN(parseInt(bc)) || isNaN(parseInt(np)) || parseInt(np) <= 0) {
    console.log(
      "Invalid input. Please enter valid base delivery cost and number of packages."
    );
  } else {
    baseCost = parseInt(bc);
    noOfPackages = parseInt(np);
  }
  if (baseCost) {
    console.log(
      "Enter package details in the format -- pkg_id    pkg_weight_in_kg    distance_in_km    offer_code"
    );
    console.log("Enter details of package", currentLine + 1);
  }
}

function handlepackageDetails(line) {
  const [pkgId, weightStr, distStr, offerCode] = line.trim().split(" ");

  if (
    !pkgId ||
    isNaN(parseInt(weightStr)) ||
    isNaN(parseInt(distStr)) ||
    !offerCode
  ) {
    console.log(
      "Invalid input. Please enter input in valid format -- pkg_id    pkg_weight_in_kg    distance_in_km   offer_code."
    );
    return;
  }

  const weight = parseInt(weightStr);
  const distance = parseInt(distStr);
  const deliveryCost = baseCost + weight * 10 + distance * 5;
  const discount = getDiscount(deliveryCost, offerCode, distance, weight);
  const totalCost = deliveryCost - discount;
  packages.push({
    pkgId,
    weight,
    distance,
    offerCode,
    discount,
    totalCost,
  });
  currentLine++;
  if (currentLine === noOfPackages) {
    console.log(
      "Enter vehicle details in the format -- no_of_vehicles    max_speed    max_carriable_weight"
    );
  } else {
    console.log("Enter details of package", currentLine + 1);
  }
}

function handleVehicleDetails(line) {
  const [noVehiclesStr, speedStr, maxWeightStr] = line.trim().split(" ");
  if (
    isNaN(parseInt(noVehiclesStr)) ||
    isNaN(parseInt(speedStr)) ||
    isNaN(parseInt(maxWeightStr)) ||
    parseInt(noVehiclesStr) <= 0
  ) {
    console.log(
      "Invalid input. Please enter vehicle details in valid format -- no_of_vehicles    max_speed    max_carriable_weight."
    );
    return;
  }
  vehiclesInfo = {
    noVehicles: parseInt(noVehiclesStr),
    speed: parseInt(speedStr),
    maxWeight: parseInt(maxWeightStr),
  };
  rl.close();
}

rl.on("line", (line) => {
  if (!baseCost) {
    // Base Delivery Cost and Number of Packages
    handleBaseInput(line);
  } else if (currentLine < noOfPackages) {
    // Package details
    handlepackageDetails(line);
  } else if (!vehiclesInfo) {
    // Vehicle details
    handleVehicleDetails(line);
  }
});

rl.on("close", () => {
  console.log("\nAll inputs received successfully!");
  console.log("Packages:", packages);
  console.log("Vehicles Info:", vehiclesInfo);
});
