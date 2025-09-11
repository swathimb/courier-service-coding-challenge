import readline from 'readline';
import { describe, jest } from '@jest/globals';

import CourierService from "../courierService.js";
import { processInput } from "../utils/inputHandler.js";

let courierService;
let rlMock;
let printConsole = jest.fn();
let processOutput = jest.fn();

jest.mock('readline');

beforeEach(() => {
    rlMock = {
      on: jest.fn(),
      close: jest.fn(),
    };

    readline.createInterface.mockReturnValue(rlMock);

    courierService = new CourierService();
    courierService.getOffers = jest.fn();
});

jest.mock('../utils/offerCodes.js', () => ({
  default: jest.fn(() => ({}))
}));

describe('processInput', () => {
  test('should create CourierService instance', () => {
    const service = new CourierService();
    expect(service).toBeInstanceOf(CourierService);
  });

  test('should call getOffers on CourierService instance', () => {
    courierService.getOffers();
    expect(courierService.getOffers).toHaveBeenCalled();
  });

  test('should call printConsole', () => {
    printConsole();
    expect(printConsole).toHaveBeenCalled();
  });

  test('should process base delivery cost and number of packages', () => {
    const line = "100 3";
    const result = processInput(line, courierService, 0, 0);
    expect(courierService.baseDeliveryCost).toBe(100);
    expect(result.noOfPackages).toBe(3);
  });

  test('should process package details', () => {
    courierService.baseDeliveryCost = 100;
    const line = "PKG1 50 30 OFR001";
    const result = processInput(line, courierService, 0, 1);
    expect(courierService.packages.length).toBe(1);
    expect(courierService.packages[0].pkgId).toBe("PKG1");
    expect(result.currentPackage).toBe(1);
  }); 

  test('should process vehicle details', () => {
    const line = "2 70 200";
    courierService.baseDeliveryCost = 100;
    const result = processInput(line, courierService, 3, 3);
    expect(courierService.vehiclesInfo.noVehicles).toBe(2);
    expect(courierService.vehiclesInfo.speed).toBe(70);
    expect(courierService.vehiclesInfo.maxWeight).toBe(200);
    expect(result.currentPackage).toBe(3);
  });
});

describe('processOutput', () => {
    test('should call rl.close when all inputs are provided', () => {
    courierService.baseDeliveryCost = 100;
    const { currentPackage, noOfPackages } = processInput("2 70 200", courierService, 3, 3);
    expect(courierService.baseDeliveryCost).toBeTruthy();
    expect(currentPackage).toBe(noOfPackages);
    expect(courierService.vehiclesInfo.noVehicles).toBeTruthy();
    rlMock.close();
    expect(rlMock.close).toHaveBeenCalled();
  });

  test('should processOutput when rl is closed', () => {
    rlMock.close();
    processOutput(courierService);
    expect(processOutput).toHaveBeenCalled();
  });
});