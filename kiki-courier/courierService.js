import {createDeliveryCombinations, calculateDeliveryTimes} from "./services/deliveryService.js";
import Package from "./models/Package.js";
import {getDiscount} from "./services/offerService.js";
import extractOfferCodes from "./utils/offerCodes.js";

export default class CourierService {
  constructor() {
    this.baseDeliveryCost = 0;
    this.packages = [];
    this.vehiclesInfo = { noVehicles: 0, speed: 0, maxWeight: 0 };
    this.offers = {}
  }

  packageDetails({pkgId, weight, distance, offerCode}, id) {
    const deliveryCost = this.baseDeliveryCost + weight * 10 + distance * 5;
    const discount = getDiscount(deliveryCost, offerCode, distance, weight, this.offers);
    const totalCost = deliveryCost - discount;
    const pckg = new Package(id, pkgId, weight, distance, offerCode);
    pckg.discount = discount;
    pckg.totalCost = totalCost;
    this.packages.push(pckg);
  }

  vehicleDetails({
    noVehicles,
    speed,
    maxWeight,
  }) {
    this.vehiclesInfo = {
      noVehicles,
      speed,
      maxWeight,
    };
  }

  getDeliveryTime() {
    const deliveryCombinations = createDeliveryCombinations(this.packages, this.vehiclesInfo.maxWeight);
    calculateDeliveryTimes(deliveryCombinations, this.vehiclesInfo);
    return deliveryCombinations.flat().sort((a, b) => a.id - b.id);
  }

  getOffers(){
    this.offers = extractOfferCodes();
  }
}