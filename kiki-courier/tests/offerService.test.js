import { getDiscount } from "../services/offerService";

test('should calculate discount correctly for valid offer code', () => {
    const offers = {
      "OFR001": {   discount: 0.1, weight: (w) => w >= 70 && w <= 200, distance: (d) => d >= 0 && d <= 200 },
    };
    const discount = getDiscount(1000, "OFR001", 150, 100, offers);
    expect(discount).toBe(100);
  });

test('should return 0 discount for invalid offer code', () => {
    const offers = {
      "OFR001": {   discount: 0.1, weight: (w) => w >= 70 && w <= 200, distance: (d) => d >= 0 && d <= 200 },
    };
    const discount = getDiscount(1000, "OFR010", 150, 100, offers);
    expect(discount).toBe(0);
  });  