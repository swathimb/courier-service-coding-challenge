import {jest, describe, test, expect, beforeEach} from '@jest/globals';

import CourierService from "../courierService.js";
import { mockPackageCombination } from './mocks/mockPackageCombination.js';
import Package from '../models/Package.js';
import { mockPackages1 } from './mocks/mockPackages.js';

// Mock the dependencies
jest.mock("../services/deliveryService.js", () => ({
  createDeliveryCombinations: jest.fn(() => mockPackageCombination), // mock return
  calculateDeliveryTimes: jest.fn(),
}));

jest.mock("../services/offerService.js", () => ({
  getDiscount: jest.fn(() => 50), // always return discount 50
}));

jest.mock("../utils/offerCodes.js", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    OFR001: {
      discount: 0.1,
      weight: () => true,
      distance: () => true,
    },
  })),
}));

describe("CourierService", () => {
    let courierService;
    beforeEach(() => {
        courierService = new CourierService();
    });

    test("should initialize with default values", () => {
        expect(courierService.baseDeliveryCost).toBe(0);
        expect(courierService.packages).toEqual([]);
        expect(courierService.vehiclesInfo).toEqual({ noVehicles: 0, speed: 0, maxWeight: 0 });
        expect(courierService.offers).toEqual({});
    });

    test("should add package details correctly", () => {
        courierService.baseDeliveryCost = 100;
        const packageData = { pkgId: "PKG1", weight: 50, distance: 30, offerCode: "OFR001" };
        courierService.packageDetails(packageData, 1);
        expect(courierService.packages.length).toBe(1);
        const addedPackage = courierService.packages[0];
        expect(addedPackage).toBeInstanceOf(Package);
        expect(addedPackage.pkgId).toBe("PKG1");
        expect(addedPackage.weight).toBe(50);
        expect(addedPackage.distance).toBe(30);
        expect(addedPackage.offerCode).toBe("OFR001");
        expect(addedPackage.discount).toBe(50); 
        expect(addedPackage.totalCost).toBe(100 + 50 * 10 + 30 * 5 - 50);
    });

    test("should set vehicle details correctly", () => {
        const vehicleData = { noVehicles: 2, speed: 70, maxWeight: 200 };
        courierService.vehicleDetails(vehicleData);
        expect(courierService.vehiclesInfo).toEqual(vehicleData);
    });

    test("should get delivery time correctly", () => {
        courierService.packages = mockPackages1;
        courierService.vehiclesInfo = { noVehicles: 2, speed: 70, maxWeight: 200 };
        const deliveryTimes = courierService.getDeliveryTime();
        expect(deliveryTimes[0].estimatedDeliveryTime).toBeDefined();
        expect(deliveryTimes[1].estimatedDeliveryTime).toBeDefined();
    });

    test("should extract offers correctly", () => {
        courierService.getOffers();
        expect(courierService.offers).toHaveProperty("OFR001");
        expect(courierService.offers.OFR001).toEqual({
            discount: 0.1,
            weight: expect.any(Function),
            distance: expect.any(Function),
        });
    });
});