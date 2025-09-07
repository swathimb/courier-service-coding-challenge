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
    return parseFloat((deliveryCost * offer.discount).toFixed(2));
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
    id: currentLine + 1,
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

function createDeliveryCombinations(packages, maxWeight) {
  let sortedByWeight = [...packages].sort((a, b) => b.weight - a.weight); // sort descending
  let combinations = [];
  while (sortedByWeight.length > 0) {
    let combo = [];
    let sum = 0;

    for (let i = 0; i < sortedByWeight.length; i++) {
      if (sum + sortedByWeight[i].weight <= maxWeight) {
        sum += sortedByWeight[i].weight;
        combo.push(sortedByWeight[i]);
      }
    }

    if (combo.length === 0) break;

    combinations.push(combo);
    sortedByWeight = sortedByWeight.filter(n => !combo.includes(n));

  }
  // Sort combination:
    combinations.sort((a, b) => {
      if (b.length !== a.length) {
        return b.length - a.length; // more elements first
      }
      if (a.length === 1 && b.length === 1) {
        return b[0] - a[0]; // single-element combos: sort descending
      }
      return 0; // keep order otherwise
    });

    return combinations;
}

function calculateDeliveryTimes(deliveryCombinations, vehiclesInfo) {
  let vehicles = new Array(vehiclesInfo.noVehicles).fill(0);
  for(let i = 0; i < deliveryCombinations.length; i++) {
    let nextVehicleIndex = vehicles.indexOf(Math.min(...vehicles));
    let j =0;
    let estimatedTime = [];
    while(j < deliveryCombinations[i].length) {
      const time = parseFloat((deliveryCombinations[i][j].distance / vehiclesInfo.speed).toFixed(2));
      deliveryCombinations[i][j].estimatedDeliveryTime = (vehicles[nextVehicleIndex] + time);
      estimatedTime.push(time);
      j++;
    }

    let deliveryTime = Math.max(...estimatedTime);
    if(i < deliveryCombinations.length + 1){
      vehicles[nextVehicleIndex] = vehicles[nextVehicleIndex] + 2 * deliveryTime;
    } else {
      vehicles[nextVehicleIndex] += deliveryTime;
    }
  }
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
  const deliveryCombinations = createDeliveryCombinations(packages, vehiclesInfo.maxWeight);
  calculateDeliveryTimes(deliveryCombinations, vehiclesInfo);
  const output = deliveryCombinations.flat().sort((a, b) => a.id - b.id);
  console.log(output.map(pkg => `${pkg.pkgId} ${pkg.discount} ${pkg.totalCost} ${pkg.estimatedDeliveryTime}`).join("\n"));

});
