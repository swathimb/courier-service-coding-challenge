export function processInput(
  line,
  courierService,
  currentPackage,
  noOfPackages
) {
  try {
    if (!courierService.baseDeliveryCost) {
      // Base Delivery Cost and Number of Packages
      noOfPackages = handleBaseInput(
        line,
        courierService,
        currentPackage,
        noOfPackages
      );
    } else if (currentPackage < noOfPackages) {
      // Package details
      currentPackage = handlePackageInput(
        line,
        courierService,
        currentPackage,
        noOfPackages
      );
    } else if (!courierService.vehiclesInfo.noVehicles) {
      // Vehicle details
      handleVehicleInput(line, courierService);
    }
    return { currentPackage, noOfPackages };
  } catch (err) {
    console.log("Error processing input:", err.message);
    return;
  }
}

function handleBaseInput(line, courierService, currentPackage, noOfPackages) {
  let [base_cost, no_of_packages] = line.trim().split(" ");
  base_cost = parseInt(base_cost);
  no_of_packages = parseInt(no_of_packages);

  if (isNaN(base_cost) || isNaN(no_of_packages) || no_of_packages <= 0) {
    console.log(
      "Invalid input. Please enter valid base delivery cost and number of packages."
    );
    return;
  }

  courierService.baseDeliveryCost = base_cost;
  noOfPackages = no_of_packages;
  console.log(
    "Enter package details in the format -- pkg_id    pkg_weight_in_kg    distance_in_km    offer_code"
  );
  console.log("Enter details of package", currentPackage + 1);
  return noOfPackages;
}

function handlePackageInput(
  line,
  courierService,
  currentPackage,
  noOfPackages
) {
  const [pkgId, weightStr, distStr, offerCode] = line.trim().split(" ");
  const weight = parseInt(weightStr);
  const distance = parseInt(distStr);
  if (!pkgId || isNaN(weight) || isNaN(distance) || !offerCode) {
    console.log(
      "Invalid input. Please enter input in valid format -- pkg_id    pkg_weight_in_kg    distance_in_km   offer_code."
    );
    return;
  }

  const packageDetails = {
    pkgId,
    weight,
    distance,
    offerCode,
  };

  courierService.packageDetails(packageDetails, currentPackage + 1);
  currentPackage++;

  if (currentPackage === noOfPackages) {
    console.log(
      "Enter vehicle details in the format -- no_of_vehicles    max_speed    max_carriable_weight"
    );
  } else {
    console.log("Enter details of package", currentPackage + 1);
  }
  return currentPackage;
}

function handleVehicleInput(line, courierService) {
  const [noVehiclesStr, speedStr, maxWeightStr] = line.trim().split(" ");
  const noVehicles = parseInt(noVehiclesStr);
  const speed = parseInt(speedStr);
  const maxWeight = parseInt(maxWeightStr);

  if (
    isNaN(noVehicles) ||
    isNaN(speed) ||
    isNaN(maxWeight) ||
    noVehicles <= 0
  ) {
    console.log(
      "Invalid input. Please enter vehicle details in valid format -- no_of_vehicles(>0)    max_speed    max_carriable_weight."
    );
    return;
  }

  const vehiclesInfo = {
    noVehicles,
    speed,
    maxWeight,
  };

  courierService.vehicleDetails(vehiclesInfo);
}

export function processOutput(courierService) {
  const output = courierService.getDeliveryTime();
  if (!output || output.length === 0) {
    console.log("\n***No Input to process***\n");
    return;
  }
  console.log("\nOutput:\n");
  console.log(
    output
      .map(
        (pkg) =>
          `${pkg.pkgId} ${pkg.discount} ${pkg.totalCost} ${parseFloat(
            pkg.estimatedDeliveryTime
          ).toFixed(2)}`
      )
      .join("\n")
  );
}

export function printConsole() {
  console.log("\nEnter input in the following format:\n");
  console.log(
    "base_delivery_cost    no_of_packges\npkg_id1    pkg_weight1_in_kg    distance1_in_km offer_code1\npkg_id2    pkg_weight2_in_kg    distance2_in_km    offer_code2\n...\nno_of_vehicles    max_speed max_carriable_weight\n"
  );
  console.log(
    "Enter base delivery cost and number of packages in the format -- base_delivery_cost    no_of_packges"
  );
}
