import { describe, expect, test, jest } from '@jest/globals';

import { mockPackages1, mockPackages2 } from './mocks/mockPackages';
import {createDeliveryCombinations, calculateDeliveryTimes} from '../services/deliveryService.js';

describe('Delivery Combination', () => {
  test('Should return expected combinations for given weight', () => {
    const maxWeight = 200;
    const combinations = createDeliveryCombinations(mockPackages1, maxWeight);
    expect(combinations.length).toBe(4);
    expect(combinations[0].length).toBe(2);
    expect(combinations[1].length).toBe(1);
    expect(combinations[2].length).toBe(1);
    expect(combinations[3].length).toBe(1);
  });

  test('should sort by distance in ascending order if weight is same', () => {
    const maxWeight = 120;
    const combinations = createDeliveryCombinations(mockPackages2, maxWeight);
    expect(combinations.length).toBe(5);
    expect(combinations[0][0].weight).toBe(combinations[0][1].weight);
    expect(combinations[0][0].distance).toBeLessThan(combinations[0][1].distance);
  });
});

describe('Delivery Time', () => {
  test('should calculate delivery time based on distance and vehicle speed', () => {
    const maxWeight = 200;
    const vehicle = { speed: 50, noVehicles: 2 };
    const combinations = createDeliveryCombinations(mockPackages1, maxWeight);
    expect(combinations[0][0].estimatedDeliveryTime).toBeUndefined();
    calculateDeliveryTimes(combinations, vehicle);
    expect(combinations[0][0].estimatedDeliveryTime).toBeDefined();
  });
});