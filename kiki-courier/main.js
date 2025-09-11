import readline from "readline";

import CourierService from "./courierService.js";
import { processInput, processOutput, printConsole } from "./utils/inputHandler.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let noOfPackages = 0;
let currentPackage = 0;

const courierService = new CourierService();
courierService.getOffers();

printConsole();

rl.on("line", (line) => {
  ({ currentPackage, noOfPackages } = processInput(
    line,
    courierService,
    currentPackage,
    noOfPackages
  ));
  if (
    courierService.baseDeliveryCost &&
    currentPackage === noOfPackages &&
    courierService.vehiclesInfo.noVehicles
  ) {
    rl.close();
  }
});

rl.on("close", () => {
  processOutput(courierService);
});
